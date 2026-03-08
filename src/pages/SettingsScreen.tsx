import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { MobileShell, BottomNav } from "@/components/vela/MobileShell";
import { AmbientBlobs } from "@/components/vela/Decoratives";

const SettingsScreen: React.FC = () => {
  const location = useLocation();
  const navState = (location.state as any) || {};
  const userName = navState.userName || "Friend";

  const [dailyReminders, setDailyReminders] = useState(true);
  const [weeklyNudge, setWeeklyNudge] = useState(true);

  return (
    <MobileShell className="bg-background">
      <AmbientBlobs />
      <div className="flex flex-col px-6 pt-12 pb-[100px] screen-enter relative z-10">
        <h1 className="font-display text-[28px] text-foreground">Settings</h1>

        <div className="glass-card p-5 mt-8">
          <h3 className="font-body text-xs text-muted-foreground mb-3 uppercase tracking-wider">Account</h3>
          <div className="flex items-center justify-between py-3 border-b border-border/50">
            <span className="font-body font-light text-sm text-foreground">{userName}</span>
            <EditIcon />
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="font-body font-light text-sm text-foreground/60">Email not set</span>
            <EditIcon />
          </div>
        </div>

        <div className="glass-card p-5 mt-4">
          <h3 className="font-body text-xs text-muted-foreground mb-3 uppercase tracking-wider">Subscription</h3>
          <p className="font-body font-light text-sm text-foreground">VELA Pro · 7-day free trial</p>
          <p className="font-body font-light text-xs text-muted-foreground mt-1">Renews Jan 1, 2025</p>
          <button className="font-body text-xs text-primary mt-3 active:opacity-70" style={{ transition: 'opacity 200ms ease-out' }}>Manage</button>
        </div>

        <div className="glass-card p-5 mt-4">
          <h3 className="font-body text-xs text-muted-foreground mb-3 uppercase tracking-wider">Notifications</h3>
          <div className="flex items-center justify-between py-3 border-b border-border/50">
            <span className="font-body font-light text-sm text-foreground">Daily reminders</span>
            <Toggle checked={dailyReminders} onChange={setDailyReminders} />
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="font-body font-light text-sm text-foreground">Weekly wins nudge</span>
            <Toggle checked={weeklyNudge} onChange={setWeeklyNudge} />
          </div>
        </div>

        <div className="glass-card p-5 mt-4">
          <h3 className="font-body text-xs text-muted-foreground mb-3 uppercase tracking-wider">Privacy</h3>
          <p className="font-body font-light text-sm text-foreground/70">Voice data: stored securely. We never share it.</p>
        </div>

        <button className="font-body font-light text-[13px] text-primary/60 text-center mt-8 active:opacity-70" style={{ transition: 'opacity 200ms ease-out' }}>
          Delete account
        </button>
      </div>

      <BottomNav active="settings" />
    </MobileShell>
  );
};

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-foreground/30">
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
  </svg>
);

const Toggle: React.FC<{ checked: boolean; onChange: (v: boolean) => void }> = ({ checked, onChange }) => (
  <button
    onClick={() => onChange(!checked)}
    className={`w-12 h-7 rounded-full relative ${checked ? 'bg-primary' : 'bg-border'}`}
    style={{ transition: 'background-color 200ms ease-out' }}
  >
    <div className={`w-5 h-5 rounded-full bg-primary-foreground absolute top-1 ${checked ? 'translate-x-6' : 'translate-x-1'}`} style={{ transition: 'transform 200ms ease-out' }} />
  </button>
);

export default SettingsScreen;
