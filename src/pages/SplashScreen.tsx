import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MobileShell } from "@/components/vela/MobileShell";
import { CrescentMoon } from "@/components/vela/Decoratives";
import { Button } from "@/components/ui/button";

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState({ logo: false, rule: false, tagline: false, cta: false });

  useEffect(() => {
    const t1 = setTimeout(() => setShow(s => ({ ...s, logo: true })), 200);
    const t2 = setTimeout(() => setShow(s => ({ ...s, rule: true })), 800);
    const t3 = setTimeout(() => setShow(s => ({ ...s, tagline: true })), 1200);
    const t4 = setTimeout(() => setShow(s => ({ ...s, cta: true })), 1600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  return (
    <MobileShell className="bg-vela-dark">
      {/* Aurora glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[300px] h-[300px] rounded-full bg-gradient-radial animate-aurora-pulse" style={{ background: 'radial-gradient(circle, hsla(0,31%,74%,0.25), hsla(34,62%,76%,0.12), transparent 70%)' }} />
      </div>

      {/* Shimmer particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="absolute w-[2px] h-[2px] rounded-full bg-primary-foreground" style={{
            top: `${10 + Math.random() * 50}%`,
            left: `${10 + Math.random() * 80}%`,
            opacity: 0.04 + Math.random() * 0.04,
          }} />
        ))}
      </div>

      {/* Crescent moon */}
      <CrescentMoon className="absolute top-12 right-6 w-8 h-8 text-vela-dusty-rose/[0.18]" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 px-6">
        <div className="flex flex-col items-center mb-auto mt-[55%]">
          <h1
            className={`font-display text-[52px] tracking-[0.3em] text-primary-foreground transition-opacity duration-[800ms] ease-out ${show.logo ? 'opacity-100' : 'opacity-0'}`}
          >
            VELA
          </h1>

          <div className={`w-10 h-[1px] bg-accent/40 mt-3 transition-opacity duration-500 ease-out ${show.rule ? 'opacity-100' : 'opacity-0'}`} />

          <p className={`font-body font-light text-lg text-primary-foreground/80 text-center max-w-[280px] leading-relaxed mt-6 transition-all duration-500 ease-out ${show.tagline ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
            Your voice is the most powerful sound your mind knows.
          </p>
        </div>

        <div className={`w-full transition-all duration-500 ease-out ${show.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          <Button variant="vela-gold" onClick={() => navigate("/promise")}>
            Begin
          </Button>
        </div>
      </div>
    </MobileShell>
  );
};

export default SplashScreen;
