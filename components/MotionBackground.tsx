'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  color: string;
  alpha: number;
  pulseSpeed: number;
  pulseOffset: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
}

export default function MotionBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle Palette
    const colors = [
      '#A855F7', // Neon Purple
      '#7C3AED', // Deep Violet
      '#C084FC', // Light Purple
      '#38BDF8', // Electric Cyan
      '#D946EF', // Fuchsia
      '#818CF8', // Indigo
    ];

    // Initialize Particles
    const particleCount = Math.min(80, Math.floor((width * height) / 16000));
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const radius = Math.random() * 2.5 + 1.5;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.9,
        vy: (Math.random() - 0.5) * 0.9,
        radius,
        baseRadius: radius,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.6 + 0.4,
        pulseSpeed: Math.random() * 0.03 + 0.01,
        pulseOffset: Math.random() * Math.PI * 2,
      });
    }

    // Ripple pulses
    const ripples: Ripple[] = [];
    let lastRippleTime = 0;

    // Mouse coordinates with smooth easing
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      radius: 180,
      active: false,
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
      mouse.active = false;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let time = 0;

    const render = () => {
      time += 0.015;

      // Mouse position lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;

      ctx.clearRect(0, 0, width, height);

      // 1. Render Flowing Laser Wave Ribbons (Cyber Grid Wave)
      ctx.save();
      const waveCount = 3;
      for (let w = 0; w < waveCount; w++) {
        ctx.beginPath();
        const baseOffset = height * (0.65 + w * 0.12);
        const freq = 0.002 + w * 0.001;
        const amp = 45 + w * 20;
        const speed = time * (1.2 + w * 0.5);

        ctx.moveTo(0, height);
        for (let x = 0; x <= width; x += 15) {
          const y = baseOffset + Math.sin(x * freq + speed) * amp + Math.cos(x * freq * 0.6 - speed * 0.8) * (amp * 0.5);
          ctx.lineTo(x, y);
        }
        ctx.lineTo(width, height);
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, baseOffset - amp, width, height);
        if (w === 0) {
          grad.addColorStop(0, 'rgba(168, 85, 247, 0.08)');
          grad.addColorStop(0.5, 'rgba(124, 58, 237, 0.05)');
          grad.addColorStop(1, 'rgba(56, 189, 248, 0.03)');
        } else if (w === 1) {
          grad.addColorStop(0, 'rgba(217, 70, 239, 0.06)');
          grad.addColorStop(0.5, 'rgba(168, 85, 247, 0.04)');
          grad.addColorStop(1, 'transparent');
        } else {
          grad.addColorStop(0, 'rgba(99, 102, 241, 0.07)');
          grad.addColorStop(1, 'transparent');
        }

        ctx.fillStyle = grad;
        ctx.fill();

        // Wave crest laser line
        ctx.beginPath();
        for (let x = 0; x <= width; x += 20) {
          const y = baseOffset + Math.sin(x * freq + speed) * amp + Math.cos(x * freq * 0.6 - speed * 0.8) * (amp * 0.5);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = w === 0 ? 'rgba(168, 85, 247, 0.25)' : w === 1 ? 'rgba(217, 70, 239, 0.18)' : 'rgba(56, 189, 248, 0.15)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
      ctx.restore();

      // 2. Spawn Random Ambient Cyber Pulse Rings
      if (Date.now() - lastRippleTime > 3000 && Math.random() < 0.3) {
        lastRippleTime = Date.now();
        ripples.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: 5,
          maxRadius: Math.random() * 120 + 80,
          alpha: 0.5,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }

      // Render & update ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += 1.2;
        r.alpha -= 0.005;

        if (r.alpha <= 0 || r.radius >= r.maxRadius) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = r.color;
        ctx.globalAlpha = r.alpha;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = r.color;
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.restore();
      }

      // 3. Update and Draw Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move particle
        p.x += p.vx;
        p.y += p.vy;

        // Pulse radius
        p.radius = p.baseRadius + Math.sin(time * 3 + p.pulseOffset) * 0.6;

        // Bounce on edges
        if (p.x < 0) { p.x = 0; p.vx *= -1; }
        else if (p.x > width) { p.x = width; p.vx *= -1; }
        if (p.y < 0) { p.y = 0; p.vy *= -1; }
        else if (p.y > height) { p.y = height; p.vy *= -1; }

        // Mouse interaction (gentle push)
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (1 - dist / mouse.radius) * 1.8;
            p.x += (dx / (dist || 1)) * force;
            p.y += (dy / (dist || 1)) * force;
          }
        }

        // Draw particle glow & circle
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, p.radius), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.restore();

        // 4. Draw Connecting Neural Lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 135;

          if (dist < maxDist) {
            const lineAlpha = (1 - dist / maxDist) * 0.35;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = lineAlpha;
            ctx.lineWidth = 1;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 4;
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1] w-full h-full"
      style={{ opacity: 0.95 }}
      aria-hidden="true"
    />
  );
}
