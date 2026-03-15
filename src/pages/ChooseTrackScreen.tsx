import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MobileShell } from "@/components/vela/MobileShell";
import { WaveformBars, AmbientBlobs } from "@/components/vela/Decoratives";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import graphic6 from "@/assets/graphic-6.png";
import graphic3 from "@/assets/graphic-3.png";

const tracks = [
  { name: "Deep Space", hz: 432, mood: "For sleep and surrender" },
  { name: "Golden Hour", hz: 528, mood: "For morning intention and love" },
  { name: "Still Water", hz: 396, mood: "For releasing fear and guilt" },
  { name: "Pulse", hz: 741, mood: "For clarity, focus and expression" },
];

const ChooseTrackScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const navState = (location.state as any) || {};
  const userName = navState.userName || "Friend";
  const suggestedHz: number | null = navState.suggestedHz || null;

  const defaultIdx = suggestedHz ? tracks.findIndex(t => t.hz === suggestedHz) : 1;
  const [selected, setSelected] = useState(defaultIdx >= 0 ? defaultIdx : 1);
  const [previewing, setPreviewing] = useState<number | null>(null);

  useEffect(() => {
    if (previewing !== null) {
      const t = setTimeout(() => setPreviewing(null), 5000);
      return () => clearTimeout(t);
    }
  }, [previewing]);

  const togglePreview = (idx: number) => {
    setPreviewing(previewing === idx ? null : idx);
  };

  return (
    <MobileShell className="bg-background bg-ambient">
      <AmbientBlobs />

      {/* Grapefruit collage - top left, decorative */}
      <img
        src={graphic6}
        alt=""
        className="absolute top-4 left-4 w-[90px] pointer-events-none"
        style={{ opacity: 0.8, zIndex: 1 }}
      />

      <div className="flex flex-col min-h-screen px-6 py-12 screen-enter relative z-10">
        <h2 className="font-handwritten text-[36px] text-foreground text-center">Choose your frequency, {userName}.</h2>
        <p className="font-body font-light text-sm text-foreground/55 text-center mt-2 max-w-[300px] mx-auto">
          Each track is tuned to a specific Hz frequency. Pick the one that calls to you.
        </p>

        <div className="flex flex-col gap-3 mt-8">
          {tracks.map((track, i) => {
            const isSelected = selected === i;
            const isPreviewing = previewing === i;
            const isSuggested = suggestedHz === track.hz;
            return (
              <button
                key={i}
                onClick={() => { setSelected(i); togglePreview(i); }}
                className={`glass-card p-5 flex items-center gap-4 relative ${
                  isSelected ? 'border-[1.5px] border-primary bg-primary/[0.05]' : ''
                }`}
                style={{ transition: 'border-color 200ms ease-out, background 200ms ease-out, transform 150ms ease-out' }}
              >
                {isSuggested && (
                  <Badge className="absolute -top-2.5 right-4 bg-accent text-accent-foreground border-0 text-[10px] font-body font-normal px-2 py-0.5">
                    ✦ Suggested for you
                  </Badge>
                )}
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                  {isSelected ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="hsl(var(--primary))" stroke="none">
                      <polygon points="5 3 19 12 5 21 5 3"/>
                    </svg>
                  )}
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-body font-normal text-base text-foreground">{track.name}</span>
                    <span className="font-body text-xs text-muted-foreground">{track.hz}Hz</span>
                  </div>
                  {isPreviewing ? (
                    <WaveformBars animated count={16} className="h-4 mt-1" />
                  ) : (
                    <span className="font-body font-light text-[13px] text-foreground/60">{track.mood}</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-auto pt-8">
          <Button variant="vela-primary" onClick={() => navigate("/preview", { state: navState })}>
            This is my frequency →
          </Button>
        </div>

        {/* Giraffe + flowers collage - bottom left, above CTA */}
        <img
          src={graphic3}
          alt=""
          className="absolute bottom-24 left-4 w-[100px] pointer-events-none"
          style={{ opacity: 0.75, zIndex: 1 }}
        />
      </div>
    </MobileShell>
  );
};

export default ChooseTrackScreen;
