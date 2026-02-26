'use client';

import { useRef, type CSSProperties, type PointerEvent, type ReactNode } from 'react';
import { SPOTLIGHT } from '@/constants';

/**
 * SpotlightText 컴포넌트 Props
 */
interface SpotlightTextProps {
  readonly children: ReactNode;
  readonly className?: string;
}

const SpotlightText = ({ children, className = '' }: SpotlightTextProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafIdRef = useRef<number | null>(null);
  const pendingPositionRef = useRef<{ x: number; y: number } | null>(null);

  const applySpotlightStyle = (x: number, y: number, opacity: number) => {
    if (!containerRef.current) return;
    containerRef.current.style.setProperty("--spot-x", `${x}px`);
    containerRef.current.style.setProperty("--spot-y", `${y}px`);
    containerRef.current.style.setProperty("--spot-opacity", String(opacity));
  };

  const scheduleSpotlightUpdate = () => {
    if (rafIdRef.current !== null) return;
    rafIdRef.current = window.requestAnimationFrame(() => {
      rafIdRef.current = null;
      const pendingPosition = pendingPositionRef.current;
      if (!pendingPosition) return;
      applySpotlightStyle(pendingPosition.x, pendingPosition.y, 1);
      pendingPositionRef.current = null;
    });
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    pendingPositionRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    scheduleSpotlightUpdate();
  };

  const handlePointerLeave = () => {
    pendingPositionRef.current = null;
    if (rafIdRef.current !== null) {
      window.cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    applySpotlightStyle(0, 0, 0);
  };

  const overlayStyle: CSSProperties = {
    opacity: "var(--spot-opacity, 0)",
    transition: `opacity ${SPOTLIGHT.OPACITY_TRANSITION}s ease`,
    textShadow: `
      0 0 10px rgba(255, 255, 255, 0.8),
      -2px 0 0 rgba(255, 0, 0, 0.3),
      2px 0 0 rgba(0, 255, 255, 0.3)
    `,
    filter: 'brightness(1.5) contrast(1.2)',
    mixBlendMode: 'normal',
    maskImage: `radial-gradient(circle ${SPOTLIGHT.INNER_RADIUS}px at var(--spot-x, 0px) var(--spot-y, 0px), black 0%, transparent 100%)`,
    WebkitMaskImage: `radial-gradient(circle ${SPOTLIGHT.INNER_RADIUS}px at var(--spot-x, 0px) var(--spot-y, 0px), black 0%, transparent 100%)`,
  };

  const outlineStyle: CSSProperties = {
    WebkitTextStroke: '1px rgba(255,255,255,0.4)',
    opacity: "calc(var(--spot-opacity, 0) * 0.5)",
    maskImage: `radial-gradient(circle ${SPOTLIGHT.OUTER_RADIUS}px at var(--spot-x, 0px) var(--spot-y, 0px), black 0%, transparent 100%)`,
    WebkitMaskImage: `radial-gradient(circle ${SPOTLIGHT.OUTER_RADIUS}px at var(--spot-x, 0px) var(--spot-y, 0px), black 0%, transparent 100%)`,
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`relative inline-block cursor-none select-none ${className}`}
      style={{ "--spot-x": "0px", "--spot-y": "0px", "--spot-opacity": 0 } as CSSProperties}
    >
      <span className="relative z-10 text-gray-500 transition-colors duration-300">
        {children}
      </span>

      <span
        className="absolute top-0 left-0 z-20 text-white pointer-events-none"
        style={overlayStyle}
      >
        {children}
      </span>
      
      <span
        className="absolute top-0 left-0 z-20 text-transparent pointer-events-none"
        style={outlineStyle}
      >
        {children}
      </span>
    </div>
  );
};

export default SpotlightText;
