'use client';

import { useEffect, useRef } from 'react';

const BackgroundCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const colors = ['#3b82f6', '#60a5fa', '#93c5fd']; // tons de azul
    const gradients = Array.from({ length: 5 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 200 + 200,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      for (const g of gradients) {
        const gradient = ctx.createRadialGradient(g.x, g.y, 0, g.x, g.y, g.r);
        gradient.addColorStop(0, g.color);
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2);
        ctx.fill();

        g.x += g.dx;
        g.y += g.dy;

        if (g.x < -g.r || g.x > width + g.r) g.dx *= -1;
        if (g.y < -g.r || g.y > height + g.r) g.dy *= -1;
      }

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.35 }}
    />
  );
};

export default BackgroundCanvas;
