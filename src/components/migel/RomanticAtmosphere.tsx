import React, { useEffect, useState } from 'react';

interface HeartSpec {
  id: number;
  left: string;
  size: number;
  dur: string;
  delay: string;
  opacity: number;
}

interface SparkleSpec {
  id: number;
  left: string;
  top: string;
  size: number;
  dur: string;
  delay: string;
}

const FLOATING_HEARTS: HeartSpec[] = [
  { id: 1, left: '6%', size: 14, dur: '17s', delay: '-2s', opacity: 0.35 },
  { id: 2, left: '16%', size: 11, dur: '21s', delay: '-8s', opacity: 0.25 },
  { id: 3, left: '29%', size: 16, dur: '19s', delay: '-5s', opacity: 0.3 },
  { id: 4, left: '44%', size: 12, dur: '23s', delay: '-11s', opacity: 0.24 },
  { id: 5, left: '62%', size: 15, dur: '18s', delay: '-4s', opacity: 0.34 },
  { id: 6, left: '78%', size: 10, dur: '20s', delay: '-14s', opacity: 0.26 },
  { id: 7, left: '89%', size: 14, dur: '16s', delay: '-7s', opacity: 0.32 },
  { id: 8, left: '94%', size: 11, dur: '22s', delay: '-1s', opacity: 0.22 },
];

const TWINKLE_SPARKLES: SparkleSpec[] = [
  { id: 1, left: '11%', top: '18%', size: 14, dur: '3.4s', delay: '0s' },
  { id: 2, left: '22%', top: '68%', size: 11, dur: '4.1s', delay: '-1.2s' },
  { id: 3, left: '37%', top: '24%', size: 10, dur: '3.0s', delay: '-0.6s' },
  { id: 4, left: '53%', top: '14%', size: 13, dur: '3.8s', delay: '-2.1s' },
  { id: 5, left: '71%', top: '22%', size: 15, dur: '3.2s', delay: '-1.5s' },
  { id: 6, left: '83%', top: '59%', size: 12, dur: '4.3s', delay: '-0.9s' },
  { id: 7, left: '14%', top: '85%', size: 12, dur: '3.7s', delay: '-2.4s' },
  { id: 8, left: '90%', top: '28%', size: 11, dur: '3.5s', delay: '-1.8s' },
];

export const RomanticAtmosphere: React.FC = () => {
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 16;
      const ny = (e.clientY / window.innerHeight - 0.5) * 16;
      setParallax({ x: nx, y: ny });
    };
    window.addEventListener('pointermove', handleMove, { passive: true });
    return () => window.removeEventListener('pointermove', handleMove);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden select-none z-0"
    >
      {/* Dreamy Pink Radial Washes */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 20% 18%, rgba(248, 200, 220, 0.72) 0%, transparent 48%), radial-gradient(circle at 82% 24%, rgba(242, 175, 203, 0.55) 0%, transparent 46%), radial-gradient(circle at 50% 86%, rgba(232, 199, 168, 0.32) 0%, transparent 52%), linear-gradient(180deg, #FFF5F8 0%, #FDE8F1 55%, #F9D7E6 100%)',
        }}
      />

      {/* Subtle Paper Grain */}
      <div className="paper-grain-overlay absolute inset-0 opacity-75" />

      {/* Soft Light Reflections */}
      <div
        className="absolute -top-24 left-1/2 h-[440px] w-[720px] -translate-x-1/2 rounded-full opacity-45 blur-3xl transition-transform duration-700 ease-out"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.85), rgba(248, 200, 220, 0.2) 60%, transparent 75%)',
          transform: `translate(calc(-50% + ${parallax.x * 0.4}px), ${parallax.y * 0.4}px)`,
        }}
      />

      {/* Blurred Dreamy Floating Background Poker Silhouettes */}
      <div
        className="hidden sm:block absolute top-[14%] left-[5%] h-40 w-28 rounded-xl border border-[#C76A91]/20 bg-[#F8C8DC]/40 blur-[2px] shadow-lg transition-transform duration-700"
        style={{
          transform: `rotate(-18deg) translate(${parallax.x * -0.8}px, ${parallax.y * -0.6}px)`,
        }}
      >
        <div className="m-2 h-[calc(100%-16px)] rounded-lg border border-dashed border-[#963B65]/20 flex items-center justify-center text-[#963B65]/30 text-2xl">
          ♥
        </div>
      </div>

      <div
        className="hidden sm:block absolute bottom-[16%] right-[6%] h-44 w-30 rounded-xl border border-[#C76A91]/20 bg-[#F2AFCB]/35 blur-[2px] shadow-lg transition-transform duration-700"
        style={{
          transform: `rotate(16deg) translate(${parallax.x * 0.9}px, ${parallax.y * 0.7}px)`,
        }}
      >
        <div className="m-2 h-[calc(100%-16px)] rounded-lg border border-dashed border-[#963B65]/20 flex items-center justify-center text-[#963B65]/30 text-2xl">
          ♦
        </div>
      </div>

      <div
        className="hidden lg:block absolute top-[54%] left-[8%] h-32 w-24 rounded-xl border border-[#E8C7A8]/35 bg-[#FFF5F8]/45 blur-[2.5px] transition-transform duration-700"
        style={{
          transform: `rotate(11deg) translate(${parallax.x * 0.5}px, ${parallax.y * -0.5}px)`,
        }}
      />

      {/* Floating Hearts */}
      {FLOATING_HEARTS.map((heart) => (
        <span
          key={heart.id}
          className="animate-float-heart absolute -bottom-8 text-[#C76A91]"
          style={
            {
              left: heart.left,
              fontSize: `${heart.size}px`,
              opacity: heart.opacity,
              '--heart-dur': heart.dur,
              animationDelay: heart.delay,
            } as React.CSSProperties
          }
        >
          ♡
        </span>
      ))}

      {/* Delicate Sparkles */}
      {TWINKLE_SPARKLES.map((sp) => (
        <svg
          key={sp.id}
          viewBox="0 0 24 24"
          className="animate-sparkle-twinkle absolute text-[#E8C7A8]"
          style={
            {
              left: sp.left,
              top: sp.top,
              width: `${sp.size}px`,
              height: `${sp.size}px`,
              '--twinkle-dur': sp.dur,
              animationDelay: sp.delay,
            } as React.CSSProperties
          }
        >
          <path
            fill="currentColor"
            d="M12 1.5L14.3 9.2L22 11.5L14.3 13.8L12 21.5L9.7 13.8L2 11.5L9.7 9.2L12 1.5Z"
          />
        </svg>
      ))}
    </div>
  );
};
