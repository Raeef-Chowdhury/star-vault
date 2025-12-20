/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import { useState } from "react";
import { useSpring } from "@react-spring/three";
import { motion } from "motion/react";
import { Html } from "@react-three/drei";
import Modal from "./SphereModal";

import { animated } from "@react-spring/three";
function Sphere({
  position,
  color,
  starData,
  isHovered,
  onHoverChange,
  isModalOpen,
  onModalChange,
}) {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0, z: 0 });

  const handlePointerMove = (e) => {
    setCursorPos({
      x: e.point.x.toFixed(2),
      y: e.point.y.toFixed(2) - 10,
      z: e.point.z.toFixed(2),
    });
  };

  const { scale } = useSpring({
    scale: isHovered ? 1.4 : 1,
    config: { tension: 300, friction: 10 },
  });

  return (
    <>
      {isModalOpen && (
        <Modal
          onClose={() => onModalChange(false)}
          sphereData={starData}
          starId={starData.id}
        />
      )}
      {isHovered && (
        <Html position={[cursorPos.x, cursorPos.y, cursorPos.z]}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className=" text-[1.8rem] text-tertiary gap-[0.4rem] items-center transition-opacity duration-300 pointer-events-none bg-slate-800 text- px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap shadow-xl before:content-[''] before:absolute before:bottom-full before:left-1/2 before:-translate-x-1/2 before:border-8 before:border-transparent before:border-b-slate-800 flex flex-col"
          >
            <span className="text-[2.4rem] text-primary ">
              {starData.title.slice(0, 10)}
            </span>
          </motion.div>
        </Html>
      )}
      <group
        onClick={() => onModalChange(true)}
        position={position}
        onPointerMove={handlePointerMove}
        onPointerEnter={() => {
          onHoverChange(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          onHoverChange(false);
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
export default Sphere;
