import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";

const mouse = { x: 0, y: 0 };
const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

function ParallaxStars() {
  const starsRef = useRef();

  useFrame(() => {
    if (!starsRef.current || isMobile) return;

    const targetX = mouse.x * 0.4;
    const targetY = mouse.y * 0.4;

    starsRef.current.rotation.y += (targetX - starsRef.current.rotation.y) * 0.05;
    starsRef.current.rotation.x += (targetY - starsRef.current.rotation.x) * 0.05;
  });

  return (
    <group ref={starsRef}>
      <Stars radius={100} depth={50} count={1000} factor={6} saturation={0} fade speed={0.5} />
    </group>
  );
}

const cards = [
  { title: "Design", desc: "Beautiful glassmorphism UI with stunning depth and clarity", accent: "160, 68, 255" },
  { title: "Develop", desc: "Built with React & Three.js for maximum performance", accent: "0, 210, 255" },
  { title: "Deploy", desc: "Ship fast with modern tools and zero friction", accent: "255, 0, 127" }
];

function GlassCard({ card, index }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const floatDurations = [4, 5.5, 3.8];
  const floatDelays = [0, 1.2, 0.6];

  const handleMouseMove = (e) => {
    if (isMobile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * 15, y: x * -15 });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => !isMobile && setHovered(true)}
      onMouseLeave={() => { setTilt({ x: 0, y: 0 }); setHovered(false); }}
      className="responsive-glass-card"
      style={{
        flex: "1 1 200px",
        maxWidth: "240px",
        padding: "28px 20px",
        borderRadius: "24px",
        border: `1px solid rgba(${card.accent}, ${hovered ? 0.4 : 0.15})`,
        background: `rgba(${card.accent}, ${hovered ? 0.12 : 0.04})`,
        backdropFilter: "blur(30px)",
        WebkitBackdropFilter: "blur(30px)",
        boxShadow: hovered
          ? `0 24px 60px rgba(${card.accent}, 0.25), inset 0 1px 0 rgba(255,255,255,0.15)`
          : `0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)`,
        color: "#ffffff",
        textAlign: "center",
        cursor: "pointer",
        transition: "border 0.4s ease, background 0.4s ease, box-shadow 0.4s ease, transform 0.4s ease-out",
        willChange: "transform",
        transform: hovered
          ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-10px)`
          : undefined,
        animation: hovered
          ? "none"
          : `float ${floatDurations[index]}s ease-in-out ${floatDelays[index]}s infinite`,
      }}
    >
      <div style={{
        width: "40px",
        height: "40px",
        borderRadius: "12px",
        background: `rgba(${card.accent}, 0.15)`,
        border: `1px solid rgba(${card.accent}, 0.3)`,
        margin: "0 auto 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "0.85rem",
        fontWeight: "800",
        color: `rgba(${card.accent}, 1)`
      }}>
        {String(index + 1).padStart(2, "0")}
      </div>

      <h3 style={{
        color: hovered ? "#FFD700" : "#ffffff",
        transition: "color 0.4s ease",
        fontSize: "1.2rem",
        fontWeight: "700",
        margin: "0 0 10px 0",
        letterSpacing: "0.5px"
      }}>
        {card.title}
      </h3>

      <p style={{
        color: hovered ? "rgba(255, 215, 0, 0.7)" : "rgba(255,255,255,0.6)",
        transition: "color 0.4s ease",
        fontSize: "0.85rem",
        margin: 0,
        lineHeight: "1.5"
      }}>
        {card.desc}
      </p>

      <div style={{
        marginTop: "18px",
        fontSize: "0.75rem",
        color: `rgba(${card.accent}, 0.9)`,
        letterSpacing: "2px",
        textTransform: "uppercase",
        opacity: hovered ? 1 : 0,
        transition: "opacity 0.3s ease"
      }}>
        Explore →
      </div>
    </div>
  );
}

export default function App() {
  const displacementRef = useRef(null);
  const rippleState = useRef({ animating: false, currentScale: 0, time: 0, animFrame: null });

  const startRipple = () => {
    rippleState.current.animating = true;

    function animate() {
      if (!displacementRef.current) return;

      if (!rippleState.current.animating) {
        rippleState.current.currentScale *= 0.92;
        displacementRef.current.setAttribute("scale", rippleState.current.currentScale);

        if (rippleState.current.currentScale > 0.1) {
          rippleState.current.animFrame = requestAnimationFrame(animate);
        } else {
          rippleState.current.currentScale = 0;
          displacementRef.current.setAttribute("scale", 0);
        }
        return;
      }

      rippleState.current.time += 0.02;
      rippleState.current.currentScale = 12 + Math.sin(rippleState.current.time * 2) * 5 + Math.sin(rippleState.current.time * 5) * 3;
      displacementRef.current.setAttribute("scale", rippleState.current.currentScale);
      rippleState.current.animFrame = requestAnimationFrame(animate);
    }

    cancelAnimationFrame(rippleState.current.animFrame);
    animate();
  };

  const stopRipple = () => {
    rippleState.current.animating = false;
  };

  useEffect(() => {
    // ESLint Ref warning fix
    const currentState = rippleState.current;
    return () => {
      if (currentState && currentState.animFrame) {
        cancelAnimationFrame(currentState.animFrame);
      }
    };
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "radial-gradient(circle at 20% 20%, rgba(160, 68, 255, 0.2) 0%, rgba(0,0,0,0) 40%), radial-gradient(circle at 80% 80%, rgba(255, 68, 153, 0.15) 0%, rgba(0,0,0,0) 40%), #050508",
        position: "relative",
        overflowX: "hidden",
        overflowY: "auto",
        fontFamily: "sans-serif",
        userSelect: "none"
      }}
      onMouseMove={(e) => {
        mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
        mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
      }}
      onMouseLeave={() => { mouse.x = 0; mouse.y = 0; }}
      onTouchMove={(e) => {
        const t = e.touches[0];
        mouse.x = (t.clientX / window.innerWidth - 0.5) * 2;
        mouse.y = -(t.clientY / window.innerHeight - 0.5) * 2;
      }}
      onTouchEnd={() => { mouse.x = 0; mouse.y = 0; }}
    >
      <style>{`
        @keyframes float {
          0%, 100% { transform: perspective(1000px) translateY(0px); }
          50% { transform: perspective(1000px) translateY(-10px); }
        }

        @media (max-width: 768px) {
          .main-hero-content {
            padding: 60px 20px !important;
            height: auto !important; 
            gap: 40px !important;
          }
          .cards-responsive-container {
            flex-direction: column !important; 
            align-items: center !important;
            width: 100% !important;
            gap: 24px !important;
          }
          .responsive-glass-card {
            width: 100% !important;
            max-width: 300px !important;
            animation: none !important;
          }
        }
      `}</style>

      {/* SVG FILTER */}
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <filter id="liquid">
            <feTurbulence type="turbulence" baseFrequency="0.008" numOctaves="6" result="noise" />
            <feDisplacementMap ref={displacementRef} in="SourceGraphic" in2="noise" scale="0" />
          </filter>
        </defs>
      </svg>

      {/* BACKGROUND 3D STARS */}
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 1, pointerEvents: "none" }}>
        <Canvas camera={{ position: [0, 0, 4], fov: 75 }} gl={{ alpha: true }}>
          <ambientLight intensity={0.2} />
          <pointLight position={[20, 20, 10]} intensity={2.5} color="#ffffff" />
          <pointLight position={[-6, 3, 2]} intensity={4.5} color="#a044ff" />
          <pointLight position={[6, -3, 4]} intensity={5.0} color="#00d2ff" />
          <ParallaxStars />
        </Canvas>
      </div>

      {/* CONTENT INTERLAY */}
      <div
        className="main-hero-content"
        style={{
          position: "relative",
          width: "100%",
          minHeight: "100vh",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          pointerEvents: "none",
          color: "#ffffff",
          textAlign: "center",
          padding: "40px 20px",
          gap: "48px",
          boxSizing: "border-box",
        }}
      >
        <div>
          <h1
            onMouseEnter={startRipple}
            onMouseLeave={stopRipple}
            style={{
              fontSize: "clamp(2rem, 6vw, 3.8rem)",
              fontWeight: "800",
              margin: "0 0 16px 0",
              letterSpacing: "-1px",
              textTransform: "uppercase",
              filter: "url(#liquid)",
              pointerEvents: "auto",
              cursor: "default",
              color: "#ffffff"
            }}
          >
            Glassmorphism
          </h1>
          <p style={{
            fontSize: "clamp(0.9rem, 2vw, 1.1rem)",
            color: "rgba(255, 255, 255, 0.6)",
            margin: 0,
            maxWidth: "460px"
          }}>
            Floating glass cards with stunning depth and interactivity
          </p>
        </div>

        <div
          className="cards-responsive-container"
          style={{
            display: "flex",
            gap: "24px",
            justifyContent: "center",
            alignItems: "center",
            pointerEvents: "auto",
            width: "100%",
            maxWidth: "900px",
          }}
        >
          {cards.map((card, i) => (
            <GlassCard key={i} card={card} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}