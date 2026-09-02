import { useEffect, useRef, useState } from "react";

function CursorGlow() {
  const primaryGlowRef = useRef(null);
  const trailGlowRef = useRef(null);
  const [sparkles, setSparkles] = useState([]);
  const mousePos = useRef({ x: -100, y: -100 });
  const primaryPos = useRef({ x: -100, y: -100 });
  const trailPos = useRef({ x: -100, y: -100 });
  const isVisible = useRef(false);
  const lastSparkleTime = useRef(0);

  useEffect(() => {
    // Only run on devices that support fine pointer (mouse/trackpad)
    if (window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible.current) {
        isVisible.current = true;
        primaryPos.current = { x: e.clientX, y: e.clientY };
        trailPos.current = { x: e.clientX, y: e.clientY };
      }

      // Periodically spawn small glowing stardust sparkles
      const now = Date.now();
      if (now - lastSparkleTime.current > 70) {
        lastSparkleTime.current = now;
        const newSparkle = {
          id: now + Math.random(),
          x: e.clientX + (Math.random() * 20 - 10),
          y: e.clientY + (Math.random() * 20 - 10),
          size: Math.random() * 5 + 3,
          color: [
            "#38bdf8",
            "#818cf8",
            "#c084fc",
            "#34d399",
            "#fbbf24",
            "#f472b6",
          ][Math.floor(Math.random() * 6)],
        };

        setSparkles((prev) => [...prev.slice(-14), newSparkle]);
      }
    };

    const handleMouseLeave = () => {
      isVisible.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    let animationFrameId;

    const animate = () => {
      if (isVisible.current) {
        // Smooth linear interpolation (LERP)
        // Primary orb tracks briskly
        primaryPos.current.x += (mousePos.current.x - primaryPos.current.x) * 0.22;
        primaryPos.current.y += (mousePos.current.y - primaryPos.current.y) * 0.22;

        // Secondary trail orb glides softly behind
        trailPos.current.x += (mousePos.current.x - trailPos.current.x) * 0.08;
        trailPos.current.y += (mousePos.current.y - trailPos.current.y) * 0.08;

        if (primaryGlowRef.current) {
          primaryGlowRef.current.style.transform = `translate3d(${primaryPos.current.x}px, ${primaryPos.current.y}px, 0)`;
          primaryGlowRef.current.style.opacity = "1";
        }
        if (trailGlowRef.current) {
          trailGlowRef.current.style.transform = `translate3d(${trailPos.current.x}px, ${trailPos.current.y}px, 0)`;
          trailGlowRef.current.style.opacity = "1";
        }
      } else {
        if (primaryGlowRef.current) primaryGlowRef.current.style.opacity = "0";
        if (trailGlowRef.current) trailGlowRef.current.style.opacity = "0";
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Auto clean up sparkles
  useEffect(() => {
    if (sparkles.length === 0) return;
    const timer = setTimeout(() => {
      setSparkles((prev) => prev.slice(1));
    }, 450);
    return () => clearTimeout(timer);
  }, [sparkles]);

  return (
    <div className="cursor-glow-container" aria-hidden="true">
      {/* Primary fast spotlight aura */}
      <div ref={primaryGlowRef} className="cursor-glow-orb primary" />

      {/* Secondary soft ambient trail */}
      <div ref={trailGlowRef} className="cursor-glow-orb trail" />

      {/* Trailing sparkle particles */}
      {sparkles.map((s) => (
        <span
          key={s.id}
          className="cursor-sparkle"
          style={{
            left: s.x,
            top: s.y,
            width: s.size,
            height: s.size,
            backgroundColor: s.color,
            boxShadow: `0 0 ${s.size * 2}px ${s.color}`,
          }}
        />
      ))}
    </div>
  );
}

export default CursorGlow;
