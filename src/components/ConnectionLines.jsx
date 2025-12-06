/* eslint-disable no-undef */
/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import React, { useRef } from "react";
const spheresData = [
  { position: [-15, 0, 2], color: "#ef4444" },
  { position: [-10, 0, 1], color: "#22c55e" },
  { position: [-5, 0, 4], color: "#3b82f6" },
  { position: [5, 0, 6], color: "#eab308" },
  { position: [10.5, 0, 7], color: "#a855f7" },
  { position: [15, 0, 20], color: "#06b6d4" },
];
function ConnectionLines() {
  const linesRef = useRef();

  const linePositions = React.useMemo(() => {
    const positions = [];

    // Create a chain: connect each sphere to the next one only
    for (let i = 0; i < spheresData.length - 1; i++) {
      positions.push(...spheresData[i].position);
      positions.push(...spheresData[i + 1].position);
    }

    return new Float32Array(positions);
  }, []);

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={linePositions.length / 3}
          array={linePositions}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color="#ffffff"
        transparent
        opacity={0.15}
        depthWrite={false}
      />
    </lineSegments>
  );
}
export default ConnectionLines;
