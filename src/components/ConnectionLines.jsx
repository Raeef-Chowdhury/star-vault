/* eslint-disable no-undef */
/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import React, { useRef } from "react";

function ConnectionLines({ planetPositions }) {
  const linesRef = useRef();

  const linePositions = React.useMemo(() => {
    const positions = [];

    // Create a chain: connect each star to the next one
    for (let i = 0; i < planetPositions.length - 1; i++) {
      positions.push(...planetPositions[i].position);
      positions.push(...planetPositions[i + 1].position);
    }

    return new Float32Array(positions);
  }, [planetPositions]);

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
      <lineBasicMaterial color="#ffffff" opacity={0.2} transparent />
    </lineSegments>
  );
}

export default ConnectionLines;
