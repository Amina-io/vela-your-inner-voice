import React from "react";
import { useNavigate } from "react-router-dom";

interface MobileShellProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const MobileShell: React.FC<MobileShellProps> = ({ children, className, style }) => {
  const isDark = className?.includes('bg-vela-dark');
  return (
    <div className={`max-w-[375px] mx-auto min-h-screen relative overflow-hidden ${className || ''}`} style={style}>
      {/* Noise texture on light screens */}
      {!isDark && (
        <div
          className="absolute inset-0 pointer-events-none z-[2]"
          style={{
            opacity: 0.035,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='a' x='0' y='0'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23a)'/%3E%3C/svg%3E")`,
          }}
        />
      )}
      {children}
    </div>
  );
};

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
          style={{ transition: 'transform 150ms ease-out' }}
        >
          <tab.icon className={`w-6 h-6 ${active === tab.id ? 'text-primary' : 'text-foreground/35'}`} filled={active === tab.id} style={{ transition: 'color 200ms ease-out' }} />
          <span className={`text-[10px] font-body ${active === tab.id ? 'text-primary' : 'text-foreground/35'}`} style={{ transition: 'color 200ms ease-out' }}>{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

const HomeIcon: React.FC<{ className?: string; filled?: boolean; style?: React.CSSProperties }> = ({ className, filled, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12L12 3L21 12V21H15V15H9V21H3V12Z"/>
  </svg>
);

const WaveIcon: React.FC<{ className?: string; filled?: boolean; style?: React.CSSProperties }> = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M4 12H4.5M7 8V16M10 6V18M13 9V15M16 7V17M19.5 12H20"/>
  </svg>
);

const StarIcon: React.FC<{ className?: string; filled?: boolean; style?: React.CSSProperties }> = ({ className, filled, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L15 9L22 9.5L17 14.5L18.5 22L12 18L5.5 22L7 14.5L2 9.5L9 9L12 2Z"/>
  </svg>
);

const SlidersIcon: React.FC<{ className?: string; filled?: boolean; style?: React.CSSProperties }> = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M4 21V14M4 10V3M12 21V12M12 8V3M20 21V16M20 12V3M1 14H7M9 8H15M17 16H23"/>
  </svg>
);
