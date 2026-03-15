import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { MobileShell, BottomNav } from "@/components/vela/MobileShell";
import { CrescentMoon, WaveformBars, AmbientBlobs, GoldStar } from "@/components/vela/Decoratives";
import { Button } from "@/components/ui/button";
import { useTrackPlayer } from "@/hooks/use-track-player";
import graphic7 from "@/assets/graphic-7.png";

interface HomePortalProps {
  userName?: string;
  returning?: boolean;
}

const HomePortal: React.FC<HomePortalProps> = ({ userName: propName, returning = false }) => {
  const location = useLocation();
  const navState = (location.state as any) || {};
  const userName = propName || navState.userName || "Friend";
  const { isPlaying, formattedTime, trackReady, loading: trackLoading, togglePlay, hzFrequency } = useTrackPlayer();

  const [wins, setWins] = useState([
    { text: "Your first win: you started.", deletable: false, sage: true },
  ]);
  const [newWin, setNewWin] = useState("");
  const [showRefreshModal, setShowRefreshModal] = useState(false);
  const [showReengagement, setShowReengagement] = useState(returning);

  const addWin = () => {
    if (newWin.trim()) {
      setWins([...wins, { text: newWin.trim(), deletable: true, sage: false }]);
      setNewWin("");
    }
  };

  const deleteWin = (idx: number) => {
    setWins(wins.filter((_, i) => i !== idx));
  };

  return (
    <MobileShell className="bg-background">
      <AmbientBlobs />
      <CrescentMoon className="absolute top-12 right-6 w-8 h-8 text-accent/[0.35]" />
      
      <GoldStar className="absolute top-14 right-16 text-accent z-10" size={6} />
      <GoldStar className="absolute top-36 left-6 text-accent z-10" size={7} />

      <div className="flex flex-col px-6 pt-12 pb-[100px] screen-enter relative z-10">
        <h1 className="font-handwritten text-[42px] text-foreground">Welcome, {userName}.</h1>
        <p className="font-body font-light text-sm text-foreground/55 mt-1">Your subliminal is ready.</p>

        {showReengagement && (
          <div className="glass-card p-5 mt-6 animate-fade-in">
            <p className="font-display italic text-lg text-foreground leading-relaxed">
              Your vision may have evolved. Want to refresh your affirmations?
            </p>
            <div className="flex flex-col gap-2 mt-4">
              <Button variant="vela-primary" onClick={() => setShowReengagement(false)}>Yes, refresh ↗</Button>
              <Button variant="vela-ghost" onClick={() => setShowReengagement(false)}>Dismiss</Button>
            </div>
          </div>
        )}

        <div className="glass-card p-7 mt-6" style={{ borderRadius: 20 }}>
          <div className="flex items-center gap-2">
            <span className="font-display text-[22px] text-foreground">Golden Hour</span>
            <span className="font-body font-light text-xs text-muted-foreground">{hzFrequency ? `${hzFrequency}Hz` : ''}</span>
          </div>
          <p className="font-body font-light text-[11px] text-muted-foreground mt-1">
            {isPlaying ? formattedTime : "Tap to begin"}
          </p>

          <div className="flex justify-center my-6">
            <button
              onClick={togglePlay}
              disabled={!trackReady || trackLoading}
              className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg disabled:opacity-40"
              style={{ transition: 'transform 150ms ease-out, box-shadow 150ms ease-out' }}
            >
              {isPlaying ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="hsl(var(--primary-foreground))" stroke="none">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="hsl(var(--primary-foreground))" stroke="none">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              )}
            </button>
          </div>

          <WaveformBars count={28} className="h-6" animated={isPlaying} />

          <button onClick={() => setShowRefreshModal(true)} className="font-body font-light text-xs text-primary mt-4 block mx-auto active:opacity-70" style={{ transition: 'opacity 200ms ease-out' }}>
            Refresh affirmations
          </button>
        </div>

        <div className="mt-8">
          <h3 className="font-display text-xl text-foreground">Your Wins</h3>
          <div className="flex flex-col gap-2 mt-3">
            {wins.map((win, i) => (
              <div key={i} className={`glass-card p-4 relative ${win.sage ? 'bg-vela-sage/[0.07]' : ''}`}>
                <p className={`font-body font-light text-sm text-foreground ${win.sage ? 'italic text-foreground/60' : ''}`}>
                  {win.text}
                </p>
                {win.deletable && (
                  <button onClick={() => deleteWin(i)} className="absolute top-3 right-3 text-foreground/25 active:text-foreground/50 text-lg leading-none" style={{ transition: 'color 200ms ease-out' }}>
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-2 mt-3">
            <input
              value={newWin}
              onChange={e => setNewWin(e.target.value)}
              placeholder="What's working?"
              className="vela-input flex-1 h-12 text-sm"
              onKeyDown={e => e.key === 'Enter' && addWin()}
            />
            <button onClick={addWin} className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-xl font-light" style={{ transition: 'transform 150ms ease-out' }}>
              +
            </button>
          </div>
        </div>

        <div className="glass-card p-5 mt-8 border border-dashed border-border">
          <div className="flex items-center gap-2">
            <span className="font-body text-sm text-foreground/40">Meditations</span>
            <span className="font-body text-[10px] bg-vela-sage text-primary-foreground px-2 py-0.5 rounded-full">Coming Soon</span>
          </div>
          <p className="font-body font-light text-xs text-muted-foreground mt-2">
            Guided meditations in your voice, for your goals.
          </p>
        </div>
      </div>

      {showRefreshModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-8" onClick={() => setShowRefreshModal(false)}>
          <div className="absolute inset-0 bg-foreground/20" style={{ transition: 'opacity 200ms ease-out' }} />
          <div className="relative glass-card p-6 w-full max-w-[327px] screen-enter" onClick={e => e.stopPropagation()}>
            <p className="font-display text-lg text-foreground text-center">This will update your current affirmations. Continue?</p>
            <div className="flex flex-col gap-2 mt-5">
              <Button variant="vela-primary" onClick={() => setShowRefreshModal(false)}>Yes, refresh</Button>
              <Button variant="vela-secondary" onClick={() => setShowRefreshModal(false)}>Keep these</Button>
            </div>
          </div>
        </div>
      )}

      <BottomNav active="home" />
    </MobileShell>
  );
};

export default HomePortal;
