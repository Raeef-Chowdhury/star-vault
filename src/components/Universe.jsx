/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import React, { useRef, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useSpring, animated } from "@react-spring/three";
import Stars from "../Stars";

function SpiralGalaxy({
  count = 5000,
  radius = 10,
  rotations = 5,
  color = "#66ccff",
}) {
  const pointsRef = useRef();

  // Generate spiral positions once
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const t = (i / count) * rotations * Math.PI * 2;

      // Spiral formula
      const r = radius * (i / count);

      const x = Math.cos(t) * r + (Math.random() - 0.5) * 0.1;
      const y = (Math.random() - 0.5) * 0.1;
      const z = Math.sin(t) * r + (Math.random() - 0.5) * 0.1;

      pos.set([x, y, z], i * 3);
    }

    return pos;
  }, [count, radius, rotations]);

  useFrame(() => {
    pointsRef.current.rotation.y += 0.0008;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color={color}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

const spheresData = [
  { position: [-15, 0, 2], color: "#ef4444" },
  { position: [-10, 0, 1], color: "#22c55e" },
  { position: [-5, 0, 4], color: "#3b82f6" },
  { position: [5, 0, 6], color: "#eab308" },
  { position: [10.5, 0, 7], color: "#a855f7" },
  { position: [15, 0, 20], color: "#06b6d4" },
];

function Sphere({ position, color }) {
  const [hovered, isHovered] = useState(false);
  const { scale } = useSpring({
    scale: hovered ? 1.4 : 1,
    config: { tension: 300, friction: 10 },
  });
  return (
    <group
      position={position}
      onPointerEnter={() => {
        isHovered(true);
      }}
      onPointerOut={() => {
        isHovered(false);
      }}
    >
      <mesh>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.25}
          depthWrite={false}
        />
      </mesh>

      <animated.mesh scale={scale}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color={color} />
      </animated.mesh>
    </group>
  );
}
function ConnectionLines() {
  const linesRef = useRef();

  const linePositions = React.useMemo(() => {
    const positions = [];

    // Create a chain: connect each sphere to the next one only
    for (let i = 0; i < spheresData.length - 1; i++) {
      positions.push(...spheresData[i].position);
      positions.push(...spheresData[i + 1].position);
    }

    return new Float32Array(positions);
  }, []);

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={linePositions.length / 3}
          array={linePositions}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color="#ffffff"
        transparent
        opacity={0.15}
        depthWrite={false}
      />
    </lineSegments>
  );
}

// function CameraLogger() {
//   const { camera } = useThree();

//   useFrame(() => {
//     console.log("Camera position:", camera.position);
//     console.log("Camera rotation:", camera.rotation);
//   });

//   return null; // Don't return console.log, return null or JSX
// }

function Scence() {
  return (
    <div className="h-[100vh] w-[100vw] bg-blck">
      <Canvas
        camera={{ position: [-17.5, 16, 35], fov: 60 }}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <ConnectionLines />
        <Stars />

        {spheresData.map((sphere, idx) => (
          <Sphere key={idx} {...sphere} />
        ))}
        <SpiralGalaxy />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={10}
          maxDistance={100}
          autoRotate={true}
          autoRotateSpeed={0.5}
          blending={2}
          touches={{
            ONE: 2,
            TWO: 1,
          }}
        />
      </Canvas>
    </div>
  );
}
export default Scence;
