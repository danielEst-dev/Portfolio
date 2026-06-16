"use client";

import { useEffect, useRef } from "react";

const TOKENS = [
  "async", "await", "fn", "mut", "impl", "struct", "enum", "trait",
  "0x1F", "0xFF", "[]", "{}", "()", "=>", "::", "&&", "||",
  "GET", "POST", "200", "404", "500",
  "SELECT", "WHERE", "JOIN", "INDEX",
  "pub", "mod", "use", "let", "const",
  "Ok()", "Err()", "Some()", "None",
  "Vec<T>", "Box<>", "Arc<>",
  "tx", "rx", "db", "ctx", "req", "res",
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  token: string;
  alpha: number;
  size: number;
}

function createParticle(w: number, h: number): Particle {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    // Very slow drift
    vx: (Math.random() - 0.5) * 0.12,
    vy: (Math.random() - 0.5) * 0.08 + 0.04, // slight downward bias
    token: TOKENS[Math.floor(Math.random() * TOKENS.length)],
    alpha: Math.random() * 0.035 + 0.015, // 0.015 – 0.05
    size: Math.random() * 2 + 9, // 9–11px
  };
}

export function CodeParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Respect prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const PARTICLE_COUNT = 55;
    let particles: Particle[] = [];
    let raf: number;
    let w = 0;
    let h = 0;

    function resize() {
      if (!canvas) return;
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * devicePixelRatio;
      canvas.height = h * devicePixelRatio;
      ctx!.scale(devicePixelRatio, devicePixelRatio);
    }

    function init() {
      resize();
      particles = Array.from({ length: PARTICLE_COUNT }, () => createParticle(w, h));
    }

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);

      // Detect dark mode from :root class
      const isDark = document.documentElement.classList.contains("dark");
      const baseColor = isDark ? "245,244,240" : "26,26,26";

      ctx.fontKerning = "none";

      for (const p of particles) {
        ctx.font = `${p.size}px "JetBrains Mono", "Fira Mono", monospace`;
        ctx.fillStyle = `rgba(${baseColor},${p.alpha})`;
        ctx.fillText(p.token, p.x, p.y);

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.y > h + 20) { p.y = -20; p.x = Math.random() * w; }
        if (p.y < -20) { p.y = h + 20; }
        if (p.x > w + 60) { p.x = -60; }
        if (p.x < -60) { p.x = w + 60; }
      }

      raf = requestAnimationFrame(draw);
    }

    init();
    draw();

    const ro = new ResizeObserver(() => {
      resize();
    });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none select-none"
      style={{ zIndex: 0 }}
    />
  );
}
