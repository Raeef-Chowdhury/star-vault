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
        className="h-[100vh] w-[100vw] relative bg-black"
      >
        <p className="text-emotion text-[4.8rem] absolute top-10 left-10 tracking-[1.5rem]">
          EMOTION PLANETS ⋅ ({emotionStars.length})
        </p>
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
            minDistance={10}
            maxDistance={200}
            blending={2}
            touches={{
              ONE: 2,
              TWO: 1,
            }}
          />
        </Canvas>
        {emotionStars.length < 1 && (
          <p className="text-text opacity-60 text-[1.4rem] uppercase absolute transform left-1/2 transform translate-x-[-50%] bottom-10 tracking-[0.4rem] ">
            Want to add something? Click Add Memory Form
          </p>
        )}

        <BackButton />
      </motion.div>
    </>
  );
}

export default EmotionPlanets;
