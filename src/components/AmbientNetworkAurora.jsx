import { useEffect, useRef } from "react";

/**
 * AmbientNetworkAurora
 * Combines:
 * 1. Fluid Breathing Aurora Light Orbs (Liquid Mesh Glow)
 * 2. Dynamic Interactive Particle Network (Constellation Mesh with Mouse Connection)
 */
function AmbientNetworkAurora() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates & interaction radius
    const mouse = {
      x: -1000,
      y: -1000,
      radius: 170,
    };

    // 1. Constellation Particle Network Nodes
    const particleCount = Math.min(Math.floor((width * height) / 16000), 75);
    const connectionDistance = 140;

    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      radius: Math.random() * 2.0 + 1.2,
      baseAlpha: Math.random() * 0.5 + 0.35,
      color: [
        "#38bdf8", // Sky blue
        "#818cf8", // Indigo
        "#c084fc", // Purple
        "#34d399", // Emerald
        "#fb923c", // Sunset Amber
      ][Math.floor(Math.random() * 5)],
    }));

    // 2. Fluid Breathing Aurora Liquid Orbs
    const auroraOrbs = [
      {
        xRatio: 0.15,
        yRatio: 0.2,
        radiusRatio: 0.35,
        color: "rgba(56, 189, 248, ", // Cyan
        baseAlpha: 0.28,
        speedX: 0.0006,
        speedY: 0.0008,
        pulseSpeed: 0.0012,
        phase: 0,
      },
      {
        xRatio: 0.85,
        yRatio: 0.25,
        radiusRatio: 0.38,
        color: "rgba(168, 85, 247, ", // Violet
        baseAlpha: 0.26,
        speedX: -0.0007,
        speedY: 0.0009,
        pulseSpeed: 0.0014,
        phase: 2.1,
      },
      {
        xRatio: 0.5,
        yRatio: 0.65,
        radiusRatio: 0.42,
        color: "rgba(99, 102, 241, ", // Indigo
        baseAlpha: 0.22,
        speedX: 0.0008,
        speedY: -0.0006,
        pulseSpeed: 0.001,
        phase: 4.2,
      },
      {
        xRatio: 0.2,
        yRatio: 0.85,
        radiusRatio: 0.32,
        color: "rgba(52, 211, 153, ", // Mint Emerald
        baseAlpha: 0.24,
        speedX: -0.0006,
        speedY: -0.0007,
        pulseSpeed: 0.0016,
        phase: 1.5,
      },
      {
        xRatio: 0.8,
        yRatio: 0.85,
        radiusRatio: 0.3,
        color: "rgba(251, 146, 60, ", // Sunset Amber
        baseAlpha: 0.22,
        speedX: 0.0005,
        speedY: 0.0006,
        pulseSpeed: 0.0013,
        phase: 3.4,
      },
    ];

    // Resize handler with devicePixelRatio support
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    let time = 0;

    // Main Render Loop
    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      // Check current theme
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      const themeAlphaMultiplier = isDark ? 1.0 : 1.25;

      // ----------------------------------------------------
      // Phase 1: Render Fluid Breathing Aurora Orbs
      // ----------------------------------------------------
      ctx.globalCompositeOperation = isDark ? "screen" : "multiply";

      auroraOrbs.forEach((orb) => {
        // Fluid drifting motion
        const currentX = (orb.xRatio + Math.sin(time * orb.speedX + orb.phase) * 0.12) * width;
        const currentY = (orb.yRatio + Math.cos(time * orb.speedY + orb.phase) * 0.12) * height;

        // Breathing pulse
        const pulse = Math.sin(time * orb.pulseSpeed + orb.phase) * 0.15;
        const currentRadius = (orb.radiusRatio + pulse) * Math.min(width, height);
        const currentAlpha = (orb.baseAlpha + pulse * 0.3) * themeAlphaMultiplier;

        const grad = ctx.createRadialGradient(
          currentX,
          currentY,
          0,
          currentX,
          currentY,
          currentRadius
        );

        grad.addColorStop(0, `${orb.color}${Math.min(currentAlpha, 0.6)})`);
        grad.addColorStop(0.5, `${orb.color}${Math.min(currentAlpha * 0.45, 0.35)})`);
        grad.addColorStop(1, `${orb.color}0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(currentX, currentY, currentRadius, 0, Math.PI * 2);
        ctx.fill();
      });

      // ----------------------------------------------------
      // Phase 2: Render Constellation Particle Network
      // ----------------------------------------------------
      ctx.globalCompositeOperation = "source-over";

      // Update particle positions
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around screen borders gracefully
        if (p.x < -10) p.x = width + 10;
        else if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        else if (p.y > height + 10) p.y = -10;

        // Mouse Magnetism / Repulsion interaction
        const dxMouse = mouse.x - p.x;
        const dyMouse = mouse.y - p.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

        if (distMouse < mouse.radius) {
          const force = (mouse.radius - distMouse) / mouse.radius;
          p.x -= (dxMouse / distMouse) * force * 1.5;
          p.y -= (dyMouse / distMouse) * force * 1.5;
        }
      });

      // Draw Constellation Connection Lines between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const lineAlpha = (1 - dist / connectionDistance) * (isDark ? 0.28 : 0.22);
            ctx.strokeStyle = isDark
              ? `rgba(147, 197, 253, ${lineAlpha})`
              : `rgba(99, 102, 241, ${lineAlpha})`;
            ctx.lineWidth = (1 - dist / connectionDistance) * 1.2;

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        // Draw Interactive Line from particle to Mouse cursor
        const dxM = mouse.x - particles[i].x;
        const dyM = mouse.y - particles[i].y;
        const distM = Math.sqrt(dxM * dxM + dyM * dyM);

        if (distM < mouse.radius) {
          const mouseLineAlpha = (1 - distM / mouse.radius) * (isDark ? 0.45 : 0.35);
          ctx.strokeStyle = isDark
            ? `rgba(56, 189, 248, ${mouseLineAlpha})`
            : `rgba(37, 99, 235, ${mouseLineAlpha})`;
          ctx.lineWidth = (1 - distM / mouse.radius) * 1.6;

          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }

      // Draw Glowing Particle Nodes
      particles.forEach((p) => {
        // Node outer subtle glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = isDark
          ? `${p.color}33`
          : `${p.color}22`;
        ctx.fill();

        // Node core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = isDark ? 8 : 4;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="ambient-network-aurora-canvas" aria-hidden="true" />;
}

export default AmbientNetworkAurora;
