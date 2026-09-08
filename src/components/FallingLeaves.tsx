import React, { useMemo } from 'react';

interface LeafConfig {
  id: number;
  left: number; // percentage across container
  delay: number; // seconds
  duration: number; // seconds
  size: number; // px
  rotation: number; // degrees
  swayDuration: number;
  color: string;
  type: number; // 0, 1, 2 for different leaf silhouettes
}

interface FallingLeavesProps {
  count?: number;
  containerClassName?: string;
}

export const FallingLeaves: React.FC<FallingLeavesProps> = ({
  count = 22,
  containerClassName = '',
}) => {
  const leaves = useMemo<LeafConfig[]>(() => {
    const colors = [
      '#eab308', // amber golden
      '#f59e0b', // warm ochre
      '#ea580c', // autumn rust
      '#d97706', // gold
      '#84cc16', // fresh olive leaf
      '#fb923c', // light coral orange
      '#ec4899', // delicate soft petal
      '#10b981', // emerald green
    ];

    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 96 + 2, // 2% to 98%
      delay: Math.random() * 5, // 0 to 5s stagger
      duration: 6 + Math.random() * 5, // 6 to 11s falling time
      size: 14 + Math.random() * 16, // 14px to 30px
      rotation: Math.random() * 360,
      swayDuration: 2.2 + Math.random() * 2,
      color: colors[i % colors.length],
      type: i % 3,
    }));
  }, [count]);

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none z-10 ${containerClassName}`}
    >
      <style>{`
        @keyframes fallAndFadeNearGround {
          0% {
            transform: translateY(-40px) rotate(0deg) scale(0.85);
            opacity: 0;
          }
          10% {
            opacity: 0.9;
          }
          65% {
            opacity: 0.85;
          }
          85% {
            opacity: 0.35;
          }
          100% {
            transform: translateY(105%) rotate(380deg) scale(0.6);
            opacity: 0;
          }
        }

        @keyframes leafSway {
          0%, 100% {
            margin-left: -18px;
          }
          50% {
            margin-left: 18px;
          }
        }

        .falling-leaf {
          position: absolute;
          top: -30px;
          will-change: transform, opacity;
          animation-name: fallAndFadeNearGround;
          animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
          animation-iteration-count: infinite;
        }

        .leaf-inner {
          animation-name: leafSway;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
      `}</style>

      {leaves.map((leaf) => (
        <div
          key={leaf.id}
          className="falling-leaf"
          style={{
            left: `${leaf.left}%`,
            animationDuration: `${leaf.duration}s`,
            animationDelay: `${leaf.delay}s`,
          }}
        >
          <div
            className="leaf-inner"
            style={{
              animationDuration: `${leaf.swayDuration}s`,
            }}
          >
            <svg
              width={leaf.size}
              height={leaf.size}
              viewBox="0 0 24 24"
              fill={leaf.color}
              className="drop-shadow-sm transition-transform"
              style={{
                transform: `rotate(${leaf.rotation}deg)`,
                opacity: 0.92,
              }}
            >
              {leaf.type === 0 && (
                // Oval classic leaf with midrib
                <path d="M12 2C6 5 3 11 4 16c1 5 7 6 11 5 4-1 6-5 6-9 0-6-6-9-9-10zm-1 17c-2.5 0-5.5-1.5-6.2-4.5-.8-3.5 1.5-8 5.2-10.5.2 4.5 1.5 8.5 4 11.5-1 2.2-2 3.5-3 3.5z" />
              )}
              {leaf.type === 1 && (
                // Autumn maple notched leaf
                <path d="M12 2l1.8 4.2 3.8-1.5-1.2 4.2 4.6.8-3.2 3 2.5 3.5-4.2-.2L13 22l-1-4-3.1 4.2-1.1-6.2-4.2.2 2.5-3.5-3.2-3 4.6-.8-1.2-4.2 3.8 1.5z" />
              )}
              {leaf.type === 2 && (
                // Slender willow leaf
                <path d="M17 2C10 5 4 11 3 17c2 3 7 4 11 2 5-2 8-8 8-13 0-2-3-4-5-4zm-2 15c-3 1-6.5-.5-7.5-3-1.2-3 1.2-7 4.5-9.5.5 3.5 2 6.5 4.5 8.8-.5 2.2-1 3.7-1.5 3.7z" />
              )}
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
};
