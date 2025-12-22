/* eslint-disable react/jsx-key */
/* eslint-disable no-undef */
/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import { useState, useRef, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";
import { motion } from "motion/react";
import Stars from "../Stars";
import ConnectionLines from "./ConnectionLines";
import Header from "./header";
import SideBar from "./SideBar";
import BackButton from "./BackButton";
import { useStarVault } from "./header";
import Sphere from "./GalaxySphere";

function EmotionGalaxy({
  count = 6000,
  radius = 3,
  blobCount = 10,
  color = "#ff66aa",
  cameraPos,
}) {
  const { scale } = useSpring({
    config: { tension: 200, friction: 20 },
  });

  const pointsRef = useRef();
  const { positions, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sizeArray = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const blobIndex = Math.floor(Math.random() * blobCount);
      const blobAngle = (blobIndex / blobCount) * Math.PI * 2;
      const blobDistance = radius * (0.3 + Math.random() * 0.7);
      const blobCenterX = Math.cos(blobAngle) * blobDistance;
      const blobCenterZ = Math.sin(blobAngle) * blobDistance;
      const r = Math.pow(Math.random(), 1.5) * radius * 0.6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const x = blobCenterX + r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta) * 0.4;
      const z = blobCenterZ + r * Math.cos(phi);
      const scatter = 1.5;
      pos.set(
        [
          x + (Math.random() - 0.5) * scatter,
          y + (Math.random() - 0.5) * scatter * 0.5,
          z + (Math.random() - 0.5) * scatter,
        ],
        i * 3
      );
      sizeArray[i] = 0.015 + Math.random() * 0.04;
    }

    return { positions: pos, sizes: sizeArray };
  }, [count, radius, blobCount]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    pointsRef.current.rotation.x = Math.sin(t * 0.1) * 0.2;
    pointsRef.current.rotation.y += 0.0304;
    pointsRef.current.rotation.z = Math.cos(t * 0.15) * 0.1;
  });

  return (
    <>
      <group position={cameraPos}>
        <mesh>
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
            opacity={1}
            blending={2}
            toneMapped={false}
          />
        </animated.points>
      </group>
    </>
  );
}

function EmotionPlanets() {
  const { galaxies } = useStarVault();

  const emotionGalaxy = galaxies.find((g) => g.id === "emotion");
  const emotionStars = emotionGalaxy?.stars || [];
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
          <p className="text-emotion text-[4.8rem] max-2xl:text-[4.2rem] max-xl:text-[3.6rem] max-lg:text-[3rem] tracking-[1.5rem] max-2xl:tracking-[1.3rem] max-xl:tracking-[1.1rem] max-lg:tracking-[0.9rem] max-md:tracking-[0.6rem]  max-md:text-[3.6rem] max-md:mt-[4.8rem] max-md:mb-[4.8rem] max-sm:tracking-[0.3rem] leading-tight">
            EMOTION PLANETS ⋅ ({EmotionPlanets.length})
          </p>
          <BackButton />
        </div>
        <SideBar />
        <Canvas
          camera={{
            position: [-30, 24, 1.2],
            fov: 100,
          }}
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <ConnectionLines planetPositions={emotionGalaxy.stars} />
          <Stars />
          <EmotionGalaxy cameraPos={[0, 0, 0]} />
          {emotionStars.map((star) => (
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
            minDistance={50}
            maxDistance={200}
            blending={2}
            touches={{
              ONE: 2,
              TWO: 1,
            }}
          />
        </Canvas>
        {emotionStars.length < 1 && (
          <p className="max-md:hidden text-text opacity-60 text-[1.4rem] max-lg:text-[1.2rem] max-sm:text-[1rem] uppercase absolute left-1/2 -translate-x-1/2 bottom-10 max-sm:bottom-5 tracking-[0.4rem] max-sm:tracking-[0.2rem] text-center max-sm:px-4">
            Want to add something? Click Add Memory Form
          </p>
        )}
      </motion.div>
    </>
  );
}

export default EmotionPlanets;
