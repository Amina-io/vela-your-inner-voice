import React from "react";
import { useNavigate } from "react-router-dom";
import { MobileShell } from "@/components/vela/MobileShell";
import { AmbientBlobs } from "@/components/vela/Decoratives";
import { Button } from "@/components/ui/button";
import graphic2 from "@/assets/graphic-2.png";

const PromiseScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <MobileShell className="bg-background bg-ambient">
      <AmbientBlobs />

      {/* Shell + stars collage - top right, partially cropped */}
      <img
        src={graphic2}
        alt=""
        className="absolute -top-4 -right-6 w-[140px] pointer-events-none"
        style={{ opacity: 0.9, transform: 'rotate(-15deg)', zIndex: 1 }}
      />

      <div className="flex flex-col items-center justify-between min-h-screen px-6 py-12 screen-enter relative z-10">
        {/* VELA wordmark */}
        <div className="flex flex-col items-center">
          <span className="font-wordmark text-[22px] text-foreground/50">VELA</span>
        </div>

        {/* Main copy */}
        <div className="flex flex-col items-center gap-8 -mt-8">
          <p className="font-display text-[22px] text-foreground text-center max-w-[300px] leading-[1.7]">
            In the next few minutes, we'll build a subliminal audio track personalised to your life. You'll hear your own voice — at a frequency your subconscious can't ignore.
          </p>

          {/* Step cards */}
          <div className="flex gap-3 w-full">
            {[
              { icon: "✎", label: "Describe your life" },
              { icon: "◉", label: "We craft your words" },
              { icon: "♪", label: "Hear them in your voice" },
            ].map((step, i) => (
              <div
                key={i}
                className="glass-card flex-1 flex flex-col items-center gap-2 py-4 px-2"
                style={{ animationDelay: `${300 + i * 100}ms`, animation: 'fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards', opacity: 0 }}
              >
                <span className="text-lg text-foreground/60">{step.icon}</span>
                <span className="font-body font-light text-[13px] text-center text-foreground/70">{step.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Button variant="vela-primary" onClick={() => navigate("/name")}>
          Let's build yours
        </Button>
      </div>
    </MobileShell>
  );
};

export default PromiseScreen;
