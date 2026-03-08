import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MobileShell } from "@/components/vela/MobileShell";
import { MandalaOutline, WaveformBars, DarkBlob } from "@/components/vela/Decoratives";
import { Button } from "@/components/ui/button";

const PreviewScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const navState = (location.state as any) || {};
  const [playing, setPlaying] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<number>();

  useEffect(() => {
    const t = setTimeout(() => setPlaying(true), 1000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (playing && seconds < 14) {
      intervalRef.current = window.setInterval(() => {
        setSeconds(s => {
          if (s >= 13) {
            setPlaying(false);
            return 14;
          }
          return s + 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [playing, seconds]);

  const togglePlay = () => {
    setPlaying(!playing);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return (
    <MobileShell className="bg-vela-dark">
      <DarkBlob />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <MandalaOutline className="w-64 h-64 text-accent/[0.08] animate-slow-rotate" />
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen px-6 z-10 relative">
        <span className="font-body font-light text-sm text-primary-foreground/60 tracking-wider">Your subliminal is ready.</span>
        <span className="font-display text-xl text-primary-foreground/80 mt-2">Golden Hour · 528Hz</span>

        <div className="mt-12 w-[280px]">
          <WaveformBars animated={playing} count={32} className="h-10" />
        </div>

        <button onClick={togglePlay} className="w-[72px] h-[72px] rounded-full bg-primary-foreground/10 backdrop-blur-sm flex items-center justify-center mt-8 border border-primary-foreground/10" style={{ transition: 'transform 150ms ease-out' }}>
          {playing ? (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="hsl(var(--primary))" stroke="none">
              <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
            </svg>
          ) : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="hsl(var(--primary))" stroke="none">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
          )}
        </button>

        <span className="font-body font-light text-xs text-primary-foreground/50 mt-4">{formatTime(seconds)} / 0:14</span>

        {/* Always show CTA — no forced listen */}
        <div className="absolute bottom-12 left-0 right-0 px-6 flex flex-col items-center gap-2">
          <Button variant="vela-primary" className="w-full" onClick={() => navigate("/subscribe", { state: navState })}>
            Listen to the full track →
          </Button>
          <span className="font-body font-light text-[11px] text-primary-foreground/30">Subscribe to unlock unlimited listens.</span>
        </div>
      </div>
    </MobileShell>
  );
};

export default PreviewScreen;
