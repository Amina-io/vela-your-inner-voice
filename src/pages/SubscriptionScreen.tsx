import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MobileShell } from "@/components/vela/MobileShell";
import { CrescentMoon, AmbientBlobs } from "@/components/vela/Decoratives";
import { Button } from "@/components/ui/button";

const SubscriptionScreen: React.FC<{ userName?: string }> = ({ userName = "Sofia" }) => {
  const navigate = useNavigate();
  const [plan, setPlan] = useState<"annual" | "weekly">("annual");

  return (
    <MobileShell className="bg-background bg-ambient">
      <AmbientBlobs />
      <CrescentMoon className="absolute top-12 right-6 w-8 h-8 text-accent/[0.35]" />

      <div className="flex flex-col min-h-screen screen-enter relative z-10">
        {/* Founding member banner — keeps glass blur as exception */}
        <div className="w-full py-2.5 px-4 text-center border-b glass-blur" style={{ background: 'rgba(201,169,110,0.15)', borderColor: 'rgba(201,169,110,0.4)' }}>
          <span className="font-body text-xs" style={{ color: '#C9A96E' }}>
            ✦ You're one of our founding members. Lock in $39.99/year — forever.
          </span>
        </div>

        <div className="flex flex-col items-center px-6 pt-8 pb-12">
          <h2 className="font-handwritten text-[34px] text-foreground text-center">{userName}, your subliminal is ready.</h2>
          <p className="font-body font-light text-sm text-foreground/55 text-center mt-2">Start listening in full with VELA Pro.</p>

          <p className="font-body font-light text-xs text-muted-foreground text-center mt-4">
            Free: Text affirmations only · No audio
          </p>

          <div className="flex flex-col gap-3 w-full mt-6">
            <button
              onClick={() => setPlan("annual")}
              className={`glass-card p-5 text-left relative ${
                plan === "annual" ? "border-[1.5px] border-primary" : ""
              }`}
              style={{ transition: 'border-color 200ms ease-out, background 200ms ease-out' }}
            >
              {plan === "annual" && (
                <span className="absolute top-3 right-3 bg-primary text-primary-foreground font-body text-[10px] font-normal px-2 py-0.5 rounded-full">
                  Most Popular
                </span>
              )}
              <p className="font-display text-[26px] text-foreground">
                <span className="line-through text-foreground/40 text-lg mr-2">$59.99</span>
                $39.99/year
              </p>
              <p className="font-body font-light text-xs text-primary mt-1">~$0.77/week · founding member rate — first 200 users</p>
            </button>

            <button
              onClick={() => setPlan("weekly")}
              className={`glass-card p-5 text-left ${
                plan === "weekly" ? "border-[1.5px] border-primary" : ""
              }`}
              style={{ transition: 'border-color 200ms ease-out, background 200ms ease-out' }}
            >
              <p className="font-display text-[22px] text-foreground">$3.99/week</p>
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="font-body text-sm text-foreground">Try everything free for 7 days. Cancel any time before your trial ends.</p>
            <div className="w-full h-[1px] mt-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.4), transparent)' }} />
          </div>

          <div className="flex flex-col gap-3 w-full mt-8">
            <Button variant="vela-primary" onClick={() => navigate("/home")}>
              Start my free trial
            </Button>
            <button onClick={() => navigate("/home")} className="font-body font-light text-[13px] text-muted-foreground text-center active:opacity-70" style={{ transition: 'opacity 200ms ease-out' }}>
              Continue with text only
            </button>
          </div>
        </div>
      </div>
    </MobileShell>
  );
};

export default SubscriptionScreen;
