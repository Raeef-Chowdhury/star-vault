function seededRandom(seed) {
  let x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}
function distance3D(pos1, pos2) {
  return Math.sqrt(
    Math.pow(pos1[0] - pos2[0], 2) +
      Math.pow(pos1[1] - pos2[1], 2) +
      Math.pow(pos1[2] - pos2[2], 2)
  );
}

// Check if position is valid (maintains minimum gap from all existing positions)
function isValidPosition(newPos, existingPositions, minGap) {
  return existingPositions.every((pos) => distance3D(newPos, pos) >= minGap);
}

function randomPosition(
  seed,
  center = [0, 0, 0],
  minRadius = 16,
  maxRadius = 120,
  existingPositions = [],
  minGap = 2.5 // Minimum distance between stars
) {
  let x, y, z, distFromOrigin;
  let attempts = 0;
  const maxAttempts = 500; // Increase max attempts for better placement

  do {
    const r =
      minRadius + seededRandom(seed + attempts) * (maxRadius - minRadius);
    const theta = seededRandom(seed + attempts + 1) * Math.PI * 2;

    // Flat circular distribution on XZ plane (no Y change)
    x = center[0] + r * Math.cos(theta);
    y = center[1]; // Keep Y constant at center's Y
    z = center[2] + r * Math.sin(theta);

    const newPos = [x, y, z];
    distFromOrigin = Math.sqrt(x ** 2 + y ** 2 + z ** 2);

    // Check if position is valid (far enough from origin and other stars)
    if (
      distFromOrigin >= 4 &&
      isValidPosition(newPos, existingPositions, minGap)
    ) {
      return newPos;
    }

    attempts++;
  } while (attempts < maxAttempts);

  // If we couldn't find a valid position, return the last attempt
  console.warn(`Could not find valid position after ${maxAttempts} attempts`);
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
    stars: (() => {
      const stars = [];
      const positions = [];
      for (let i = 0; i < 5; i++) {
        const pos = randomPosition(
          1000 + i * 50,
          [0, 0, 0],
          10,
          25,
          positions,
          2.5
        );
        positions.push(pos);
        stars.push({
          galaxy: "personal",
          id: `personal_mem_${i + 1}`,
          title: `Personal Memory ${i + 1}`,
          description: `This is sample Personal memory #${i + 1}.`,
          date: `2025-12-${i + 1 < 10 ? "0" : ""}${i + 1}`,
          position: pos,
          color: randomStarColor(1000 + i),
          stars: i + 1,
        });
      }
      return stars;
    })(),
  },
  {
    id: "career",
    name: "Career",
    color: "#22c55e",
    position: [-10, 0, 1],
    stars: (() => {
      const stars = [];
      const positions = [];
      for (let i = 0; i < 5; i++) {
        const pos = randomPosition(
          2000 + i * 50,
          [0, 0, 0],
          10,
          25,
          positions,
          2.5
        );
        positions.push(pos);
        stars.push({
          galaxy: "career",
          id: `career_mem_${i + 1}`,
          title: `Career Memory ${i + 1}`,
          description: `This is sample Career memory #${i + 1}.`,
          date: `2025-11-${i + 10}`,
          position: pos,
          color: randomStarColor(2000 + i),
          stars: i + 1,
        });
      }
      return stars;
    })(),
  },
  {
    id: "milestone",
    name: "Milestone",
    color: "#3b82f6",
    position: [-5, 0, 4],
    stars: (() => {
      const stars = [];
      const positions = [];
      for (let i = 0; i < 5; i++) {
        const pos = randomPosition(
          3000 + i * 50,
          [0, 0, 0],
          10,
          25,
          positions,
          2.5
        );
        positions.push(pos);
        stars.push({
          galaxy: "milestone",
          id: `milestone_mem_${i + 1}`,
          title: `Milestone Memory ${i + 1}`,
          description: `This is sample Milestone memory #${i + 1}.`,
          date: `2025-10-${i + 15}`,
          position: pos,
          color: randomStarColor(3000 + i),
          stars: i + 1,
        });
      }
      return stars;
    })(),
  },
  {
    id: "emotion",
    name: "Emotion",
    color: "#eab308",
    position: [5, 0, 6],
    stars: (() => {
      const stars = [];
      const positions = [];
      for (let i = 0; i < 5; i++) {
        const pos = randomPosition(
          4000 + i * 50,
          [0, 0, 0],
          10,
          25,
          positions,
          2.5
        );
        positions.push(pos);
        stars.push({
          galaxy: "emotion",
          id: `emotion_mem_${i + 1}`,
          title: `Emotion Memory ${i + 1}`,
          description: `This is sample Emotion memory #${i + 1}.`,
          date: `2025-09-${i + 20}`,
          position: pos,
          color: randomStarColor(4000 + i),
          stars: i + 1,
        });
      }
      return stars;
    })(),
  },
  {
    id: "travel",
    name: "Travel",
    color: "#a855f7",
    position: [10.5, 0, 7],
    stars: (() => {
      const stars = [];
      const positions = [];
      for (let i = 0; i < 5; i++) {
        const pos = randomPosition(
          5000 + i * 50,
          [0, 0, 0],
          20,
          50,
          positions,
          2.5
        );
        positions.push(pos);
        stars.push({
          galaxy: "travel",
          id: `travel_mem_${i + 1}`,
          title: `Travel Memory ${i + 1}`,
          description: `This is sample Travel memory #${i + 1}.`,
          date: `2025-08-${i + 25}`,
          position: pos,
          color: randomStarColor(5000 + i),
          stars: i + 1,
        });
      }
      return stars;
    })(),
  },
];
