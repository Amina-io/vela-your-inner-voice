import React from "react";
import { useNavigate } from "react-router-dom";

interface MobileShellProps {
  children: React.ReactNode;
  className?: string;
}

export const MobileShell: React.FC<MobileShellProps> = ({ children, className }) => (
  <div className={`max-w-[375px] mx-auto min-h-screen relative overflow-hidden ${className || ''}`}>
    {children}
  </div>
);

interface BottomNavProps {
  active: "home" | "tracks" | "wins" | "settings";
}

export const BottomNav: React.FC<BottomNavProps> = ({ active }) => {
  const navigate = useNavigate();
  const tabs = [
    { id: "home" as const, label: "Home", path: "/home", icon: HomeIcon },
    { id: "tracks" as const, label: "Tracks", path: "/home", icon: WaveIcon },
    { id: "wins" as const, label: "Wins", path: "/home", icon: StarIcon },
    { id: "settings" as const, label: "Settings", path: "/settings", icon: SlidersIcon },
  ];

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[375px] h-[83px] bg-background/90 backdrop-blur-lg border-t border-border/50 flex items-start pt-2 px-6 justify-around pb-safe z-50">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => navigate(tab.path)}
          className="flex flex-col items-center gap-1 active-press"
        >
          <tab.icon className={`w-6 h-6 ${active === tab.id ? 'text-primary' : 'text-foreground/35'}`} filled={active === tab.id} />
          <span className={`text-[10px] font-body ${active === tab.id ? 'text-primary' : 'text-foreground/35'}`}>{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

const HomeIcon: React.FC<{ className?: string; filled?: boolean }> = ({ className, filled }) => (
  <svg className={className} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12L12 3L21 12V21H15V15H9V21H3V12Z"/>
  </svg>
);

const WaveIcon: React.FC<{ className?: string; filled?: boolean }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M4 12H4.5M7 8V16M10 6V18M13 9V15M16 7V17M19.5 12H20"/>
  </svg>
);

const StarIcon: React.FC<{ className?: string; filled?: boolean }> = ({ className, filled }) => (
  <svg className={className} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L15 9L22 9.5L17 14.5L18.5 22L12 18L5.5 22L7 14.5L2 9.5L9 9L12 2Z"/>
  </svg>
);

const SlidersIcon: React.FC<{ className?: string; filled?: boolean }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M4 21V14M4 10V3M12 21V12M12 8V3M20 21V16M20 12V3M1 14H7M9 8H15M17 16H23"/>
  </svg>
);
