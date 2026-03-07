import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MobileShell } from "@/components/vela/MobileShell";
import { BotanicalSprig, AmbientBlobs, GoldStar } from "@/components/vela/Decoratives";
import { Button } from "@/components/ui/button";

const defaultAffirmations = [
  "I am someone whose mornings feel like mine.",
  "I am financially free and growing.",
  "I am deeply and completely loved.",
  "I feel safe and at home in my own skin.",
  "I create from a place of wholeness.",
];

const AffirmationsScreen: React.FC<{ userName?: string }> = ({ userName = "Sofia" }) => {
  const navigate = useNavigate();
  const [affirmations, setAffirmations] = useState(defaultAffirmations);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [showReframe, setShowReframe] = useState(false);
  const [showProSheet, setShowProSheet] = useState(false);

  const startEdit = (idx: number) => {
    setEditingIdx(idx);
    setEditText(affirmations[idx]);
    setShowReframe(false);
  };

  const saveEdit = () => {
    if (editingIdx !== null) {
      if (editText.toLowerCase().includes("stop being broke") || editText.toLowerCase().includes("want to stop")) {
        setShowReframe(true);
        return;
      }
      const updated = [...affirmations];
      updated[editingIdx] = editText;
      setAffirmations(updated);
      setEditingIdx(null);
    }
  };

  const acceptSuggestion = () => {
    if (editingIdx !== null) {
      const updated = [...affirmations];
      updated[editingIdx] = "I am financially abundant.";
      setAffirmations(updated);
      setEditingIdx(null);
      setShowReframe(false);
    }
  };

  return (
    <MobileShell className="bg-background bg-ambient">
      <AmbientBlobs />

      <GoldStar className="absolute top-20 right-10 text-accent z-10" size={7} />
      <GoldStar className="absolute top-48 left-6 text-accent z-10" size={6} />

      <div className="flex flex-col min-h-screen px-6 pt-12 pb-28 screen-enter relative z-10">
        <h2 className="font-handwritten text-[38px] text-foreground text-center">{userName}, these are yours.</h2>
        <p className="font-body font-light text-[13px] text-foreground/50 text-center mt-2">5 affirmations crafted from your vision.</p>

        <div className="flex flex-col gap-3 mt-8">
          {affirmations.map((aff, i) => (
            <div
              key={i}
              className="glass-card card-inner-dashed p-6 relative"
              style={{
                animation: `screen-enter 380ms cubic-bezier(0.16, 1, 0.3, 1) ${60 + i * 60}ms forwards`,
                opacity: 0,
              }}
            >
              <BotanicalSprig className="absolute bottom-2 right-2 w-6 h-8 text-vela-dusty-rose/[0.30]" />

              {editingIdx === i ? (
                <div className="flex flex-col gap-3">
                  <textarea
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                    className="vela-input w-full font-display text-[20px] leading-relaxed resize-none h-24"
                  />
                  {showReframe && (
                    <div className="glass-card p-4 bg-vela-amber/5">
                      <p className="font-body font-light text-[13px] text-foreground/80 leading-relaxed">
                        Affirmations work best in the present tense. How about: <em>"I am financially abundant"</em>? Present tense tells your brain this is already true.
                      </p>
                      <div className="flex gap-2 mt-3">
                        <Button variant="vela-primary" size="sm" className="h-9 text-xs rounded-full flex-1" onClick={acceptSuggestion}>Accept suggestion</Button>
                        <Button variant="vela-secondary" size="sm" className="h-9 text-xs rounded-full flex-1" onClick={() => { setShowReframe(false); const u = [...affirmations]; u[i] = editText; setAffirmations(u); setEditingIdx(null); }}>Keep mine</Button>
                      </div>
                    </div>
                  )}
                  {!showReframe && (
                    <div className="flex gap-2">
                      <Button variant="vela-primary" size="sm" className="h-9 text-xs rounded-full flex-1" onClick={saveEdit}>Save</Button>
                      <Button variant="vela-secondary" size="sm" className="h-9 text-xs rounded-full flex-1" onClick={() => setEditingIdx(null)}>Cancel</Button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <p className="font-display italic text-[22px] text-foreground leading-[1.5] pr-6">{aff}</p>
                  <button onClick={() => startEdit(i)} className="absolute top-4 right-4 text-foreground/30 active:text-foreground/60" style={{ transition: 'color 200ms ease-out' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
                    </svg>
                  </button>
                </>
              )}
            </div>
          ))}
        </div>

        <button onClick={() => setShowProSheet(true)} className="font-body text-sm text-primary flex items-center gap-1 justify-center mt-4 active:opacity-70" style={{ transition: 'opacity 200ms ease-out' }}>
          <span>+</span> Add your own
        </button>

        <button onClick={() => setShowProSheet(true)} className="font-body font-light text-xs text-muted-foreground border border-dashed border-border rounded-full px-4 py-2 mx-auto mt-2 active:opacity-70" style={{ transition: 'opacity 200ms ease-out' }}>
          + More affirmations (Pro)
        </button>

        {showProSheet && (
          <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={() => setShowProSheet(false)}>
            <div className="absolute inset-0 bg-foreground/20" style={{ transition: 'opacity 200ms ease-out' }} />
            <div className="relative max-w-[375px] w-full glass-card rounded-b-none p-6 pb-10" onClick={e => e.stopPropagation()}>
              <p className="font-display text-xl text-foreground text-center">Unlock more affirmations</p>
              <p className="font-body font-light text-sm text-foreground/60 text-center mt-2">
                Pro members can create unlimited affirmations. Upgrade to add more — or swap one of your current 5.
              </p>
              <div className="flex flex-col gap-2 mt-6">
                <Button variant="vela-primary" onClick={() => setShowProSheet(false)}>Upgrade to Pro</Button>
                <Button variant="vela-secondary" onClick={() => setShowProSheet(false)}>Swap one instead</Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[375px] p-6 pt-3 bg-gradient-to-t from-background via-background to-transparent z-20">
        <Button variant="vela-primary" onClick={() => navigate("/voice")}>
          These feel right → Now let's hear them in your voice
        </Button>
      </div>
    </MobileShell>
  );
};

export default AffirmationsScreen;
