import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MobileShell } from "@/components/vela/MobileShell";
import { BotanicalSprig, AmbientBlobs } from "@/components/vela/Decoratives";
import { Button } from "@/components/ui/button";
import graphic1 from "@/assets/graphic-1.png";
import graphic7 from "@/assets/graphic-7.png";

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

const DreamLifeScreen: React.FC<{ userName?: string }> = ({ userName: propName }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const userName = propName || (location.state as any)?.userName || "Friend";
  const [text, setText] = useState("");
  const [showNudge, setShowNudge] = useState(false);

  const charCount = text.length;
  const isReady = charCount >= 80;

  const handleCTA = () => {
    if (isReady) {
      navigate("/generating", { state: { userName, dreamLife: text } });
    } else {
      setShowNudge(true);
    }
  };

  const appendChip = (chipText: string) => {
    setText(prev => (prev ? prev + " " + chipText : chipText));
  };

  return (
    <MobileShell className="bg-background">
      <AmbientBlobs />
      <BotanicalSprig className="absolute bottom-20 left-4 w-14 h-20 text-vela-dusty-rose/[0.35]" />

      <div className="flex flex-col min-h-screen px-6 py-12 screen-enter relative z-10">
        {/* Progress dots */}
        <div className="flex gap-2 justify-center">
          <div className="w-2 h-2 rounded-full bg-border" />
          <div className="w-2 h-2 rounded-full bg-primary" />
          <div className="w-2 h-2 rounded-full bg-border" />
        </div>

        <h2 className="font-display italic text-[22px] text-foreground text-center max-w-[320px] mx-auto leading-[1.65] mt-8">
          {userName}, close your eyes for a moment. It's one year from now and everything worked out. What does your life look like?
        </h2>

        {/* Prompt chips */}
        {charCount < 20 && (
          <div className="flex flex-wrap gap-2 justify-center mt-6">
            {promptChips.map(chip => (
              <button
                key={chip}
                onClick={() => appendChip(chip)}
                className="font-body font-light text-xs text-foreground/60 bg-input rounded-full px-4 py-2"
                style={{ transition: 'transform 150ms ease-out, opacity 150ms ease-out' }}
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
          <span className={`font-body font-light text-xs ${isReady ? 'text-primary' : 'text-muted-foreground'}`}
            style={{ transition: 'color 200ms ease-out' }}>
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
                  className="font-body font-light text-xs text-foreground/60 bg-input rounded-full px-3 py-2"
                  style={{ transition: 'transform 150ms ease-out, opacity 150ms ease-out' }}
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
            style={{ opacity: isReady ? 1 : 0.6, transition: 'opacity 500ms ease-out, background-color 500ms ease-out' }}
          >
            These are my dreams →
          </Button>
        </div>

        {/* Cat + star + flower collage - bottom left, above CTA */}
        <img
          src={graphic1}
          alt=""
          className="absolute bottom-[100px] left-4 w-[110px] pointer-events-none"
          style={{ opacity: 0.8, zIndex: 1 }}
        />
      </div>
    </MobileShell>
  );
};

export default DreamLifeScreen;
