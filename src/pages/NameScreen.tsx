import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MobileShell } from "@/components/vela/MobileShell";
import { BotanicalSprig } from "@/components/vela/Decoratives";
import { Button } from "@/components/ui/button";

interface NameScreenProps {
  onNameSet?: (name: string) => void;
}

const NameScreen: React.FC<NameScreenProps> = ({ onNameSet }) => {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  const handleContinue = () => {
    if (name.trim()) {
      onNameSet?.(name.trim());
      navigate("/dream");
    }
  };

  return (
    <MobileShell className="bg-background">
      <BotanicalSprig className="absolute bottom-20 left-4 w-14 h-20 text-vela-dusty-rose/[0.12]" />

      <div className="flex flex-col items-center min-h-screen px-6 py-12">
        <span className="font-display text-[22px] tracking-[0.2em] text-foreground/50">VELA</span>

        {/* Progress dots */}
        <div className="flex gap-2 mt-4">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <div className="w-2 h-2 rounded-full bg-border" />
          <div className="w-2 h-2 rounded-full bg-border" />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-4 -mt-16">
          <h2 className="font-display text-[28px] text-foreground text-center">What should we call you?</h2>
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
        >
          Continue
        </Button>
      </div>
    </MobileShell>
  );
};

export default NameScreen;
