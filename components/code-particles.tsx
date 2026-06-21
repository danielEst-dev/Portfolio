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
  fontStr: string;
}

function createParticle(w: number, h: number): Particle {
  const size = Math.random() * 2 + 9; // 9–11px
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    // Very slow drift
    vx: (Math.random() - 0.5) * 0.12,
    vy: (Math.random() - 0.5) * 0.08 + 0.04, // slight downward bias
    token: TOKENS[Math.floor(Math.random() * TOKENS.length)],
    alpha: Math.random() * 0.035 + 0.015, // 0.015 – 0.05
    size,
    // Precomputed once so the rAF draw loop avoids a per-frame font-string
    // allocation. ctx.font still varies per particle (size differs), so the
    // assignment stays in the loop — only the string build is hoisted to init.
    fontStr: `${size}px "JetBrains Mono", "Fira Mono", monospace`,
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
    // Visibility flag — closure-mutable, not a React state, so the rAF
    // loop reads it on every frame without re-rendering. The hero canvas
    // is off-screen for most of the page; pausing avoids wasted GPU work.
    let isVisible = true;

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
      // Skip the heavy clear+draw+particle-step pass when the canvas isn't
      // visible. Schedule the next frame regardless so we resume promptly
      // once the hero scrolls back into view.
      if (isVisible) {
        ctx.clearRect(0, 0, w, h);

        // Detect dark mode from :root class
        const isDark = document.documentElement.classList.contains("dark");
        const baseColor = isDark ? "245,244,240" : "26,26,26";

        ctx.fontKerning = "none";

        for (const p of particles) {
          ctx.font = p.fontStr;
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
      }
      raf = requestAnimationFrame(draw);
    }

    init();
    draw();

    const ro = new ResizeObserver(() => {
      resize();
    });
    ro.observe(canvas);

    // Pause the rAF work when the hero is out of view. The 200px rootMargin
    // keeps the loop running briefly while the canvas is just barely
    // off-screen, so re-entry feels instantaneous.
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          isVisible = entry.isIntersecting;
        }
      },
      { rootMargin: "200px" }
    );
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
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
