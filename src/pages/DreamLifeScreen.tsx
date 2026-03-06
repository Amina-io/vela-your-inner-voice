import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MobileShell } from "@/components/vela/MobileShell";
import { BotanicalSprig } from "@/components/vela/Decoratives";
import { Button } from "@/components/ui/button";

const promptChips = [
  "How do you feel when you wake up?",
  "What does your work look like?",
  "What does love feel like?",
];

const nudgeChips = [
  "I wake up feeling calm and purposeful.",
  "I run a business I love.",
  "I feel at home in my body.",
  "I am deeply loved.",
];

const DreamLifeScreen: React.FC<{ userName?: string }> = ({ userName = "Sofia" }) => {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [showNudge, setShowNudge] = useState(false);

  const charCount = text.length;
  const isReady = charCount >= 80;

  const handleCTA = () => {
    if (isReady) {
      navigate("/focus");
    } else {
      setShowNudge(true);
    }
  };

  const appendChip = (chipText: string) => {
    setText(prev => (prev ? prev + " " + chipText : chipText));
  };

  return (
    <MobileShell className="bg-background">
      <BotanicalSprig className="absolute bottom-20 left-4 w-14 h-20 text-vela-dusty-rose/[0.12]" />

      <div className="flex flex-col min-h-screen px-6 py-12">
        {/* Progress dots */}
        <div className="flex gap-2 justify-center">
          <div className="w-2 h-2 rounded-full bg-border" />
          <div className="w-2 h-2 rounded-full bg-primary" />
          <div className="w-2 h-2 rounded-full bg-border" />
        </div>

        <h2 className="font-display text-[22px] text-foreground text-center max-w-[320px] mx-auto leading-[1.65] mt-8">
          {userName}, close your eyes for a moment. It's one year from now and everything worked out. What does your life look like?
        </h2>

        {/* Prompt chips */}
        {charCount < 20 && (
          <div className="flex flex-wrap gap-2 justify-center mt-6">
            {promptChips.map(chip => (
              <button
                key={chip}
                onClick={() => appendChip(chip)}
                className="font-body font-light text-xs text-foreground/60 bg-input rounded-full px-4 py-2 active:scale-[0.97] transition-transform"
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Describe your life one year from now..."
          className="vela-input w-full h-40 mt-6 font-body font-light text-base leading-relaxed resize-none"
        />

        <div className="flex justify-end mt-2">
          <span className={`font-body font-light text-xs ${isReady ? 'text-primary' : 'text-muted-foreground'}`}>
            {charCount} / 80 min
          </span>
        </div>

        {/* Nudge */}
        {showNudge && !isReady && (
          <div className="mt-4 animate-fade-in">
            <p className="font-body font-light text-[13px] text-primary text-center">
              Tell us a little more — the more specific, the more personal your affirmations will be.
            </p>
            <div className="flex flex-wrap gap-2 justify-center mt-3">
              {nudgeChips.map(chip => (
                <button
                  key={chip}
                  onClick={() => appendChip(chip)}
                  className="font-body font-light text-xs text-foreground/60 bg-input rounded-full px-3 py-2 active:scale-[0.97] transition-transform"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto pt-6">
          <Button
            variant="vela-primary"
            onClick={handleCTA}
            className={!isReady ? 'opacity-60' : 'opacity-100'}
          >
            These are my dreams →
          </Button>
        </div>
      </div>
    </MobileShell>
  );
};

export default DreamLifeScreen;
