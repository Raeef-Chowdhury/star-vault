/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import { useFrame } from "@react-three/fiber";
import { useNavigate } from "react-router";
import { useSpring } from "@react-spring/three";
import { animated } from "@react-spring/three";
import { useMemo, useRef, useState } from "react";
import GalaxyHoverUI from "./GalaxyHoverUI";
function MilestoneGalaxy({
  count = 8000,
  radiusX = 8,
  radiusY = 5,
  radiusZ = 8,
  color = "#ff8844",
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

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const r = Math.pow(Math.random(), 0.5);

      // Random spherical coordinates
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const x = r * radiusX * Math.sin(phi) * Math.cos(theta);
      const y = r * radiusY * Math.sin(phi) * Math.sin(theta);
      const z = r * radiusZ * Math.cos(phi);

      // Add slight randomness
      const scatter = 0.3 * (1 - r); // Less scatter near core
      pos.set(
        [
          x + (Math.random() - 0.5) * scatter,
          y + (Math.random() - 0.5) * scatter,
          z + (Math.random() - 0.5) * scatter,
        ],
        i * 3
      );
    }

    return pos;
  }, [count, radiusX, radiusY, radiusZ]);

  // Vary star sizes based on distance from core
  const sizes = useMemo(() => {
    const sizeArray = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const x = positions[i * 3];
      const y = positions[i * 3 + 1];
      const z = positions[i * 3 + 2];
      const distFromCore = Math.sqrt(x * x + y * y + z * z);

      // Stars near core are bigger and brighter
      sizeArray[i] = 0.05 - (distFromCore / radiusX) * 0.03;
    }

    return sizeArray;
  }, [positions, radiusX]);

  // Slow tumbling rotation
  useFrame(() => {
    pointsRef.current.rotation.x += 0.0003;
    pointsRef.current.rotation.y += 0.0105;
  });
  const handleClick = () => {
    navigate("/milestones");
  };
  console.log(sizes);
  return (
    <>
      {hovered ? (
        <GalaxyHoverUI galaxyNAME={"Milestones"} cursorPos={cursorPos} />
      ) : null}
      <group position={[60, 0, 0]}>
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
          <sphereGeometry args={[radiusX * 1.2, 32, 32]} />
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
export default MilestoneGalaxy;
