/* eslint-disable no-undef */
/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import { useRef, useMemo, useState } from "react";

import { Canvas } from "@react-three/fiber";

import { OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useNavigate } from "react-router";
import { useSpring } from "@react-spring/three";
import { animated } from "@react-spring/three";
import { motion } from "motion/react";
import Stars from "../Stars";
import GalaxyHoverUI from "./GalaxyHoverUI";
import SideBar from "./SideBar";
function TravelGalaxy({
  count = 15000,
  diskRadius = 10,
  diskThickness = 0.8,
  bulgeRadius = 3,
  color = "#497d00",
}) {
  const [hovered, isHovered] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0, z: 0 });

  const handlePointerMove = (e) => {
    setCursorPos({
      x: e.point.x.toFixed(2),
      y: e.point.y.toFixed(2) - 10,
      z: e.point.z.toFixed(2),
    });
  };
  const { scale } = useSpring({
    scale: hovered ? 1.4 : 1,
    config: { tension: 200, friction: 20 },
  });

  const pointsRef = useRef();
  const navigate = useNavigate();

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

  const handleClick = () => {
    navigate("/travel");
  };

  useFrame(() => {
    pointsRef.current.rotation.y += 0.0338;
  });

  return (
    <>
      {hovered ? (
        <GalaxyHoverUI galaxyNAME={"Travel"} cursorPos={cursorPos} />
      ) : null}
      <group position={[-30, 0, 40]}>
        {/* Invisible hitbox sphere - handles all interactions */}
        <mesh
          onClick={handleClick}
          onPointerEnter={() => {
            isHovered(true);
            document.body.style.cursor = "pointer";
          }}
          onPointerMove={handlePointerMove}
          onPointerLeave={() => {
            isHovered(false);
            document.body.style.cursor = "default";
          }}
        >
          <sphereGeometry args={[diskRadius * 1.2, 32, 32]} />
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
            size={0.025}
            color={color}
            sizeAttenuation={false}
            depthWrite={true}
            transparent
            opacity={hovered ? 0.9 : 0.2}
            blending={hovered ? 2 : 1}
            toneMapped={false}
          />
        </animated.points>
      </group>
    </>
  );
}

function EmotionGalaxy({
  count = 20000,
  radius = 10,
  blobCount = 10,
  color = "#ff66aa",
}) {
  const [hovered, isHovered] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0, z: 0 });

  const handlePointerMove = (e) => {
    setCursorPos({
      x: e.point.x.toFixed(2),
      y: e.point.y.toFixed(2) - 10,
      z: e.point.z.toFixed(2),
    });
  };
  const { scale } = useSpring({
    scale: hovered ? 1.4 : 1,
    config: { tension: 200, friction: 20 },
  });

  const pointsRef = useRef();
  const navigate = useNavigate();
  const { positions, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sizeArray = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Create multiple irregular "blobs" of star formation
      const blobIndex = Math.floor(Math.random() * blobCount);
      const blobAngle = (blobIndex / blobCount) * Math.PI * 2;

      // Offset each blob from center
      const blobDistance = radius * (0.3 + Math.random() * 0.7);
      const blobCenterX = Math.cos(blobAngle) * blobDistance;
      const blobCenterZ = Math.sin(blobAngle) * blobDistance;

      // Random position within blob using exponential distribution
      const r = Math.pow(Math.random(), 1.5) * radius * 0.6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const x = blobCenterX + r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta) * 0.4; // Flatter
      const z = blobCenterZ + r * Math.cos(phi);

      // Add chaotic scatter
      const scatter = 1.5;
      pos.set(
        [
          x + (Math.random() - 0.5) * scatter,
          y + (Math.random() - 0.5) * scatter * 0.5,
          z + (Math.random() - 0.5) * scatter,
        ],
        i * 3
      );

      // Varied star sizes
      sizeArray[i] = 0.015 + Math.random() * 0.04;
    }

    return { positions: pos, sizes: sizeArray };
  }, [count, radius, blobCount]);

  // Chaotic, multi-axis rotation
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    pointsRef.current.rotation.x = Math.sin(t * 0.1) * 0.2;
    pointsRef.current.rotation.y += 0.0304;
    pointsRef.current.rotation.z = Math.cos(t * 0.15) * 0.1;
  });

  const handleClick = () => {
    navigate("/emotion");
  };
  return (
    <>
      {hovered ? (
        <GalaxyHoverUI galaxyNAME={"Emotions"} cursorPos={cursorPos} />
      ) : null}{" "}
      <group position={[-30, 0, -20]}>
        {/* Invisible hitbox sphere - handles all interactions */}
        <mesh
          onClick={handleClick}
          onPointerEnter={() => {
            isHovered(true);
            document.body.style.cursor = "pointer";
          }}
          onPointerMove={handlePointerMove}
          onPointerLeave={() => {
            isHovered(false);
            document.body.style.cursor = "default";
          }}
        >
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
            opacity={hovered ? 0.85 : 0.2}
            blending={hovered ? 2 : 1}
            toneMapped={false}
          />
        </animated.points>
      </group>
    </>
  );
}

function RingGalaxy({
  count = 12000,
  innerRadius = 4,
  outerRadius = 12,
  ringThickness = 1.5,
  color = "#4488ff",
}) {
  const [hovered, isHovered] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0, z: 0 });

  const handlePointerMove = (e) => {
    setCursorPos({
      x: e.point.x.toFixed(2),
      y: e.point.y.toFixed(2) - 10,
      z: e.point.z.toFixed(2),
    });
  };
  const { scale } = useSpring({
    scale: hovered ? 1.4 : 1,
    config: { tension: 200, friction: 20 },
  });

  const pointsRef = useRef();
  const navigate = useNavigate();

  // Generate ring/hourglass galaxy distribution
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Create ring structure with gap in middle
      const ringPos = Math.random();
      const radius = innerRadius + ringPos * (outerRadius - innerRadius);

      // Random angle around the ring
      const theta = Math.random() * Math.PI * 2;

      // Height varies - creates the ring/torus shape
      const heightFactor = Math.pow(Math.random(), 2);
      const height = (Math.random() - 0.5) * ringThickness * heightFactor;

      // Position in ring
      const x = radius * Math.cos(theta);
      const z = radius * Math.sin(theta);
      const y = height;

      // Add turbulence that increases with radius
      const turbulence = 0.3 * (radius / outerRadius);
      pos.set(
        [
          x + (Math.random() - 0.5) * turbulence,
          y + (Math.random() - 0.5) * turbulence * 0.5,
          z + (Math.random() - 0.5) * turbulence,
        ],
        i * 3
      );
    }

    return pos;
  }, [count, innerRadius, outerRadius, ringThickness]);

  // Vary star sizes - brighter in the ring itself
  const sizes = useMemo(() => {
    const sizeArray = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const x = positions[i * 3];
      const y = positions[i * 3 + 1];
      const z = positions[i * 3 + 2];

      const radiusFromCenter = Math.sqrt(x * x + z * z);
      const heightFromPlane = Math.abs(y);

      // Stars in the ring plane are brighter
      const planeFactor = 1 - Math.min(heightFromPlane / ringThickness, 1);
      const ringFactor = radiusFromCenter > innerRadius ? 1 : 0.5;

      sizeArray[i] = 0.02 + planeFactor * 0.04 * ringFactor;
    }

    return sizeArray;
  }, [positions, innerRadius, ringThickness]);

  // Rotate the ring galaxy
  useFrame(() => {
    pointsRef.current.rotation.y += 0.0061;
    pointsRef.current.rotation.x = Math.sin(Date.now() * 0.0001) * 0.1;
  });
  const handleClick = () => {
    navigate("/personal");
  };
  return (
    <>
      {hovered ? (
        <GalaxyHoverUI galaxyNAME={"Personal"} cursorPos={cursorPos} />
      ) : null}
      <group position={[20, 0, -50]}>
        <mesh
          onClick={handleClick}
          onPointerEnter={() => {
            isHovered(true);
            document.body.style.cursor = "pointer";
          }}
          onPointerMove={handlePointerMove}
          onPointerLeave={() => {
            isHovered(false);
            document.body.style.cursor = "default";
          }}
        >
          <sphereGeometry args={[outerRadius * 1.2, 32, 32]} />
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
            opacity={hovered ? 0.85 : 0.2}
            blending={hovered ? 2 : 1}
            toneMapped={false}
          />
        </animated.points>
      </group>
    </>
  );
}
function MilestoneGalaxy({
  count = 8000,
  radiusX = 8,
  radiusY = 5,
  radiusZ = 8,
  color = "#ff8844",
}) {
  const [hovered, isHovered] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0, z: 0 });

  const handlePointerMove = (e) => {
    setCursorPos({
      x: e.point.x.toFixed(2),
      y: e.point.y.toFixed(2) - 10,
      z: e.point.z.toFixed(2),
    });
  };
  const { scale } = useSpring({
    scale: hovered ? 1.4 : 1,
    config: { tension: 200, friction: 20 },
  });

  const pointsRef = useRef();
  const navigate = useNavigate();

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
  const handleClick = () => {
    navigate("/milestones");
  };
  console.log(sizes);
  return (
    <>
      {hovered ? (
        <GalaxyHoverUI galaxyNAME={"Milestones"} cursorPos={cursorPos} />
      ) : null}
      <group position={[60, 0, 0]}>
        {/* Invisible hitbox sphere - handles all interactions */}
        <mesh
          onClick={handleClick}
          onPointerEnter={() => {
            isHovered(true);
            document.body.style.cursor = "pointer";
          }}
          onPointerMove={handlePointerMove}
          onPointerLeave={() => {
            isHovered(false);
            document.body.style.cursor = "default";
          }}
        >
          <sphereGeometry args={[radiusX * 1.2, 32, 32]} />
          <meshBasicMaterial visible={false} />
        </mesh>

        {/* Visual galaxy points - no interaction, just visuals */}
        <animated.points scale={scale} ref={pointsRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              array={positions}
              count={count}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.03}
            color={color}
            sizeAttenuation={false}
            depthWrite={true}
            transparent
            opacity={hovered ? 0.85 : 0.2}
            blending={hovered ? 2 : 1}
            toneMapped={false}
          />
        </animated.points>
      </group>
    </>
  );
}
function CareerGalaxy({
  count = 5000,
  radius = 10,
  arms = 3,
  color = "#8200db",
}) {
  const [hovered, isHovered] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0, z: 0 });

  const handlePointerMove = (e) => {
    setCursorPos({
      x: e.point.x.toFixed(2),
      y: e.point.y.toFixed(2) - 10,
      z: e.point.z.toFixed(2),
    });
  };
  const { scale } = useSpring({
    scale: hovered ? 1.4 : 1,
    config: { tension: 200, friction: 20 },
  });

  const pointsRef = useRef();
  const navigate = useNavigate();
  const coreRef = useRef();

  // Generate multi-arm spiral with density waves and bulge
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
  const handleClick = () => {
    navigate("/career");
  };
  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Differential rotation (inner parts rotate faster)
    pointsRef.current.rotation.y = time * 1.22;

    // Counter-rotating core
    if (coreRef.current) {
      coreRef.current.rotation.y = -time * 0.05;
    }
  });

  return (
    <>
      {hovered ? (
        <GalaxyHoverUI cursorPos={cursorPos} galaxyNAME={"Career"} />
      ) : null}
      <group position={[30, 0, 50]}>
        {/* Invisible hitbox sphere - handles all interactions */}
        <mesh
          onClick={handleClick}
          onPointerEnter={() => {
            isHovered(true);
            document.body.style.cursor = "pointer";
          }}
          onPointerMove={handlePointerMove}
          onPointerLeave={() => {
            isHovered(false);
            document.body.style.cursor = "default";
          }}
        >
          <sphereGeometry args={[radius * 1.2, 32, 32]} />
          <meshBasicMaterial visible={false} />
        </mesh>

        {/* Visual galaxy points - no interaction, just visuals */}
        <animated.points scale={scale} ref={pointsRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              array={positions}
              count={count}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.03}
            color={color}
            sizeAttenuation={false}
            depthWrite={true}
            transparent
            opacity={hovered ? 0.85 : 0.2}
            blending={hovered ? 2 : 1}
            toneMapped={false}
          />
        </animated.points>
      </group>
    </>
  );
}

// _Euler{isEuler: true, _x: -1.522432954819884, _y: -0.8904371932992801, _z: -1.5086121012837603, _order: 'XYZ'…}
// _Vector3{x: -30.908306195639387, y: 24.983470859504337, z: 1.2092278424420602}x: -30.908306195639387y: 24.983470859504337z: 1.2092278424420602[[Prototype]]: Object

// function CameraLogger() {
//   const { camera } = useThree();

//   useFrame(() => {
//     console.log("Camera position:", camera.position);
//     console.log("Camera rotation:", camera.rotation);
//   });

//   return null; // Don't return console.log, return null or JSX
// }
function Scence() {
  return (
    <motion.div
      initial={{ opacity: 0, translateX: "-100%" }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      key={"universe-page"}
      className="relative h-[100vh] w-[100vw] relative bg-black"
    >
      <p className="text-white text-[4.8rem] absolute top-10 left-10 tracking-[1.5rem]">
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
        <RingGalaxy />
        <EmotionGalaxy />
        <TravelGalaxy />
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={50}
          maxDistance={200}
          blending={1}
          touches={{
            ONE: 2,
            TWO: 1,
          }}
        />
      </Canvas>
    </motion.div>
  );
}

export default Scence;
