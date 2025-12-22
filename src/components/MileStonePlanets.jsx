/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import Header from "./header";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { motion } from "motion/react";
import Stars from "../Stars";
import ConnectionLines from "./ConnectionLines";
import SideBar from "./SideBar";
import BackButton from "./BackButton";
import { useMemo, useRef } from "react";
import { useSpring } from "@react-spring/three";
import { useFrame } from "@react-three/fiber";
import { animated } from "@react-spring/three";
import { useState } from "react";
import { useStarVault } from "./header";
import Sphere from "./GalaxySphere";

function PersGalaxy({
  count = 8000,
  radiusX = 6,
  radiusY = 4,
  radiusZ = 6,
  color = "#ff8844",
  cameraPos = [30, 0, 50], // ← Added this prop with default value
}) {
  const { scale } = useSpring({
    scale: 1.4,
    config: { tension: 200, friction: 20 },
  });

  const pointsRef = useRef();

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

  return (
    <>
      <group position={cameraPos}>
        <mesh>
          <sphereGeometry args={[radiusY * 1.2, 32, 32]} />
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
            opacity={1}
            blending={2}
            toneMapped={false}
          />
        </animated.points>
      </group>
    </>
  );
}
function MileStonePlanets() {
  const { galaxies } = useStarVault();
  const MilestoneGalaxy = galaxies.find((galaxy) => galaxy.id === "milestone");
  const MilestonePlanets = MilestoneGalaxy?.stars || [];
  const [hoveredSphere, setHoveredSphere] = useState(null);
  const [openModal, setOpenModal] = useState(null);
  return (
    <>
      <Header />

      <motion.div
        initial={{ opacity: 0, translateX: "-100%" }}
        animate={{ opacity: 1, translateX: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="h-[200vh] max-[1921px]:h-[160vh] max-2xl:h-[155vh] max-xl:h-[140vh] max-lg:h-[135vh] max-md:h-[110vh] max-sm:h-[90vh] w-screen relative bg-black overflow-hidden"
      >
        <div className="flex max-md:flex-col gap-[8rem] max-2xl:gap-[6rem] max-xl:gap-[4rem] max-lg:gap-[3rem] max-md:gap-[2rem] max-sm:gap-[1.5rem] justify-between p-[4rem] max-2xl:p-[3rem] max-xl:p-[2.5rem] max-lg:p-[2rem] max-md:p-[1.5rem] max-sm:p-[1rem] items-center max-md:items-center">
          <p className="text-milestone text-[4.8rem] max-2xl:text-[4.2rem] max-xl:text-[3.6rem] max-lg:text-[3rem] tracking-[1.5rem] max-2xl:tracking-[1.3rem] max-xl:tracking-[1.1rem] max-lg:tracking-[0.9rem] max-md:tracking-[0.6rem]  max-md:text-[3.6rem] max-md:mt-[4.8rem] max-md:mb-[4.8rem] max-sm:tracking-[0.3rem] leading-tight">
            MILESTONE PLANETS ⋅ ({MilestonePlanets.length})
          </p>
          <BackButton />
        </div>
        <SideBar />
        <Canvas
          camera={{ position: [-30, 24, 1.2], fov: 100 }}
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <ConnectionLines planetPositions={MilestoneGalaxy?.stars} />
          <Stars />
          <PersGalaxy cameraPos={[0, 0, 0]} />

          {MilestonePlanets.map((star) => (
            <Sphere
              key={star.id}
              position={star.position}
              color={star.color}
              starData={star}
              isHovered={hoveredSphere === star.id}
              onHoverChange={(hovered) =>
                setHoveredSphere(hovered ? star.id : null)
              }
              isModalOpen={openModal === star.id}
              onModalChange={(open) => setOpenModal(open ? star.id : null)}
            />
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
        {MilestonePlanets.length < 1 && (
          <p className="max-md:hidden text-text opacity-60 text-[1.4rem] uppercase absolute transform left-1/2 transform translate-x-[-50%] bottom-10 tracking-[0.4rem] ">
            Want to add something? Click Add Memory Form
          </p>
        )}
      </motion.div>
    </>
  );
}

export default MileStonePlanets;
