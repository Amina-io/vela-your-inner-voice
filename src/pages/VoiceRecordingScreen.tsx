import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MobileShell } from "@/components/vela/MobileShell";
import { WaveformBars } from "@/components/vela/Decoratives";
import { Button } from "@/components/ui/button";

type RecordingState = "pre" | "recording" | "post";

const VoiceRecordingScreen: React.FC<{ userName?: string }> = ({ userName = "Sofia" }) => {
  const navigate = useNavigate();
  const [state, setState] = useState<RecordingState>("pre");
  const [timer, setTimer] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    let interval: number;
    if (state === "recording") {
      interval = window.setInterval(() => {
        setTimer(t => {
          if (t >= 30) {
            setState("post");
            return 30;
          }
          return t + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [state]);

  const startRecording = () => {
    setState("recording");
    setTimer(0);
  };

  const stopRecording = () => {
    setState("post");
  };

  const recordAgain = () => {
    if (retryCount >= 2) return;
    setRetryCount(c => c + 1);
    setAccepted(false);
    setState("pre");
    setTimer(0);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const isDark = state === "recording";

  return (
    <MobileShell className={`transition-colors duration-[600ms] ${isDark ? 'bg-vela-dark' : 'bg-background'}`}>
      <div className="flex flex-col items-center min-h-screen px-6 py-12 relative z-10">
        {state === "pre" && (
          <div className="screen-enter">
            <h2 className="font-display text-[28px] text-foreground text-center mt-8">We're going to capture your voice.</h2>
            <p className="font-body font-light text-[15px] text-foreground/65 text-center max-w-[300px] mt-4 leading-relaxed mx-auto">
              Your subconscious responds to your own voice more deeply than any other. Read the script below naturally, as if speaking to a version of yourself you love.
            </p>

            <div className="glass-card p-6 mt-8 w-full">
              <span className="font-body text-xs text-muted-foreground">Read this:</span>
              <p className="font-display italic text-lg text-foreground leading-relaxed mt-3">
                {userName}, read this naturally. Imagine you're speaking to a version of yourself you love.
              </p>
              <p className="font-display italic text-lg text-foreground leading-relaxed mt-4">
                "I am creating the life I deserve. I trust myself completely. I am open to everything good. I am ready. Everything I need is already within me. I am that I am."
              </p>
            </div>

            <div className="flex flex-col items-center">
              <button onClick={startRecording} className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mt-10 active:scale-[0.97] transition-transform duration-200 ease-out shadow-lg">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary-foreground))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="23"/>
                  <line x1="8" y1="23" x2="16" y2="23"/>
                </svg>
              </button>
              <span className="font-body font-light text-xs text-muted-foreground mt-3">~30 seconds</span>
            </div>
          </div>
        )}

        {state === "recording" && (
          <div className="flex-1 flex flex-col items-center justify-center">
            <WaveformBars animated count={28} className="h-12 mb-10" />

            <button onClick={stopRecording} className="w-20 h-20 rounded-full border-2 border-red-400 animate-breathe flex items-center justify-center active:scale-[0.97] transition-transform duration-200 ease-out">
              <div className="w-8 h-8 rounded bg-red-400" />
            </button>

            <span className="font-body font-light text-base text-primary-foreground mt-4">{formatTime(timer)}</span>
            <span className="font-body font-light text-xs text-primary-foreground/60 mt-1">Tap to stop</span>
          </div>
        )}

        {state === "post" && (
          <div className="flex-1 flex flex-col items-center justify-center w-full screen-enter">
            <h2 className="font-display text-[28px] text-foreground text-center">Beautiful.</h2>

            <div className="glass-card p-6 mt-8 w-full flex items-center gap-4">
              <button className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center transition-colors duration-200 ease-out">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="hsl(var(--primary))" stroke="none">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              </button>
              <WaveformBars count={20} className="flex-1 h-8" />
              <span className="font-body font-light text-xs text-muted-foreground">{formatTime(timer)}</span>
            </div>

            <div className="flex flex-col gap-3 w-full mt-8">
              <Button variant="vela-primary" onClick={() => setAccepted(true)}>Use this</Button>
              {retryCount < 3 ? (
                <Button variant="vela-secondary" onClick={recordAgain}>Record again</Button>
              ) : (
                <p className="font-body font-light italic text-[13px] text-primary text-center">
                  This sounds great. Your voice is perfect as it is.
                </p>
              )}
            </div>

            {accepted && (
              <div className="w-full mt-6 animate-fade-in">
                <Button variant="vela-primary" onClick={() => navigate("/create-account")}>
                  Save my voice →
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </MobileShell>
  );
};

export default VoiceRecordingScreen;
