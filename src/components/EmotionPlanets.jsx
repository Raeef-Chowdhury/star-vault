/* eslint-disable no-undef */
/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import { useState, useRef, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";
import { motion, AnimatePresence } from "motion/react";
import Stars from "../Stars";
import ConnectionLines from "./ConnectionLines";
import Header from "./header";
import SideBar from "./SideBar";
import BackButton from "./BackButton";
import { Html } from "@react-three/drei";
// Seeded random number generator for consistent results
function seededRandom(seed) {
  let x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

function randomPosition(
  seed,
  center = [0, 0, 0],
  minRadius = 16,
  maxRadius = 120
) {
  let x, y, z, distFromOrigin;
  let attempts = 0;

  do {
    const r =
      minRadius + seededRandom(seed + attempts) * (maxRadius - minRadius);
    const theta = seededRandom(seed + attempts + 1) * Math.PI * 2;

    // Flat circular distribution on XZ plane (no Y change)
    x = center[0] + r * Math.cos(theta);
    y = center[1]; // Keep Y constant at center's Y
    z = center[2] + r * Math.sin(theta);

    distFromOrigin = Math.sqrt(x ** 2 + y ** 2 + z ** 2);
    attempts++;
  } while (distFromOrigin < 4 && attempts < 100); // Reduced to 4 to avoid EmotionGalaxy (radius 3)

  return [x, y, z];
}

function randomStarColor(seed) {
  const letters = "4356789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(seededRandom(seed + i) * letters.length)];
  }
  return color;
}

export const galaxies = [
  {
    id: "personal",
    name: "Personal",
    color: "#ef4444",
    position: [-15, 0, 2],
    stars: Array.from({ length: 5 }).map((_, i) => ({
      id: `personal_mem_${i + 1}`,
      title: `Personal Memory ${i + 1}`,
      description: `This is sample Personal memory #${i + 1}.`,
      date: `2025-12-${i + 1 < 10 ? "0" : ""}${i + 1}`,
      position: randomPosition(1000 + i, [-15, 0, 2], 6, 12),
      color: randomStarColor(1000 + i),
    })),
  },
  {
    id: "career",
    name: "Career",
    color: "#22c55e",
    position: [-10, 0, 1],
    stars: Array.from({ length: 5 }).map((_, i) => ({
      id: `career_mem_${i + 1}`,
      title: `Career Memory ${i + 1}`,
      description: `This is sample Career memory #${i + 1}.`,
      date: `2025-11-${i + 10}`,
      position: randomPosition(2000 + i, [-10, 0, 1], 6, 12),
      color: randomStarColor(2000 + i),
    })),
  },
  {
    id: "milestone",
    name: "Milestone",
    color: "#3b82f6",
    position: [-5, 0, 4],
    stars: Array.from({ length: 5 }).map((_, i) => ({
      id: `milestone_mem_${i + 1}`,
      title: `Milestone Memory ${i + 1}`,
      description: `This is sample Milestone memory #${i + 1}.`,
      date: `2025-10-${i + 15}`,
      position: randomPosition(3000 + i, [-5, 0, 4], 6, 12),
      color: randomStarColor(3000 + i),
    })),
  },
  {
    id: "emotion",
    name: "Emotion",
    color: "#eab308",
    position: [5, 0, 6],
    stars: Array.from({ length: 5 }).map((_, i) => ({
      galaxy: "emotion",
      id: `emotion_mem_${i + 1}`,
      title: `Emotion Memory ${i + 1}`,
      description: `This is sample Emotion memory #${i + 1}.`,
      date: `2025-09-${i + 20}`,
      position: randomPosition(4000 + i * 50, [0, 0, 0], 10, 20),
      color: randomStarColor(4000 + i),
    })),
  },
  {
    id: "travel",
    name: "Travel",
    color: "#a855f7",
    position: [10.5, 0, 7],
    stars: Array.from({ length: 5 }).map((_, i) => ({
      id: `travel_mem_${i + 1}`,
      title: `Travel Memory ${i + 1}`,
      description: `This is sample Travel memory #${i + 1}.`,
      date: `2025-08-${i + 25}`,
      position: randomPosition(5000 + i, [10.5, 0, 7], 6, 12),
      color: randomStarColor(5000 + i),
    })),
  },
];

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
function Modal({ onClose, sphereData }) {
  return (
    <Html
      fullscreen
      style={{
        pointerEvents: "all",
      }}
    >
      <AnimatePresence>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed flex justify-center items-center z-[9998] bg-slate-700/10 w-[100vw] h-[100vh] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] backdrop-blur-md"
        />

        {/* Modal Content */}
        <div className="fixed top-1/2 left-1/2 max-w-[788px] -translate-x-1/2 -translate-y-1/2 w-screen h-screen flex items-center justify-center z-[9999] p-5 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{
              position: "relative",
              width: "90%",
              maxWidth: "1280px",
              minWidth: "320px",
              pointerEvents: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 md:p-10 shadow-2xl border border-slate-700">
              <div className="space-y-8">
                <div className="rounded-lg mx-auto  text-center backdrop-blur p-6 md:p-8 ">
                  <h3 className="text-[7.2rem] md:text-5xl lg:text-[4.8rem] mb-6 md:mb-8 lg:mb-[2.4rem] font-semibold text-primary flex items-center gap-2 justify-center flex-wrap">
                    <span className="text-[4.8rem] mb-[4.8rem]">
                      {sphereData?.title || "Memory Details"}
                    </span>
                  </h3>
                  <div className="flex justify-center items-center gap-6 flex-wrap">
                    <div className="flex items-center gap-3 bg-secondary/30 backdrop-blur-sm px-6 py-3 rounded-full border border-primary/20">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary"
                      >
                        <rect
                          x="3"
                          y="4"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      <span className="text-text text-[1.8rem] font-medium">
                        {sphereData?.date &&
                          new Date(sphereData.date).toLocaleDateString(
                            "en-US",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )}
                      </span>
                    </div>

                    <div
                      className={` bg-${sphereData?.galaxy}/20 backdrop-blur-sm px-6 py-3 rounded-full border border-${sphereData?.galaxy}/40`}
                    >
                      <span
                        className={`text-${sphereData?.galaxy} text-[1.8rem] font-semibold uppercase tracking-wider`}
                      >
                        {sphereData?.galaxy || "Emotion"}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4 text-sm md:text-base lg:text-[1.6rem] p-3 md:p-4 lg:p-[1rem] max-w-[644px] mx-auto mt-[4rem] text-text  leading-relaxed">
                    <p className="text-[2.4rem]">
                      {sphereData?.description ||
                        "This is your memory sphere. Click to explore."}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgb(148, 163, 184)",
                    transition: "color 0.2s",
                    zIndex: 10,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "rgb(239, 68, 68)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "rgb(148, 163, 184)")
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    </Html>
  );
}
function Sphere({ position, color, starData }) {
  const [modal, setModal] = useState(false);
  const [hovered, isHovered] = useState(false);

  const { scale } = useSpring({
    scale: hovered ? 1.4 : 1,
    config: { tension: 300, friction: 10 },
  });

  return (
    <>
      {modal && (
        <Modal
          onClose={() => setModal(false)}
          sphereData={starData}
          starId={starData.id}
        />
      )}
      <group
        onClick={() => setModal(true)}
        position={position}
        onPointerEnter={() => {
          isHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          isHovered(false);
          document.body.style.cursor = "default";
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
    </>
  );
}

function EmotionPlanets() {
  const emotionPlanets = galaxies.find((galaxy) => galaxy.name == "Emotion");

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
          EMOTION PLANETS
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
          <ConnectionLines planetPositions={emotionPlanets.stars} />
          <Stars />
          <EmotionGalaxy cameraPos={[0, 0, 0]} />
          {emotionPlanets.stars.map((star) => (
            <Sphere
              key={star.id}
              position={star.position}
              color={star.color}
              starData={star}
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
        <p className="text-gray-200 opacity-40 text-[2.4rem] uppercase absolute transform left-1/2 transform translate-x-[-50%] bottom-10 tracking-[1rem] ">
          Select a Memory (Planet) to Explore
        </p>
        <BackButton />
      </motion.div>
    </>
  );
}

export default EmotionPlanets;
