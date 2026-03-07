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
    // Validate JWT
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

    const formData = await req.formData();
    const audioFile = formData.get("audio") as File;
    const userId = formData.get("userId") as string;
    const userName = formData.get("userName") as string;

    if (!audioFile || !userId) {
      return new Response(JSON.stringify({ error: "Missing audio or userId" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`[clone-voice] Processing for user ${userId}, file size: ${audioFile.size}`);

    // Upload recording to Supabase Storage
    const filePath = `${userId}/${Date.now()}.webm`;
    const audioBuffer = await audioFile.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from("voice-recordings")
      .upload(filePath, audioBuffer, { contentType: audioFile.type || "audio/webm" });

    if (uploadError) {
      console.error("[clone-voice] Storage upload error:", uploadError);
      throw new Error("Failed to upload recording");
    }

    // Call ElevenLabs voice cloning API
    const elevenLabsKey = Deno.env.get("ELEVENLABS_API_KEY");
    if (!elevenLabsKey) {
      throw new Error("ELEVENLABS_API_KEY not configured");
    }

    const cloneForm = new FormData();
    cloneForm.append("name", `vela-${userName || "user"}-${userId.slice(0, 8)}`);
    cloneForm.append("description", `Voice clone for ${userName || "user"}`);
    cloneForm.append("files", new File([audioBuffer], "recording.webm", { type: audioFile.type || "audio/webm" }));

    const cloneResponse = await fetch("https://api.elevenlabs.io/v1/voices/add", {
      method: "POST",
      headers: { "xi-api-key": elevenLabsKey },
      body: cloneForm,
    });

    if (!cloneResponse.ok) {
      const errText = await cloneResponse.text();
      console.error("[clone-voice] ElevenLabs error:", errText);
      throw new Error(`Voice cloning failed: ${cloneResponse.status}`);
    }

    const cloneResult = await cloneResponse.json();
    const voiceId = cloneResult.voice_id;
    console.log("[clone-voice] Voice cloned, ID:", voiceId);

    // Save voice profile to DB
    const { error: dbError } = await supabase.from("voice_profiles").upsert({
      user_id: userId,
      elevenlabs_voice_id: voiceId,
      raw_recording_path: filePath,
      clone_status: "ready",
    }, { onConflict: "user_id" });

    if (dbError) {
      console.error("[clone-voice] DB save error:", dbError);
    }

    return new Response(JSON.stringify({ voice_id: voiceId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[clone-voice] Error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
