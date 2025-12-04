/* eslint-disable no-undef */
/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import React, { useRef, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useSpring, animated } from "@react-spring/three";
import { useThree } from "@react-three/fiber";
import Stars from "../Stars";
function EllipticalGalaxy({
  count = 8000,
  radiusX = 8,
  radiusY = 5,
  radiusZ = 8,
  color = "#ff8844",
}) {
  const pointsRef = useRef();

  // Generate elliptical distribution with dense core
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Use power distribution for denser core
      const r = Math.pow(Math.random(), 0.5);

      // Random spherical coordinates
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      // Elliptical shape with varying radii
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
    pointsRef.current.rotation.y += 0.0005;
  });

  return (
    <points ref={pointsRef} position={[50, 0, 0]}>
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
        sizeAttenuation
        depthWrite={false}
        transparent
        opacity={0.8}
        blending={2}
      />
    </points>
  );
}
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
    <points ref={pointsRef} position={[0, 0, 50]}>
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
    <div className="h-[100vh] w-[100vw] relative bg-black">
      <p className="text-white text-[4.8rem] absolute top-10 left-10 tracking-[1.5rem]">
        UNIVERSE
      </p>
      <Canvas
        camera={{ position: [-2.4, 3.4, -2.6], fov: 100 }}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        {/* <CameraLogger /> */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <ConnectionLines />
        <Stars />

        {spheresData.map((sphere, idx) => (
          <Sphere key={idx} {...sphere} />
        ))}
        <SpiralGalaxy />
        <EllipticalGalaxy />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={17.5}
          maxDistance={100}
          blending={2}
          touches={{
            ONE: 2,
            TWO: 1,
          }}
        />
      </Canvas>
      <p className="text-gray-200 opacity-40 text-[2.4rem] uppercase absolute transform left-1/2 transform translate-x-[-50%] bottom-10 tracking-[1rem] ">
        Select a Galaxy to Explore
      </p>
    </div>
  );
}
export default Scence;
