import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MobileShell } from "@/components/vela/MobileShell";
import { Button } from "@/components/ui/button";

const areas = [
  "Abundance & Money",
  "Love & Relationships",
  "Body & Health",
  "Purpose & Creativity",
  "Peace & Mental Health",
  "Confidence & Identity",
];

const FocusAreasScreen: React.FC = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (area: string) => {
    setSelected(prev => prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]);
  };

  return (
    <MobileShell className="bg-background">
      <div className="flex flex-col items-center min-h-screen px-6 py-12">
        <span className="font-display text-[22px] tracking-[0.2em] text-foreground/50">VELA</span>

        <h2 className="font-display text-[28px] text-foreground text-center mt-10">
          What areas matter most right now?
        </h2>
        <p className="font-body font-light text-sm text-foreground/55 text-center mt-2">
          Select all that apply. We'll lean into these.
        </p>

        <div className="grid grid-cols-2 gap-3 mt-10 w-full">
          {areas.map(area => {
            const isSelected = selected.includes(area);
            return (
              <button
                key={area}
                onClick={() => toggle(area)}
                className={`rounded-full px-5 py-3 font-body text-sm transition-all duration-200 active:scale-[1.03] ${
                  isSelected
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-input text-foreground/70'
                }`}
              >
                {area}
              </button>
            );
          })}
        </div>

        <div className="mt-auto pt-8 w-full">
          <Button variant="vela-primary" onClick={() => navigate("/generating")}>
            Build my affirmations
          </Button>
        </div>
      </div>
    </MobileShell>
  );
};

export default FocusAreasScreen;
