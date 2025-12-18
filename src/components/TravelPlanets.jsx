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
import { Html } from "@react-three/drei";
import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { useStarVault } from "./header";
function TravelGalaxy({
  count = 15000,
  diskRadius = 10,
  diskThickness = 0.8,
  bulgeRadius = 3,
  color = "#497d00",
  radius = 3,
  cameraPos,
}) {
  const { scale } = useSpring({
    config: { tension: 200, friction: 20 },
  });

  const pointsRef = useRef();
  const { positions, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sizeArray = new Float32Array(count);

    // Split between bulge and disk
    const bulgeCount = Math.floor(count * 0.4); // 40% in central bulge
    const diskCount = count - bulgeCount;

    let idx = 0;

    // Create bright central bulge (spherical)
    for (let i = 0; i < bulgeCount; i++) {
      const r = Math.pow(Math.random(), 0.7) * bulgeRadius;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta) * 0.7; // Slightly flattened
      const z = r * Math.cos(phi);

      pos.set([x, y, z], idx * 3);

      // Brighter stars in bulge
      sizeArray[idx] = 0.04 + Math.random() * 0.03;
      idx++;
    }

    // Create smooth disk with NO spiral arms
    for (let i = 0; i < diskCount; i++) {
      // Exponential distribution for realistic disk
      const r =
        bulgeRadius + Math.pow(Math.random(), 0.5) * (diskRadius - bulgeRadius);
      const theta = Math.random() * Math.PI * 2;

      const x = r * Math.cos(theta);
      const z = r * Math.sin(theta);

      // Very thin disk with slight variation
      const y =
        (Math.random() - 0.5) * diskThickness * Math.exp(-r / diskRadius);

      pos.set([x, y, z], idx * 3);

      // Dimmer stars in outer disk
      sizeArray[idx] = 0.015 * (1 - (r / diskRadius) * 0.5);
      idx++;
    }

    return { positions: pos, sizes: sizeArray };
  }, [count, diskRadius, diskThickness, bulgeRadius]);

  useFrame(() => {
    pointsRef.current.rotation.y += 0.0338;
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
  const { removeStar } = useStarVault();
  const handleDelete = () => {
    if (sphereData?.id) {
      if (window.confirm("Are you sure you want to delete this memory?")) {
        removeStar(sphereData.id);
        onClose();
      }
    }
  };
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
          className="fixed flex justify-center z-[9999] items-center z-[9998] bg-slate-700/10 w-[100vw] h-[100vh] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] backdrop-blur-md"
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
                      className={` bg-background bg-opacity-30 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-amber`}
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
                </button>{" "}
                <button
                  onClick={() => handleDelete()}
                  className="absolute top-[20px] hover:text-amber right-[60px] bg-transparent border-none cursor-pointer padding-[8px] flex items-center justify-center text-slate-300 transition-all 300ms z-10"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-trash2-icon lucide-trash-2"
                  >
                    <path d="M10 11v6" />
                    <path d="M14 11v6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                    <path d="M3 6h18" />
                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>{" "}
              <div className="flex gap-[1.8rem] justify-center items-center">
                {Array.from({ length: 5 }).map((_, index) => {
                  const filledStars = sphereData?.stars;
                  const isFilled = index < filledStars;

                  return (
                    <svg
                      key={4}
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill={isFilled ? "#fbbf24" : "#e5e7eb"}
                      stroke={isFilled ? "#fbbf24" : "#e5e7eb"}
                      border="none"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-star-icon lucide-star"
                    >
                      <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
                    </svg>
                  );
                })}
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
function TravelPlanets() {
  const { galaxies } = useStarVault();
  const travelGalaxy = galaxies.find((galaxy) => galaxy.id === "travel");
  const travelPlanets = travelGalaxy?.stars || [];
  console.log("tRAVEL PLANETS", travelPlanets);
  console.log("tRAVEL Galaxy", travelGalaxy);
  return (
    <>
      <Header />

      <motion.div
        initial={{ opacity: 0, translateX: "-100%" }}
        animate={{ opacity: 1, translateX: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="h-[100vh] w-[100vw] relative bg-black"
      >
        <p className="text-travel text-[4.8rem] absolute top-10 left-10 tracking-[1.5rem]">
          TRAVEL PLANETS
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
          <ConnectionLines planetPositions={travelGalaxy.stars} />
          <Stars />
          <TravelGalaxy cameraPos={[0, 0, 0]} />
          {travelPlanets.map((star) => (
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
        <BackButton />{" "}
        {travelPlanets.length < 1 && (
          <p className="text-text opacity-60 text-[1.4rem] uppercase absolute transform left-1/2 transform translate-x-[-50%] bottom-10 tracking-[0.4rem] ">
            Want to add something? Click Add Memory Form
          </p>
        )}
      </motion.div>
    </>
  );
}
export default TravelPlanets;
