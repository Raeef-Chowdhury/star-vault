/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import { useFrame } from "@react-three/fiber";
import { useNavigate } from "react-router";
import { useSpring } from "@react-spring/three";
import { animated } from "@react-spring/three";
import { useMemo, useRef, useState } from "react";
import GalaxyHoverUI from "./GalaxyHoverUI";

function PersonalGalaxy({
  count = 12000,
  innerRadius = 4,
  outerRadius = 12,
  ringThickness = 1.5,
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

  // Generate ring/hourglass galaxy distribution
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Create ring structure with gap in middle
      const ringPos = Math.random();
      const radius = innerRadius + ringPos * (outerRadius - innerRadius);

      // Random angle around the ring
      const theta = Math.random() * Math.PI * 2;

      // Height varies - creates the ring/torus shape
      const heightFactor = Math.pow(Math.random(), 2);
      const height = (Math.random() - 0.5) * ringThickness * heightFactor;

      // Position in ring
      const x = radius * Math.cos(theta);
      const z = radius * Math.sin(theta);
      const y = height;

      // Add turbulence that increases with radius
      const turbulence = 0.3 * (radius / outerRadius);
      pos.set(
        [
          x + (Math.random() - 0.5) * turbulence,
          y + (Math.random() - 0.5) * turbulence * 0.5,
          z + (Math.random() - 0.5) * turbulence,
        ],
        i * 3
      );
    }

    return pos;
  }, [count, innerRadius, outerRadius, ringThickness]);

  // Vary star sizes - brighter in the ring itself
  const sizes = useMemo(() => {
    const sizeArray = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const x = positions[i * 3];
      const y = positions[i * 3 + 1];
      const z = positions[i * 3 + 2];

      const radiusFromCenter = Math.sqrt(x * x + z * z);
      const heightFromPlane = Math.abs(y);

      // Stars in the ring plane are brighter
      const planeFactor = 1 - Math.min(heightFromPlane / ringThickness, 1);
      const ringFactor = radiusFromCenter > innerRadius ? 1 : 0.5;

      sizeArray[i] = 0.02 + planeFactor * 0.04 * ringFactor;
    }

    return sizeArray;
  }, [positions, innerRadius, ringThickness]);

  // Rotate the ring galaxy
  useFrame(() => {
    pointsRef.current.rotation.y += 0.0061;
    pointsRef.current.rotation.x = Math.sin(Date.now() * 0.0001) * 0.1;
  });
  const handleClick = () => {
    navigate("/personal");
  };
  return (
    <>
      {hovered ? (
        <GalaxyHoverUI galaxyNAME={"Personal"} cursorPos={cursorPos} />
      ) : null}
      <group position={[20, 0, -50]}>
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
          <sphereGeometry args={[outerRadius * 1.2, 32, 32]} />
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
export default PersonalGalaxy;
