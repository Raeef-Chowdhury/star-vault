/* eslint-disable react/prop-types */
import { motion } from "motion/react";
import { Html } from "@react-three/drei";
function GalaxyHoverUI({ galaxyNAME, cursorPos }) {
  return (
    <Html position={[cursorPos.x, cursorPos.y, cursorPos.z]}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className=" text-[1.8rem] text-tertiary gap-[0.4rem] items-center transition-opacity duration-300 pointer-events-none bg-slate-800 text- px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap shadow-xl before:content-[''] before:absolute before:bottom-full before:left-1/2 before:-translate-x-1/2 before:border-8 before:border-transparent before:border-b-slate-800 flex flex-col"
      >
        <span className="border-b-2 border-b-secondary w-[fit-content] text-center">
          Galaxy:
        </span>
        <span className="text-[2.4rem] text-primary ">{galaxyNAME}</span>
      </motion.div>
    </Html>
  );
}
export default GalaxyHoverUI;
