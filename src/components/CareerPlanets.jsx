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

function CareerGalaxy({
  count = 5000,
  radius = 5,
  arms = 3,
  color = "#4488ff",
  cameraPos = [30, 0, 50], // ← Added this prop with default value
}) {
  const { scale } = useSpring({
    scale: 1.4,
    config: { tension: 200, friction: 20 },
  });

  const pointsRef = useRef();
  const coreRef = useRef();

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const armWidth = 0.4;
    const bulgeDensity = 0.15; // 15% of stars in bulge

    for (let i = 0; i < count; i++) {
      const isBulge = Math.random() < bulgeDensity;

      if (isBulge) {
        // Dense spherical bulge at center
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = Math.pow(Math.random(), 1.5) * radius * 0.25;

        pos.set(
          [
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.sin(phi) * Math.sin(theta) * 0.3,
            r * Math.cos(phi),
          ],
          i * 3
        );
      } else {
        // Multiple spiral arms with logarithmic spacing
        const t = Math.pow(i / count, 0.8) * Math.PI * 3;
        const armIndex = Math.floor(Math.random() * arms);
        const armAngle = (armIndex / arms) * Math.PI * 2;

        const r = radius * Math.pow(i / count, 0.9);
        const angle = t + armAngle;

        // Logarithmic spiral with density variations
        const x =
          Math.cos(angle) * r + (Math.random() - 0.5) * armWidth * r * 0.3;
        const y = (Math.random() - 0.5) * Math.exp(-r / radius) * 0.4;
        const z =
          Math.sin(angle) * r + (Math.random() - 0.5) * armWidth * r * 0.3;

        pos.set([x, y, z], i * 3);
      }
    }

    return pos;
  }, [count, radius, arms]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Differential rotation (inner parts rotate faster)
    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 1.22;
    }

    // Counter-rotating core
    if (coreRef.current) {
      coreRef.current.rotation.y = -time * 0.05;
    }
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
              array={positions.map(() => 1)}
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
function CareerPlanets() {
  const { galaxies } = useStarVault();
  const careerGalaxy = galaxies.find((galaxy) => galaxy.id === "career");
  const careerPlanets = careerGalaxy?.stars || [];
  const [hoveredSphere, setHoveredSphere] = useState(null);
  const [openModal, setOpenModal] = useState(null);
  return (
    <>
      <Header />

      <motion.div
        initial={{ opacity: 0, translateX: "-100%" }}
        animate={{ opacity: 1, translateX: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="h-[100vh] min-[2560px]-[120vh] min-[1920px]:h-[120vh] max-[1921px]:h-[160vh] max-2xl:h-[155vh] max-xl:h-[140vh] max-lg:h-[135vh] max-md:h-[110vh] max-sm:h-[90vh] w-screen relative bg-black overflow-hidden"
      >
        <div className="flex max-md:flex-col gap-[8rem] max-2xl:gap-[6rem] max-xl:gap-[4rem] max-lg:gap-[3rem] max-md:gap-[2rem] max-sm:gap-[1.5rem] justify-between p-[4rem] max-2xl:p-[3rem] max-xl:p-[2.5rem] max-lg:p-[2rem] max-md:p-[1.5rem] max-sm:p-[1rem] items-center max-md:items-center">
          <p className="text-career text-[4.8rem] max-2xl:text-[4.2rem] max-xl:text-[3.6rem] max-lg:text-[3rem] tracking-[1.5rem] max-2xl:tracking-[1.3rem] max-xl:tracking-[1.1rem] max-lg:tracking-[0.9rem] max-md:tracking-[0.6rem]  max-md:text-[3.6rem] max-md:mt-[4.8rem] max-md:mb-[4.8rem] max-sm:tracking-[0.3rem] leading-tight">
            CAREER PLANETS ⋅ ({careerPlanets.length})
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
          <ConnectionLines planetPositions={careerGalaxy?.stars} />
          <Stars />
          <CareerGalaxy cameraPos={[0, 0, 0]} />

          {careerPlanets.map((star) => (
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
        {careerPlanets.length < 1 && (
          <p className="text-text max-md:hidden opacity-60 text-[1.4rem] uppercase absolute transform left-1/2 transform translate-x-[-50%] bottom-10 tracking-[0.4rem] ">
            Want to add something? Click Add Memory Form
          </p>
        )}
      </motion.div>
    </>
  );
}

export default CareerPlanets;
