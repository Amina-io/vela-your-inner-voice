import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MobileShell } from "@/components/vela/MobileShell";
import { WaveformBars } from "@/components/vela/Decoratives";
import { Button } from "@/components/ui/button";

const tracks = [
  { name: "Deep Space", hz: "432Hz", mood: "For sleep and surrender" },
  { name: "Golden Hour", hz: "528Hz", mood: "For morning intention and love" },
  { name: "Still Water", hz: "396Hz", mood: "For releasing fear and guilt" },
  { name: "Pulse", hz: "741Hz", mood: "For clarity, focus and expression" },
];

const ChooseTrackScreen: React.FC<{ userName?: string }> = ({ userName = "Sofia" }) => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(1);
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
      <div className="flex flex-col min-h-screen px-6 py-12">
        <h2 className="font-display text-[30px] text-foreground text-center">Choose your frequency, {userName}.</h2>
        <p className="font-body font-light text-sm text-foreground/55 text-center mt-2 max-w-[300px] mx-auto">
          Each track is tuned to a specific Hz frequency. Pick the one that calls to you.
        </p>

        <div className="flex flex-col gap-3 mt-8">
          {tracks.map((track, i) => {
            const isSelected = selected === i;
            const isPreviewing = previewing === i;
            return (
              <button
                key={i}
                onClick={() => { setSelected(i); togglePreview(i); }}
                className={`glass-card p-5 flex items-center gap-4 transition-all duration-200 active:scale-[0.98] ${
                  isSelected ? 'border-[1.5px] border-primary bg-primary/[0.05]' : ''
                }`}
              >
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
                    <span className="font-body font-medium text-base text-foreground">{track.name}</span>
                    <span className="font-body text-xs text-muted-foreground">{track.hz}</span>
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
          <Button variant="vela-primary" onClick={() => navigate("/preview")}>
            This is my frequency →
          </Button>
        </div>
      </div>
    </MobileShell>
  );
};

export default ChooseTrackScreen;
