import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";

const mouse = { x: 0, y: 0 };
const isMobile = window.innerWidth < 768;

let animating = false;
let currentScale = 0;
let animFrame = null;

function startRipple() {
  animating = true;
  const disp = document.getElementById("displacement");
  let time = 0;
  function animate() {
    if (!animating) {
      currentScale *= 0.92;
      disp.setAttribute("scale", currentScale);
      if (currentScale > 0.1) {
        animFrame = requestAnimationFrame(animate);
      } else {
        currentScale = 0;
        disp.setAttribute("scale", 0);
      }
      return;
    }
    time += 0.02;
    currentScale = 12 + Math.sin(time * 2) * 5 + Math.sin(time * 5) * 3;
    disp.setAttribute("scale", currentScale);
    animFrame = requestAnimationFrame(animate);
  }
  cancelAnimationFrame(animFrame);
  animate();
}

function stopRipple() {
  animating = false;
}

function ParallaxStars() {
  const starsRef = useRef();
  useFrame(() => {
    if (!starsRef.current) return;
    starsRef.current.rotation.x += (mouse.y * 0.05 - starsRef.current.rotation.x) * 0.05;
    starsRef.current.rotation.y += (mouse.x * 0.05 - starsRef.current.rotation.y) * 0.05;
  });
  return (
    <Stars ref={starsRef} radius={100} depth={50} count={900} factor={6} saturation={0} fade speed={0.8} />
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
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * 20, y: x * -20 });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setTilt({ x: 0, y: 0 }); setHovered(false); }}
      style={{
        width: "min(200px, 80vw)",
        padding: "28px 20px",
        borderRadius: "28px",
        border: `1px solid rgba(${card.accent}, ${hovered ? 0.4 : 0.15})`,
        background: `rgba(${card.accent}, ${hovered ? 0.12 : 0.05})`,
        backdropFilter: "blur(40px)",
        WebkitBackdropFilter: "blur(40px)",
        boxShadow: hovered
          ? `0 24px 80px rgba(${card.accent}, 0.25), inset 0 1px 0 rgba(255,255,255,0.15)`
          : `0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)`,
        color: "#ffffff",
        textAlign: "center",
        cursor: "pointer",
        transition: "border 0.4s ease, background 0.4s ease, box-shadow 0.4s ease, transform 0.4s ease",
        willChange: "transform",
        transform: hovered
          ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-12px)`
          : undefined,
        animation: hovered
          ? "none"
          : `float ${floatDurations[index]}s ease-in-out ${floatDelays[index]}s infinite`,
      }}
    >
      <div style={{
        width: "48px",
        height: "48px",
        borderRadius: "16px",
        background: `rgba(${card.accent}, 0.2)`,
        border: `1px solid rgba(${card.accent}, 0.3)`,
        margin: "0 auto 20px",
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
        fontSize: "clamp(0.9rem, 2vw, 1.3rem)",
        fontWeight: "700",
        margin: "0 0 12px 0",
        letterSpacing: "0.5px"
      }}>
        {card.title}
      </h3>

      <p style={{
        color: hovered ? "rgba(255, 215, 0, 0.6)" : "rgba(255,255,255,0.55)",
        transition: "color 0.4s ease",
        fontSize: "clamp(0.75rem, 1.5vw, 0.9rem)",
        margin: 0,
        lineHeight: "1.6"
      }}>
        {card.desc}
      </p>

      <div style={{
        marginTop: "24px",
        fontSize: "0.8rem",
        color: `rgba(${card.accent}, 0.8)`,
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
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "radial-gradient(circle at 20% 20%, rgba(160, 68, 255, 0.25) 0%, rgba(0,0,0,0) 30%), radial-gradient(circle at 80% 80%, rgba(255, 68, 153, 0.18) 0%, rgba(0,0,0,0) 30%), #050508",
        position: "relative",
        overflow: "hidden",
        fontFamily: "sans-serif"
      }}
      onMouseMove={(e) => {
        mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
        mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
      }}
      onMouseLeave={() => { mouse.x = 0; mouse.y = 0; }}
      onTouchStart={(e) => {
        const t = e.touches[0];
        mouse.x = (t.clientX / window.innerWidth - 0.5) * 2;
        mouse.y = (t.clientY / window.innerHeight - 0.5) * 2;
      }}
      onTouchMove={(e) => {
        const t = e.touches[0];
        mouse.x = (t.clientX / window.innerWidth - 0.5) * 2;
        mouse.y = (t.clientY / window.innerHeight - 0.5) * 2;
      }}
      onTouchEnd={() => { mouse.x = 0; mouse.y = 0; }}
    >
      <style>{`
        @keyframes float {
          0%, 100% { transform: perspective(1000px) translateY(0px) translateZ(0); }
          50% { transform: perspective(1000px) translateY(-12px) translateZ(0); }
        }
      `}</style>

      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <filter id="liquid">
            <feTurbulence type="turbulence" baseFrequency="0.008" numOctaves="6" result="noise" />
            <feDisplacementMap id="displacement" in="SourceGraphic" in2="noise" scale="0" />
          </filter>
        </defs>
      </svg>

      <Canvas camera={{ position: [0, 0, 4], fov: 75 }} style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[20, 20, 10]} intensity={2.5} color="#ffffff" />
        <pointLight position={[-6, 3, 2]} intensity={4.5} color="#a044ff" />
        <pointLight position={[6, -3, 4]} intensity={5.0} color="#00d2ff" />
        <ParallaxStars />
      </Canvas>

      <div style={{
        position: "absolute",
        top: 0, left: 0,
        width: "100%", height: "100%",
        zIndex: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        pointerEvents: "none",
        color: "#11a0f2",
        textAlign: "center",
        padding: "clamp(20px, 5vh, 40px) 20px",
        gap: "clamp(16px, 3vw, 40px)",
        boxSizing: "border-box",
        overflowY: "auto",
      }}>
        <div>
          <h1
            onMouseEnter={startRipple}
            onMouseLeave={stopRipple}
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: "800",
              margin: "0 0 16px 0",
              letterSpacing: "-1px",
              textTransform: "uppercase",
              filter: "url(#liquid)",
              pointerEvents: "auto",
              cursor: "default"
            }}
          >
            Glassmorphism
          </h1>
          <p style={{
            fontSize: "clamp(0.9rem, 2vw, 1.3rem)",
            color: "rgba(113, 237, 30, 0.67)",
            margin: 0,
            maxWidth: "460px"
          }}>
            Floating glass cards with stunning depth and interactivity
          </p>
        </div>

        <div style={{
          display: "flex",
          gap: "24px",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          pointerEvents: "auto",
          width: "100%",
        }}>
          {cards.map((card, i) => (
            <GlassCard key={i} card={card} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}