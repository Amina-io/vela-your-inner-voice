import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MobileShell } from "@/components/vela/MobileShell";
import { BotanicalSprig, AmbientBlobs } from "@/components/vela/Decoratives";
import { Button } from "@/components/ui/button";
import graphic3 from "@/assets/graphic-3.png";

const CreateAccountScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const navState = (location.state as any) || {};
  const userName = navState.userName || "Friend";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  const handleSubmit = () => {
    if (email && !email.includes("@")) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");
    setLoading(true);
    setTimeout(() => navigate("/choose-track", { state: navState }), 2000);
  };

  return (
    <MobileShell className="bg-background">
      <AmbientBlobs />
      <BotanicalSprig className="absolute bottom-16 right-4 w-12 h-16 text-vela-dusty-rose/[0.35]" />

      <div className="flex flex-col items-center min-h-screen px-6 py-12 screen-enter relative z-10">
        <div className="flex flex-col items-center">
          <span className="font-wordmark text-[22px] text-foreground/50">VELA</span>
        </div>

        <h2 className="font-handwritten text-[34px] text-foreground text-center mt-8 leading-tight">
          Let's save your affirmations and voice, {userName}.
        </h2>
        <p className="font-body font-light text-sm text-foreground/55 text-center mt-2">
          We need this to keep your work safe. It's yours.
        </p>

        <div className="flex flex-col gap-3 w-full mt-8">
          <div>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setEmailError(""); }}
              placeholder="Email address"
              className="vela-input w-full text-base"
            />
            {emailError && <p className="font-body font-light text-xs text-primary/80 mt-1 ml-1" style={{ transition: 'opacity 200ms ease-out' }}>{emailError}</p>}
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              className="vela-input w-full text-base pr-12"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40"
              style={{ transition: 'color 200ms ease-out' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                {showPassword ? (
                  <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                ) : (
                  <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
                )}
              </svg>
            </button>
          </div>
        </div>

        <p className="font-body font-light text-xs text-muted-foreground text-center mt-4">
          We never share your voice data. Ever.
        </p>

        <div className="w-full mt-6">
          <Button variant="vela-primary" onClick={handleSubmit} className={loading ? 'animate-breathe' : ''}>
            {loading ? "" : "Save and continue"}
          </Button>
        </div>

        <button onClick={() => navigate("/choose-track", { state: navState })} className="font-body font-light text-[13px] text-primary text-center mt-4 active:opacity-70" style={{ transition: 'opacity 200ms ease-out' }}>
          Already have an account? Sign in
        </button>
      </div>
    </MobileShell>
  );
};

export default CreateAccountScreen;
