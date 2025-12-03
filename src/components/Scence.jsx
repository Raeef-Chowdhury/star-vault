/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import React, { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

const spheresData = [
  { position: [0, 0, 2], color: "#ef4444" },
  { position: [0, 2, 1], color: "#22c55e" },
  { position: [0, 4, 4], color: "#3b82f6" },
  { position: [0, 5, 6], color: "#eab308" },
  { position: [2, 4, 7], color: "#a855f7" },
  { position: [0, 0, 20], color: "#06b6d4" },
];

function Sphere({ position, color }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.3, 32, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function ConnectionLines() {
  const linesRef = useRef();

  const linePositions = React.useMemo(() => {
    const positions = [];

    // Create lines between all pairs of spheres
    for (let i = 0; i < spheresData.length; i++) {
      for (let j = i + 1; j < spheresData.length; j++) {
        positions.push(...spheresData[i].position);
        positions.push(...spheresData[j].position);
      }
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
        opacity={1}
        depthWrite={false}
      />
    </lineSegments>
  );
}
function Stars() {
  const starsRef = React.useRef();

  const starPositions = React.useMemo(() => {
    const positions = new Float32Array(20000 * 3);
    for (let i = 0; i < 1000; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 50 + Math.random() * 50;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    return positions;
  }, []);

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={starPositions.length / 3}
          array={starPositions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#ffffff"
        transparent
        opacity={0.6}
        sizeAttenuation={true}
      />
    </points>
  );
}

function Scence() {
  return (
    <div style={{ width: "100vw", height: "100vh", background: "#000010" }}>
      <Canvas
        camera={{ position: [40, 10, 0], fov: 60 }}
        style={{
          width: "100%",
          height: "100%",
          transform: "translateX(+20rem)",
        }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <ConnectionLines />
        <Stars />

        {spheresData.map((sphere, idx) => (
          <Sphere key={idx} {...sphere} />
        ))}

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={10}
          maxDistance={50}
          autoRotate={true}
          autoRotateSpeed={0.5}
          blending={2}
          touches={{
            ONE: 2,
            TWO: 1,
          }}
        />
      </Canvas>

      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          color: "white",
          background: "rgba(0, 0, 0, 0.7)",
          padding: "12px 20px",
          borderRadius: "8px",
          fontSize: "14px",
          textAlign: "center",
          pointerEvents: "none",
        }}
      ></div>
    </div>
  );
}
export default Scence;
