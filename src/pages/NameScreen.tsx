import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MobileShell } from "@/components/vela/MobileShell";
import { BotanicalSprig, AmbientBlobs } from "@/components/vela/Decoratives";
import { Button } from "@/components/ui/button";
import graphic5 from "@/assets/graphic-5.png";

interface NameScreenProps {
  onNameSet?: (name: string) => void;
}

const NameScreen: React.FC<NameScreenProps> = ({ onNameSet }) => {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  const handleContinue = () => {
    if (name.trim()) {
      onNameSet?.(name.trim());
      navigate("/dream", { state: { userName: name.trim() } });
    }
  };

  return (
    <MobileShell className="bg-background">
      <AmbientBlobs />
      <BotanicalSprig className="absolute bottom-20 left-4 w-14 h-20 text-vela-dusty-rose/[0.35]" />

      <div className="flex flex-col items-center min-h-screen px-6 py-12 screen-enter relative z-10">
        <div className="flex flex-col items-center">
          <span className="font-wordmark text-[22px] text-foreground/50">VELA</span>
        </div>

        {/* Progress dots */}
        <div className="flex gap-2 mt-4">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <div className="w-2 h-2 rounded-full bg-border" />
          <div className="w-2 h-2 rounded-full bg-border" />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-4 -mt-16">
          <h2 className="font-handwritten text-[36px] text-foreground text-center">What should we call you?</h2>
          <p className="font-body font-light text-sm text-foreground/55 text-center">We'll use this throughout your journey.</p>

          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Sofia"
            className="vela-input w-full text-center text-xl font-body font-normal h-16 mt-4"
          />
        </div>

        <Button
          variant="vela-primary"
          disabled={!name.trim()}
          onClick={handleContinue}
          style={{ transition: 'opacity 500ms ease-out, background-color 500ms ease-out' }}
        >
          Continue
        </Button>

        {/* Flower + butterflies collage - bottom center, above button */}
        <img
          src={graphic5}
          alt=""
          className="absolute bottom-[100px] left-1/2 -translate-x-1/2 w-[160px] pointer-events-none"
          style={{ opacity: 0.8, zIndex: 1 }}
        />
      </div>
    </MobileShell>
  );
};

export default NameScreen;
