/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import { useFrame } from "@react-three/fiber";
import { useNavigate } from "react-router";
import { useSpring } from "@react-spring/three";
import { animated } from "@react-spring/three";
import { useMemo, useRef, useState } from "react";
import GalaxyHoverUI from "./GalaxyHoverUI";
function CareerGalaxy({
  count = 5000,
  radius = 10,
  arms = 3,
  color = "#8200db",
}) {
  const [hovered, isHovered] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0, z: 0 });

  const handlePointerMove = (e) => {
    setCursorPos({
      x: e.point.x.toFixed(2),
      y: e.point.y.toFixed(2) - 10,
      z: e.point.z.toFixed(2),
    });
  };
  const { scale } = useSpring({
    scale: hovered ? 1.4 : 1,
    config: { tension: 200, friction: 20 },
  });

  const pointsRef = useRef();
  const navigate = useNavigate();
  const coreRef = useRef();

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const armWidth = 0.4;
    const bulgeDensity = 0.15; // 15% of stars in bulge

    for (let i = 0; i < count; i++) {
      const isBulge = Math.random() < bulgeDensity;

      if (isBulge) {
        // Dense spherical bulge at center
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = Math.pow(Math.random(), 1.5) * radius * 0.25;

        pos.set(
          [
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.sin(phi) * Math.sin(theta) * 0.3,
            r * Math.cos(phi),
          ],
          i * 3
        );
      } else {
        // Multiple spiral arms with logarithmic spacing
        const t = Math.pow(i / count, 0.8) * Math.PI * 3;
        const armIndex = Math.floor(Math.random() * arms);
        const armAngle = (armIndex / arms) * Math.PI * 2;

        const r = radius * Math.pow(i / count, 0.9);
        const angle = t + armAngle;

        // Logarithmic spiral with density variations
        const x =
          Math.cos(angle) * r + (Math.random() - 0.5) * armWidth * r * 0.3;
        const y = (Math.random() - 0.5) * Math.exp(-r / radius) * 0.4;
        const z =
          Math.sin(angle) * r + (Math.random() - 0.5) * armWidth * r * 0.3;

        pos.set([x, y, z], i * 3);
      }
    }

    return pos;
  }, [count, radius, arms]);
  const handleClick = () => {
    navigate("/career");
  };
  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Differential rotation (inner parts rotate faster)
    pointsRef.current.rotation.y = time * 1.22;

    // Counter-rotating core
    if (coreRef.current) {
      coreRef.current.rotation.y = -time * 0.05;
    }
  });

  return (
    <>
      {hovered ? (
        <GalaxyHoverUI cursorPos={cursorPos} galaxyNAME={"Career"} />
      ) : null}
      <group position={[30, 0, 50]}>
        {/* Invisible hitbox sphere - handles all interactions */}
        <mesh
          onClick={handleClick}
          onPointerEnter={() => {
            isHovered(true);
            document.body.style.cursor = "pointer";
          }}
          onPointerMove={handlePointerMove}
          onPointerLeave={() => {
            isHovered(false);
            document.body.style.cursor = "default";
          }}
        >
          <sphereGeometry args={[radius * 1.2, 32, 32]} />
          <meshBasicMaterial visible={false} />
        </mesh>

        {/* Visual galaxy points - no interaction, just visuals */}
        <animated.points scale={scale} ref={pointsRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              array={positions}
              count={count}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.03}
            color={color}
            sizeAttenuation={false}
            depthWrite={true}
            transparent
            opacity={hovered ? 0.85 : 0.2}
            blending={hovered ? 2 : 1}
            toneMapped={false}
          />
        </animated.points>
      </group>
    </>
  );
}

export default CareerGalaxy;
