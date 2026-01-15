'use client';

import { useRef, useState, ReactNode } from 'react';
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
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative inline-block cursor-none select-none ${className}`}
    >
      <span className="relative z-10 text-gray-500 transition-colors duration-300">
        {children}
      </span>

      <span
        className="absolute top-0 left-0 z-20 text-white pointer-events-none"
        style={{
          maskImage: `radial-gradient(circle ${SPOTLIGHT.INNER_RADIUS}px at ${position.x}px ${position.y}px, black 0%, transparent 100%)`,
          WebkitMaskImage: `radial-gradient(circle ${SPOTLIGHT.INNER_RADIUS}px at ${position.x}px ${position.y}px, black 0%, transparent 100%)`,
          opacity: opacity,
          transition: `opacity ${SPOTLIGHT.OPACITY_TRANSITION}s ease`,
          textShadow: `
            0 0 10px rgba(255, 255, 255, 0.8),
            -2px 0 0 rgba(255, 0, 0, 0.3),
            2px 0 0 rgba(0, 255, 255, 0.3)
          `,
          filter: 'brightness(1.5) contrast(1.2)',
          mixBlendMode: 'normal'
        }}
      >
        {children}
      </span>
      
      <span
        className="absolute top-0 left-0 z-20 text-transparent pointer-events-none"
        style={{
          WebkitTextStroke: '1px rgba(255,255,255,0.4)',
          maskImage: `radial-gradient(circle ${SPOTLIGHT.OUTER_RADIUS}px at ${position.x}px ${position.y}px, black 0%, transparent 100%)`,
          WebkitMaskImage: `radial-gradient(circle ${SPOTLIGHT.OUTER_RADIUS}px at ${position.x}px ${position.y}px, black 0%, transparent 100%)`,
          opacity: opacity * 0.5,
        }}
      >
        {children}
      </span>
    </div>
  );
};

export default SpotlightText;
