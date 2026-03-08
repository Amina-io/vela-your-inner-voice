import { useState, useRef, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const SUPABASE_URL = "https://pbtjpbauothcawqomgne.supabase.co";

const TRACK_NAMES: Record<number, string> = {
  432: "432hz.mp3",
  528: "528hz.mp3",
  396: "396hz.mp3",
  741: "741hz.mp3",
};

const TOTAL_DURATION = 600; // 10 minutes in seconds

interface TrackData {
  voicePath: string;
  hzFrequency: number;
  musicTrackKey: string;
}

export function useTrackPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [trackData, setTrackData] = useState<TrackData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const ctxRef = useRef<AudioContext | null>(null);
  const musicSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const voiceSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const musicGainRef = useRef<GainNode | null>(null);
  const voiceGainRef = useRef<GainNode | null>(null);
  const musicBufferRef = useRef<AudioBuffer | null>(null);
  const voiceBufferRef = useRef<AudioBuffer | null>(null);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef(0);
  const elapsedBeforePauseRef = useRef(0);

  // Fetch the user's latest ready track on mount
  useEffect(() => {
    const fetchTrack = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setLoading(false);
          setError("Not authenticated");
          return;
        }

        const { data: track, error: trackErr } = await supabase
          .from("tracks")
          .select("voice_audio_path, hz_frequency, music_track_key")
          .eq("user_id", session.user.id)
          .eq("generation_status", "ready")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (trackErr || !track || !track.voice_audio_path) {
          setTrackData(null);
          setLoading(false);
          return;
        }

        setTrackData({
          voicePath: track.voice_audio_path,
          hzFrequency: track.hz_frequency,
          musicTrackKey: track.music_track_key,
        });
      } catch (e: any) {
        console.error("[Vela] Track fetch error:", e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTrack();
  }, []);

  const stopAll = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    try { musicSourceRef.current?.stop(); } catch {}
    try { voiceSourceRef.current?.stop(); } catch {}
    musicSourceRef.current = null;
    voiceSourceRef.current = null;
  }, []);

  const startSources = useCallback((ctx: AudioContext, musicBuf: AudioBuffer, voiceBuf: AudioBuffer, offset: number) => {
    // Music source (loop)
    const musicSource = ctx.createBufferSource();
    musicSource.buffer = musicBuf;
    musicSource.loop = true;
    const musicGain = ctx.createGain();
    musicGain.gain.value = 1.0;
    musicSource.connect(musicGain).connect(ctx.destination);
    musicGainRef.current = musicGain;
    musicSourceRef.current = musicSource;

    // Voice source (loop)
    const voiceSource = ctx.createBufferSource();
    voiceSource.buffer = voiceBuf;
    voiceSource.loop = true;
    const voiceGain = ctx.createGain();
    voiceGain.gain.value = 0.15;
    voiceSource.connect(voiceGain).connect(ctx.destination);
    voiceGainRef.current = voiceGain;
    voiceSourceRef.current = voiceSource;

    // Start both simultaneously
    const now = ctx.currentTime;
    musicSource.start(now, offset % musicBuf.duration);
    voiceSource.start(now, offset % voiceBuf.duration);

    startTimeRef.current = Date.now();

    // Timer
    timerRef.current = window.setInterval(() => {
      const total = elapsedBeforePauseRef.current + (Date.now() - startTimeRef.current) / 1000;
      if (total >= TOTAL_DURATION) {
        stopAll();
        setIsPlaying(false);
        setElapsed(TOTAL_DURATION);
        elapsedBeforePauseRef.current = 0;
      } else {
        setElapsed(Math.floor(total));
      }
    }, 250);
  }, [stopAll]);

  const loadBuffers = useCallback(async (ctx: AudioContext): Promise<{ music: AudioBuffer; voice: AudioBuffer }> => {
    if (musicBufferRef.current && voiceBufferRef.current) {
      return { music: musicBufferRef.current, voice: voiceBufferRef.current };
    }
    if (!trackData) throw new Error("No track data");

    // Voice signed URL
    const { data: signedData, error: signErr } = await supabase.storage
      .from("voice-audio")
      .createSignedUrl(trackData.voicePath, 3600);
    if (signErr || !signedData?.signedUrl) throw new Error("Could not get voice audio URL");

    // Music public URL
    const musicFileName = TRACK_NAMES[trackData.hzFrequency] || `${trackData.hzFrequency}hz.mp3`;
    const musicUrl = `${SUPABASE_URL}/storage/v1/object/public/music-tracks/${musicFileName}`;

    // Fetch both in parallel
    const [musicRes, voiceRes] = await Promise.all([
      fetch(musicUrl),
      fetch(signedData.signedUrl),
    ]);

    if (!musicRes.ok) throw new Error(`Music fetch failed: ${musicRes.status}`);
    if (!voiceRes.ok) throw new Error(`Voice fetch failed: ${voiceRes.status}`);

    const [musicArrayBuf, voiceArrayBuf] = await Promise.all([
      musicRes.arrayBuffer(),
      voiceRes.arrayBuffer(),
    ]);

    const [musicBuf, voiceBuf] = await Promise.all([
      ctx.decodeAudioData(musicArrayBuf),
      ctx.decodeAudioData(voiceArrayBuf),
    ]);

    musicBufferRef.current = musicBuf;
    voiceBufferRef.current = voiceBuf;
    return { music: musicBuf, voice: voiceBuf };
  }, [trackData]);

  const togglePlay = useCallback(async () => {
    if (!trackData) return;

    // PAUSE
    if (isPlaying && ctxRef.current) {
      elapsedBeforePauseRef.current += (Date.now() - startTimeRef.current) / 1000;
      stopAll();
      await ctxRef.current.suspend();
      setIsPlaying(false);
      return;
    }

    // PLAY / RESUME
    try {
      // Create or resume AudioContext inside user gesture
      if (!ctxRef.current) {
        ctxRef.current = new AudioContext();
      }
      if (ctxRef.current.state === "suspended") {
        await ctxRef.current.resume();
      }

      const ctx = ctxRef.current;
      const { music, voice } = await loadBuffers(ctx);
      startSources(ctx, music, voice, elapsedBeforePauseRef.current);
      setIsPlaying(true);
    } catch (e: any) {
      console.error("[Vela] Play error:", e);
      setError(e.message);
    }
  }, [trackData, isPlaying, loadBuffers, startSources, stopAll]);

  // Cleanup
  useEffect(() => {
    return () => {
      stopAll();
      if (ctxRef.current) {
        ctxRef.current.close().catch(() => {});
        ctxRef.current = null;
      }
    };
  }, [stopAll]);

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return {
    isPlaying,
    elapsed,
    formattedTime: formatTime(elapsed),
    trackReady: !!trackData,
    loading,
    error,
    hzFrequency: trackData?.hzFrequency ?? null,
    togglePlay,
  };
}
