import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MobileShell } from "@/components/vela/MobileShell";
import { ConstellationStars, DarkBlob } from "@/components/vela/Decoratives";

const GenerationLoadingScreen: React.FC<{ userName?: string }> = ({ userName: propName }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const navState = (location.state as any) || {};
  const userName = propName || navState.userName || "Friend";

  const lines = [
    `Reading your vision, ${userName}...`,
    "Crafting your words...",
    "Building your subliminal...",
  ];

  const [activeLine, setActiveLine] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setActiveLine(1), 2000);
    const t2 = setTimeout(() => setActiveLine(2), 4000);
    const t3 = setTimeout(() => navigate("/affirmations", { state: navState }), 5500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [navigate]);

  return (
    <MobileShell className="bg-vela-dark">
      <DarkBlob />

      {/* Multi-rate gradient blobs */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="absolute animate-blob-slow" style={{
          width: 280, height: 280, borderRadius: '50%',
          background: 'radial-gradient(circle, hsla(0,31%,74%,0.25), transparent 70%)',
          top: '25%', left: '10%',
        }} />
        <div className="absolute animate-blob-mid" style={{
          width: 220, height: 220, borderRadius: '50%',
          background: 'radial-gradient(circle, hsla(34,62%,76%,0.18), transparent 70%)',
          top: '35%', right: '5%',
        }} />
        <div className="absolute animate-blob-long" style={{
          width: 200, height: 200, borderRadius: '50%',
          background: 'radial-gradient(circle, hsla(340,42%,38%,0.15), transparent 70%)',
          bottom: '25%', left: '20%',
        }} />
      </div>

      <ConstellationStars className="absolute top-12 right-6 w-14 h-14 text-accent/[0.35]" />

      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 z-10">
        {/* Breathing circle */}
        <div className="w-20 h-20 rounded-full border-[1.5px] border-accent/40 animate-breathe flex items-center justify-center mb-10">
          <div className="w-3 h-3 rounded-full bg-accent/30" />
        </div>

        {/* Copy sequence */}
        <div className="flex flex-col items-center gap-3">
          {lines.map((line, i) => (
            <p
              key={i}
              className="font-body font-light text-base text-primary-foreground/80 text-center"
              style={{
                transition: 'opacity 600ms cubic-bezier(0.16, 1, 0.3, 1), transform 600ms cubic-bezier(0.16, 1, 0.3, 1)',
                opacity: i <= activeLine ? (i < activeLine ? 0.4 : 1) : 0,
                transform: i <= activeLine ? 'translateY(0)' : 'translateY(8px)',
              }}
            >
              {line}
            </p>
          ))}
        </div>
      </div>

      {/* Progress line */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-foreground/5">
        <div className="h-full bg-gradient-to-r from-vela-dusty-rose to-vela-amber animate-progress-fill" />
      </div>
    </MobileShell>
  );
};

export default GenerationLoadingScreen;
