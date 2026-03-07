import React from "react";

export const CrescentMoon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M28 6C20 8 14 16 14 25C14 30 16 34 20 36C12 34 6 27 6 19C6 9 14 1 24 1C26 1 28 1.5 30 2C29.2 3.2 28.5 4.5 28 6Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const BotanicalSprig: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M30 75C30 75 30 45 30 20" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M30 55C22 48 18 38 20 30" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
    <path d="M30 45C38 38 40 28 36 22" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
    <path d="M30 35C24 30 22 22 24 16" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
    <path d="M30 25C34 20 35 14 33 10" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
    <circle cx="30" cy="18" r="2" stroke="currentColor" strokeWidth="0.8"/>
  </svg>
);

export const ConstellationStars: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="15" r="1.5" fill="currentColor"/>
    <circle cx="25" cy="8" r="1" fill="currentColor"/>
    <circle cx="40" cy="20" r="1.8" fill="currentColor"/>
    <circle cx="50" cy="10" r="1" fill="currentColor"/>
    <circle cx="35" cy="35" r="1.2" fill="currentColor"/>
    <circle cx="15" cy="40" r="0.8" fill="currentColor"/>
    <path d="M10 15L25 8L40 20L50 10" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" opacity="0.5"/>
    <path d="M40 20L35 35" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" opacity="0.5"/>
  </svg>
);

export const MandalaOutline: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="0.5"/>
    <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="0.5"/>
    <circle cx="100" cy="100" r="40" stroke="currentColor" strokeWidth="0.5"/>
    <circle cx="100" cy="100" r="20" stroke="currentColor" strokeWidth="0.5"/>
    {[0, 30, 60, 90, 120, 150].map(angle => (
      <line key={angle} x1="100" y1="20" x2="100" y2="180" stroke="currentColor" strokeWidth="0.3" transform={`rotate(${angle} 100 100)`}/>
    ))}
  </svg>
);

export const WaveformBars: React.FC<{ className?: string; animated?: boolean; count?: number }> = ({ className, animated = false, count = 24 }) => (
  <div className={`flex items-center justify-center gap-[3px] ${className || ''}`}>
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className={`w-[3px] rounded-full bg-accent ${animated ? 'animate-waveform' : ''}`}
        style={{
          height: animated ? '20px' : `${8 + Math.sin(i * 0.8) * 12}px`,
          animationDelay: animated ? `${i * 0.08}s` : undefined,
          opacity: animated ? 1 : 0.3,
        }}
      />
    ))}
  </div>
);

export const GoldStar: React.FC<{ className?: string; size?: number }> = ({ className, size = 8 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 10 10" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 0L6.12 3.53L10 3.82L7.06 6.47L7.94 10L5 7.9L2.06 10L2.94 6.47L0 3.82L3.88 3.53L5 0Z"/>
  </svg>
);

export const AmbientBlobs: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
    <div
      className="absolute animate-blob-drift-1"
      style={{
        top: '-40px',
        right: '-60px',
        width: 280,
        height: 200,
        background: 'radial-gradient(ellipse, rgba(212, 165, 165, 0.22) 0%, transparent 70%)',
      }}
    />
    <div
      className="absolute animate-blob-drift-2"
      style={{
        bottom: '-40px',
        left: '-50px',
        width: 240,
        height: 180,
        background: 'radial-gradient(ellipse, rgba(232, 201, 154, 0.16) 0%, transparent 70%)',
      }}
    />
  </div>
);

export const DarkBlob: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
    <div className="absolute top-1/4 -left-10 w-[350px] h-[350px] rounded-full" style={{ background: 'hsla(340, 42%, 38%, 0.25)', filter: 'blur(100px)' }} />
  </div>
);

export const ScatteredStars: React.FC<{ positions?: Array<{ top: string; left: string }> }> = ({ 
  positions = [{ top: '15%', left: '82%' }, { top: '45%', left: '8%' }, { top: '72%', left: '88%' }] 
}) => (
  <>
    {positions.map((pos, i) => (
      <GoldStar key={i} className="absolute text-accent z-10" size={6 + (i % 2) * 2} />
    ))}
  </>
);
