import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MobileShell } from "@/components/vela/MobileShell";
import { WaveformBars, AmbientBlobs } from "@/components/vela/Decoratives";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const READING_SCRIPT = "I am exactly where I need to be. Every day I wake up feeling clear, grounded, and ready. My voice carries warmth and intention. I speak with ease. I trust myself completely. The life I am building is already becoming real. I feel it in my body, in my breath, in the way I move through the world. I am open. I am ready. I am here.";

type ScreenState =
  | "pre"
  | "recording"
  | "post"
  | "cloning"
  | "generating"
  | "error";

const VoiceRecordingScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const navState = (location.state as any) || {};
  const userName = navState.userName || "Friend";

  const [state, setState] = useState<ScreenState>("pre");
  const [timer, setTimer] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [voiceId, setVoiceId] = useState<string | null>(null);
  const [signedAudioUrl, setSignedAudioUrl] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const blobRef = useRef<Blob | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const scrollRef = useRef<number | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (scrollRef.current) cancelAnimationFrame(scrollRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const getMimeType = () => {
    if (MediaRecorder.isTypeSupported("audio/webm")) return "audio/webm";
    if (MediaRecorder.isTypeSupported("audio/mp4")) return "audio/mp4";
    return "";
  };

  // Auto-scroll during recording (~30s reading pace)
  useEffect(() => {
    if (state === "recording") {
      const duration = 30000; // 30 seconds for full scroll
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        setScrollProgress(progress);
        if (progress < 1) {
          scrollRef.current = requestAnimationFrame(animate);
        }
      };
      scrollRef.current = requestAnimationFrame(animate);
      return () => {
        if (scrollRef.current) cancelAnimationFrame(scrollRef.current);
      };
    } else {
      setScrollProgress(0);
    }
  }, [state]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = getMimeType();
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : {});
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const mime = mimeType || "audio/webm";
        const blob = new Blob(chunksRef.current, { type: mime });
        blobRef.current = blob;
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach((t) => t.stop());
      };

      recorder.start(250);
      setState("recording");
      setTimer(0);

      timerRef.current = window.setInterval(() => {
        setTimer((t) => {
          if (t >= 59) {
            stopRecording();
            return 60;
          }
          return t + 1;
        });
      }, 1000);
    } catch (err: any) {
      console.error("[Vela] Microphone error:", err);
      setErrorMsg(
        err.name === "NotAllowedError"
          ? "Microphone permission denied. Please allow access and try again."
          : "Could not access microphone. Please check your device settings."
      );
      setState("error");
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (scrollRef.current) {
      cancelAnimationFrame(scrollRef.current);
      scrollRef.current = null;
    }
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    setState("post");
  }, []);

  const recordAgain = () => {
    if (retryCount >= 2) return;
    setRetryCount((c) => c + 1);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    blobRef.current = null;
    setState("pre");
    setTimer(0);
  };

  const playPreview = () => {
    if (!audioUrl) return;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    audio.play();
  };

  const submitRecording = async () => {
    if (!blobRef.current) return;

    setState("cloning");
    setErrorMsg("");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const userId = session.user.id;
      const ext = blobRef.current.type.includes("mp4") ? "mp4" : "webm";

      const formData = new FormData();
      formData.append("audio", new File([blobRef.current], `recording.${ext}`, { type: blobRef.current.type }));
      formData.append("userId", userId);
      formData.append("userName", userName);

      const cloneRes = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/clone-voice`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: formData,
        }
      );

      if (!cloneRes.ok) {
        const err = await cloneRes.json().catch(() => ({ error: "Clone failed" }));
        throw new Error(err.error || `Clone failed: ${cloneRes.status}`);
      }

      const { voice_id } = await cloneRes.json();
      setVoiceId(voice_id);
      console.log("[Vela] Voice cloned:", voice_id);

      setState("generating");

      const { data: affirmationSet, error: affError } = await supabase
        .from("affirmation_sets")
        .select("affirmations")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (affError || !affirmationSet) {
        throw new Error("Could not load your affirmations. Please try again.");
      }

      const dbAffirmations = affirmationSet.affirmations as string[];
      console.log("[Vela] Affirmations for TTS:", dbAffirmations);

      const genRes = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-audio`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({
            voiceId: voice_id,
            affirmations: dbAffirmations,
            userId,
          }),
        }
      );

      if (!genRes.ok) {
        const err = await genRes.json().catch(() => ({ error: "Generation failed" }));
        throw new Error(err.error || `Generation failed: ${genRes.status}`);
      }

      const { signedUrl } = await genRes.json();
      setSignedAudioUrl(signedUrl);
      console.log("[Vela] Audio generated, navigating to next screen");

      navigate("/create-account", {
        state: { ...navState, voiceId: voice_id, signedAudioUrl: signedUrl },
      });
    } catch (err: any) {
      console.error("[Vela] Submit error:", err);
      setErrorMsg(err.message || "Something went wrong");
      setState("error");
    }
  };

  const retrySubmit = () => {
    if (blobRef.current) {
      submitRecording();
    } else {
      setState("pre");
    }
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const isDark = state === "recording";

  return (
    <MobileShell
      className={isDark ? "bg-vela-dark" : "bg-background"}
      style={{ transition: "background-color 600ms ease-out" }}
    >
      {!isDark && <AmbientBlobs />}

      <div className="flex flex-col items-center min-h-screen px-6 py-12 relative z-10">
        {/* PRE-RECORDING */}
        {state === "pre" && (
          <div className="screen-enter">
            <h2 className="font-display text-[28px] text-foreground text-center mt-8">
              We're going to capture your voice.
            </h2>
            <p className="font-body font-light text-[15px] text-foreground/65 text-center max-w-[300px] mt-4 leading-relaxed mx-auto">
              Your subconscious responds to your own voice more deeply than any
              other. Read the script below naturally, as if speaking to a version
              of yourself you love.
            </p>

            <div className="glass-card p-6 mt-8 w-full">
              <span className="font-body text-xs text-muted-foreground">
                You'll read this while recording:
              </span>
              <p className="font-display italic text-lg text-foreground leading-relaxed mt-3">
                "{READING_SCRIPT}"
              </p>
            </div>

            <div className="flex flex-col items-center">
              <button
                onClick={startRecording}
                className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mt-10 shadow-lg active:scale-95"
                style={{ transition: "transform 150ms ease-out" }}
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="hsl(var(--primary-foreground))"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
              </button>
              <span className="font-body font-light text-xs text-muted-foreground mt-3">
                ~30 seconds • max 60s
              </span>
            </div>
          </div>
        )}

        {/* RECORDING — with scrolling script */}
        {state === "recording" && (
          <div className="flex-1 flex flex-col items-center w-full relative">
            {/* Scrolling reading script */}
            <div className="flex-1 w-full overflow-hidden relative mt-8 mb-4" style={{ maxHeight: 'calc(100vh - 280px)' }}>
              <div
                className="transition-none"
                style={{
                  transform: `translateY(-${scrollProgress * 60}%)`,
                }}
              >
                <p className="font-display italic text-[22px] text-primary-foreground/80 leading-[1.8] text-center px-2">
                  {READING_SCRIPT}
                </p>
              </div>
              {/* Fade edges */}
              <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-vela-dark to-transparent pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-vela-dark to-transparent pointer-events-none" />
            </div>

            <WaveformBars animated count={28} className="h-8 mb-4" />

            <span className="font-body font-light text-base text-primary-foreground mb-2">
              {formatTime(timer)}
            </span>

            {/* Fixed stop button at bottom */}
            <button
              onClick={stopRecording}
              className="w-20 h-20 rounded-full border-2 border-red-400 animate-breathe flex items-center justify-center active:scale-95 mb-4"
              style={{ transition: "transform 150ms ease-out" }}
            >
              <div className="w-8 h-8 rounded bg-red-400" />
            </button>
            <span className="font-body font-light text-xs text-primary-foreground/60">
              Tap to stop
            </span>
          </div>
        )}

        {/* POST-RECORDING PREVIEW */}
        {state === "post" && (
          <div className="flex-1 flex flex-col items-center justify-center w-full screen-enter">
            <h2 className="font-display text-[28px] text-foreground text-center">
              Beautiful.
            </h2>

            <div className="glass-card p-6 mt-8 w-full flex items-center gap-4">
              <button
                onClick={playPreview}
                className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 active:scale-95"
                style={{ transition: "transform 200ms ease-out" }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="hsl(var(--primary))"
                  stroke="none"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </button>
              <WaveformBars count={20} className="flex-1 h-8" />
              <span className="font-body font-light text-xs text-muted-foreground">
                {formatTime(timer)}
              </span>
            </div>

            <div className="flex flex-col gap-3 w-full mt-8">
              <Button variant="vela-primary" onClick={submitRecording}>
                Use this recording
              </Button>
              {retryCount < 2 ? (
                <Button variant="vela-secondary" onClick={recordAgain}>
                  Record again
                </Button>
              ) : (
                <p className="font-body font-light italic text-[13px] text-primary text-center">
                  This sounds great. Your voice is perfect as it is.
                </p>
              )}
            </div>
          </div>
        )}

        {/* CLONING STATE */}
        {state === "cloning" && (
          <div className="flex-1 flex flex-col items-center justify-center gap-6 screen-enter">
            <div className="w-12 h-12 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
            <p className="font-display text-xl text-foreground text-center">
              Creating your voice…
            </p>
            <p className="font-body font-light text-sm text-foreground/50 text-center max-w-[260px]">
              This takes 10–30 seconds. We're learning to sound like you.
            </p>
          </div>
        )}

        {/* GENERATING STATE */}
        {state === "generating" && (
          <div className="flex-1 flex flex-col items-center justify-center gap-6 screen-enter">
            <div className="w-12 h-12 rounded-full border-2 border-accent/30 border-t-accent animate-spin" />
            <p className="font-display text-xl text-foreground text-center">
              Generating your subliminal…
            </p>
            <p className="font-body font-light text-sm text-foreground/50 text-center max-w-[260px]">
              Your affirmations are being spoken in your own voice.
            </p>
          </div>
        )}

        {/* ERROR STATE */}
        {state === "error" && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 w-full screen-enter">
            <p className="font-display text-xl text-foreground text-center">
              Something went wrong
            </p>
            <p className="font-body font-light text-sm text-foreground/50 text-center max-w-[280px]">
              {errorMsg}
            </p>
            <div className="flex flex-col gap-3 w-full mt-4">
              <Button variant="vela-primary" onClick={retrySubmit}>
                {blobRef.current ? "Try again" : "Record again"}
              </Button>
              {blobRef.current && (
                <Button variant="vela-secondary" onClick={() => setState("post")}>
                  Back to preview
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </MobileShell>
  );
};

export default VoiceRecordingScreen;
