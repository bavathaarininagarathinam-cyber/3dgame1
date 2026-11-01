import React, { useEffect, useRef } from 'react';

interface ConfettiCanvasProps {
  active: boolean;
  type?: 'coins' | 'celebration';
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  shape: 'coin' | 'rect' | 'circle' | 'gem';
  opacity: number;
  decay: number;
}

export const ConfettiCanvas: React.FC<ConfettiCanvasProps> = ({ active, type = 'celebration' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const colors = type === 'coins'
      ? ['#F59E0B', '#FBBF24', '#D97706', '#FEF08A', '#FCD34D']
      : ['#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#8B5CF6', '#FBBF24', '#14B8A6'];

    const particles: Particle[] = [];
    const count = type === 'coins' ? 90 : 120;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: width * 0.5 + (Math.random() - 0.5) * 200,
        y: height * 0.45 + (Math.random() - 0.5) * 100,
        vx: (Math.random() - 0.5) * 18,
        vy: -Math.random() * 15 - 4,
        size: Math.random() * 8 + (type === 'coins' ? 8 : 5),
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        shape: type === 'coins' ? 'coin' : Math.random() > 0.4 ? 'rect' : 'coin',
        opacity: 1,
        decay: Math.random() * 0.003 + 0.003
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      let aliveCount = 0;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // Gravity
        p.vx *= 0.99; // Air friction
        p.rotation += p.rotationSpeed;
        p.opacity -= p.decay;

        if (p.opacity > 0 && p.y < height + 50) {
          aliveCount++;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = Math.max(0, p.opacity);

          if (p.shape === 'coin') {
            // Draw golden coin with rim
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.ellipse(0, 0, p.size, p.size * 0.75, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#92400E';
            ctx.lineWidth = 1.5;
            ctx.stroke();
            // Inner coin emblem
            ctx.fillStyle = '#FEF3C7';
            ctx.font = `bold ${Math.floor(p.size * 0.8)}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('$', 0, 0);
          } else {
            // Draw sparkling confetti ribbon
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size, -p.size * 0.6, p.size * 2, p.size * 1.2);
          }

          ctx.restore();
        }
      }

      if (aliveCount > 0) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [active, type]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 w-full h-full"
    />
  );
};
