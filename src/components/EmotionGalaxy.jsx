/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import { useFrame } from "@react-three/fiber";
import { useNavigate } from "react-router";
import { useSpring } from "@react-spring/three";
import { animated } from "@react-spring/three";
import { useMemo, useRef, useState } from "react";
import GalaxyHoverUI from "./GalaxyHoverUI";
function EmotionGalaxy({
  count = 20000,
  radius = 10,
  blobCount = 10,
  color = "#ff66aa",
  cameraPos,
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
  const { positions, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sizeArray = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Create multiple irregular "blobs" of star formation
      const blobIndex = Math.floor(Math.random() * blobCount);
      const blobAngle = (blobIndex / blobCount) * Math.PI * 2;

      // Offset each blob from center
      const blobDistance = radius * (0.3 + Math.random() * 0.7);
      const blobCenterX = Math.cos(blobAngle) * blobDistance;
      const blobCenterZ = Math.sin(blobAngle) * blobDistance;

      // Random position within blob using exponential distribution
      const r = Math.pow(Math.random(), 1.5) * radius * 0.6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const x = blobCenterX + r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta) * 0.4; // Flatter
      const z = blobCenterZ + r * Math.cos(phi);

      // Add chaotic scatter
      const scatter = 1.5;
      pos.set(
        [
          x + (Math.random() - 0.5) * scatter,
          y + (Math.random() - 0.5) * scatter * 0.5,
          z + (Math.random() - 0.5) * scatter,
        ],
        i * 3
      );

      // Varied star sizes
      sizeArray[i] = 0.015 + Math.random() * 0.04;
    }

    return { positions: pos, sizes: sizeArray };
  }, [count, radius, blobCount]);

  // Chaotic, multi-axis rotation
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    pointsRef.current.rotation.x = Math.sin(t * 0.1) * 0.2;
    pointsRef.current.rotation.y += 0.0304;
    pointsRef.current.rotation.z = Math.cos(t * 0.15) * 0.1;
  });

  const handleClick = () => {
    navigate("/emotion");
  };
  return (
    <>
      {hovered ? (
        <GalaxyHoverUI galaxyNAME={"Emotions"} cursorPos={cursorPos} />
      ) : null}{" "}
      <group position={cameraPos}>
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
        <animated.points ref={pointsRef} scale={scale}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              array={positions}
              count={count}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-size"
              array={sizes}
              count={count}
              itemSize={1}
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
export default EmotionGalaxy;
