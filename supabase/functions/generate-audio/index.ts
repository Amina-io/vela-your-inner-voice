import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { voiceId, affirmations, userId } = await req.json();

    if (!voiceId || !affirmations || !userId) {
      return new Response(JSON.stringify({ error: "Missing voiceId, affirmations, or userId" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const elevenLabsKey = Deno.env.get("ELEVENLABS_API_KEY");
    if (!elevenLabsKey) {
      throw new Error("ELEVENLABS_API_KEY not configured");
    }

    console.log(`[generate-audio] Generating TTS for ${affirmations.length} affirmations with voice ${voiceId}`);

    // Combine all affirmations into one text with pauses
    const fullText = affirmations
      .map((a: string) => a.trim())
      .join("... ... ");

    // Generate TTS audio
    const ttsResponse = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "xi-api-key": elevenLabsKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: fullText,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.6,
            similarity_boost: 0.75,
            style: 0.3,
            use_speaker_boost: true,
            speed: 0.85,
          },
        }),
      }
    );

    if (!ttsResponse.ok) {
      const errText = await ttsResponse.text();
      console.error("[generate-audio] ElevenLabs TTS error:", errText);
      throw new Error(`TTS generation failed: ${ttsResponse.status}`);
    }

    const audioBuffer = await ttsResponse.arrayBuffer();
    console.log(`[generate-audio] Generated audio: ${audioBuffer.byteLength} bytes`);

    // Upload to voice-audio bucket
    const audioPath = `${userId}/${Date.now()}-affirmations.mp3`;
    const { error: uploadError } = await supabase.storage
      .from("voice-audio")
      .upload(audioPath, audioBuffer, { contentType: "audio/mpeg" });

    if (uploadError) {
      console.error("[generate-audio] Upload error:", uploadError);
      throw new Error("Failed to upload generated audio");
    }

    // Create a signed URL for playback (1 hour)
    const { data: signedData, error: signedError } = await supabase.storage
      .from("voice-audio")
      .createSignedUrl(audioPath, 3600);

    if (signedError) {
      console.error("[generate-audio] Signed URL error:", signedError);
      throw new Error("Failed to create signed URL");
    }

    // Update tracks table if there's an active track
    const { error: trackError } = await supabase.from("tracks").update({
      voice_audio_path: audioPath,
      generation_status: "completed",
    }).eq("user_id", userId).eq("generation_status", "pending");

    if (trackError) {
      console.warn("[generate-audio] Track update warning:", trackError);
    }

    return new Response(JSON.stringify({
      signedUrl: signedData.signedUrl,
      audioPath,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[generate-audio] Error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
