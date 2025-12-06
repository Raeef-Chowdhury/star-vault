/* eslint-disable no-undef */
/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";
import Stars from "../Stars";
import ConnectionLines from "./ConnectionLines";
import Header from "./header";
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

function SpiralPlanets() {
  return (
    <>
      <Header />
      <div className="h-[100vh] w-[100vw] relative bg-black">
        <p className="text-white text-[4.8rem] absolute top-10 left-10 tracking-[1.5rem]">
          EMOTIONS
        </p>
        <Canvas
          camera={{ position: [-30, 24, 1.2], fov: 100 }}
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

          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={10}
            maxDistance={200}
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
    </>
  );
}
export default SpiralPlanets;
