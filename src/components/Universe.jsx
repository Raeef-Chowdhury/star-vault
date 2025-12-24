/* eslint-disable no-undef */
/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { motion } from "motion/react";
import * as THREE from "three";
import Stars from "../Stars";
import { useState, useEffect } from "react";
import SideBar from "./SideBar";
import CareerGalaxy from "./CareerGalaxy";
import EmotionGalaxy from "./EmotionGalaxy";
import MilestoneGalaxy from "./MilestonesGalaxy";
import PersonalGalaxy from "./PersonalGalaxy";
import TravelGalaxy from "./TravelGalaxy";

function Scence() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0, translateX: "-100%" }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      key={"universe-page"}
      className="relative h-[120vh] min-[1920px]:h-[100vh] w-[100vw] relative bg-black overflow-hidden"
    >
      <p className="text-primary max-md:text-[6rem] max-md:static absolute top-10 left-10  mt-[1.6rem] text-[4.8rem] tracking-[1.5rem]">
        UNIVERSE
      </p>
      <SideBar />
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
        <Stars />

        <CareerGalaxy />
        <MilestoneGalaxy />
        <PersonalGalaxy />
        <EmotionGalaxy cameraPos={[-30, 0, -20]} />
        <TravelGalaxy />
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={isMobile ? 120 : 50}
          maxDistance={200}
          mouseButtons={{
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: null,
          }}
          touches={{
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_ROTATE,
          }}
          panSpeed={0.5}
          zoomSpeed={0.5}
        />
      </Canvas>
    </motion.div>
  );
}

export default Scence;
