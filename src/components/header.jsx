/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from "react";
import { Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

// Utility functions
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

function isValidPosition(newPos, existingPositions, minGap) {
  return existingPositions.every((pos) => distance3D(newPos, pos) >= minGap);
}

function randomPosition(
  seed,
  center = [0, 0, 0],
  minRadius = 16,
  maxRadius = 120,
  existingPositions = [],
  minGap = 2.5
) {
  let x, y, z, distFromOrigin;
  let attempts = 0;
  const maxAttempts = 500;

  do {
    const r =
      minRadius + seededRandom(seed + attempts) * (maxRadius - minRadius);
    const theta = seededRandom(seed + attempts + 1) * Math.PI * 2;

    x = center[0] + r * Math.cos(theta);
    y = center[1];
    z = center[2] + r * Math.sin(theta);

    const newPos = [x, y, z];
    distFromOrigin = Math.sqrt(x ** 2 + y ** 2 + z ** 2);

    if (
      distFromOrigin >= 4 &&
      isValidPosition(newPos, existingPositions, minGap)
    ) {
      return newPos;
    }

    attempts++;
  } while (attempts < maxAttempts);

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

// Initial galaxies configuration
const initialGalaxies = [
  {
    id: "personal",
    name: "Personal",
    color: "#ef4444",
    position: [-15, 0, 2],
    stars: [],
  },
  {
    id: "career",
    name: "Career",
    color: "#22c55e",
    position: [-10, 0, 1],
    stars: [],
  },
  {
    id: "milestone",
    name: "Milestone",
    color: "#3b82f6",
    position: [-5, 0, 4],
    stars: [],
  },
  {
    id: "emotion",
    name: "Emotion",
    color: "#eab308",
    position: [5, 0, 6],
    stars: [],
  },
  {
    id: "travel",
    name: "Travel",
    color: "#a855f7",
    position: [10.5, 0, 7],
    stars: [],
  },
];

// ============================================
// REACT CONTEXT FOR GLOBAL STATE
// ============================================
const StarVaultContext = createContext();

// Hook to use the context
export const useStarVault = () => {
  const context = useContext(StarVaultContext);
  if (!context) {
    throw new Error("useStarVault must be used within StarVaultProvider");
  }
  return context;
};

// Provider Component - wrap your app with this
export const StarVaultProvider = ({ children }) => {
  const [galaxies, setGalaxies] = useState(initialGalaxies);

  const addStar = (starData) => {
    const { title, description, date, galaxy, importance } = starData;

    setGalaxies((prevGalaxies) => {
      return prevGalaxies.map((g) => {
        if (g.id === galaxy) {
          const existingPositions = g.stars.map((s) => s.position);
          const seed = Date.now() + g.stars.length * 1000;
          const minRadius = galaxy === "travel" ? 20 : 10;
          const maxRadius = galaxy === "travel" ? 50 : 25;
          const position = randomPosition(
            seed,
            [0, 0, 0],
            minRadius,
            maxRadius,
            existingPositions,
            2.5
          );

          const newStar = {
            galaxy: galaxy,
            id: `${galaxy}_mem_${Date.now()}`,
            title,
            description,
            date,
            position,
            color: randomStarColor(seed),
            stars: importance,
          };

          return {
            ...g,
            stars: [...g.stars, newStar],
          };
        }
        return g;
      });
    });
  };

  const removeStar = (starId) => {
    setGalaxies((prevGalaxies) => {
      return prevGalaxies.map((g) => ({
        ...g,
        stars: g.stars.filter((s) => s.id !== starId),
      }));
    });
  };

  const getAllStars = () => {
    return galaxies.flatMap((g) => g.stars);
  };

  return (
    <StarVaultContext.Provider
      value={{ galaxies, addStar, removeStar, getAllStars }}
    >
      {children}
    </StarVaultContext.Provider>
  );
};

function InfoModalContent({ setModal }) {
  return (
    <div className="relative w-full max-w-[1440px] rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-10 shadow-2xl border border-slate-700">
      <div className="space-y-8">
        <div className="rounded-lg mx-auto justify-self-center bg-slate-800/60 text-center backdrop-blur p-8 shadow-lg border border-slate-700/50">
          <h3 className="text-[4.8rem] mb-[2.4rem] text-center justify-self-center font-semibold text-blue-300 flex items-center justify-center gap-2">
            <span className="text-[3.6rem]">✨</span> What is Star Vault?
          </h3>
          <div className="space-y-4 text-[1.6rem] p-[1rem] max-w-[644px] justify-self-center text-slate-300 leading-relaxed mx-auto">
            <p>
              Star Vault is your own unique journal of ideas and memories
              represented through planets and galaxies. These memories are
              represented by planets while each of the 5 distinct galaxies
              represent a core category on their own. You can always add or
              remove memories as you please.
            </p>
            <p>
              Each star represents a piece of information youve added — a
              memory, a reminder, a goal, a feeling, or anything you want to
              store. Their positions arent random: theyre arranged so that
              related ideas naturally drift closer together, creating subtle
              constellations that reflect how your mind groups things.
            </p>
            <p>
              You can hover over a star to preview its title, click to open its
              full details, or drag across the space to journey through your
              vault. The movement is intentionally smooth and gentle to make the
              experience feel more like exploring a quiet night sky than
              navigating a menu.
            </p>
          </div>
        </div>

        <div className="rounded-lg mx-auto justify-self-center px-[4rem] bg-indigo-950/40 backdrop-blur p-6 border border-indigo-800/30 shadow-lg">
          <div className="flex justify-center items-center gap-4">
            <span className="text-4xl flex-shrink-0 leading-none">💡</span>
            <p className="text-base text-indigo-200 font-medium text-[1.65rem]">
              <strong className="text-indigo-100 text-[2.4rem]">
                Quick Tip:
              </strong>{" "}
              If the space feels empty, start your journey by adding your first
              memory star using the button above.
            </p>
          </div>
        </div>
        <div className="absolute top-5 right-5">
          <button
            onClick={() => setModal(false)}
            className="hover:text-red-600 transition-all hover:cursor-pointer"
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
              class="lucide lucide-x-icon lucide-x"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function AddModalContent({ setModal }) {
  const { addStar } = useStarVault();
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    galaxy: "",
    description: "",
    importance: 3,
  });

  const handleSubmit = () => {
    if (!formData.title || !formData.galaxy || !formData.date) {
      alert("Please fill in all required fields (Title, Date, Galaxy)");
      return;
    }

    addStar(formData);
    setModal(false);

    setFormData({
      title: "",
      date: "",
      galaxy: "",
      description: "",
      importance: 3,
    });
  };

  return (
    <div className="relative w-full max-w-[944px] overflow-y-scroll max-h-[80vh] rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-10 shadow-2xl border border-slate-700">
      <div className="space-y-8">
        <div className="rounded-lg mx-auto justify-self-center text-center backdrop-blur p-8">
          <h3 className="text-[4.8rem] flex items-center justify-center gap-[2.4rem] mb-[2.4rem] font-semibold shadow-lg border border-slate-700/50 p-[1rem] rounded-md px-[4.8rem] text-blue-300">
            <span className="text-[4.8rem] text-amber">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
            </span>
            ADD A MEMORY:
          </h3>
          <div className="space-y-16 max-w-[832px] mx-auto">
            <div className="space-y-6 text-[1.6rem] p-8 rounded-2xl bg-slate-800/30 backdrop-blur-sm">
              <p className="text-[4.8rem] text-white tracking-[0.2rem] w-fit mx-auto mb-4 font-light">
                TITLE
              </p>
              <input
                type="text"
                placeholder="Name This Memory..."
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="border-primary focus:outline-none text-[2.4rem] focus:outline-slate-900 focus:outline-solid focus:outline-2 transition-all bg-slate-700/50 rounded-xl px-[1.2rem] mx-auto w-full max-w-[520px] py-[0.8rem] text-slate-300"
              />
            </div>

            <div className="flex gap-6 flex-wrap justify-center">
              <div className="space-y-6 text-[1.6rem] p-8 rounded-2xl bg-slate-800/30 backdrop-blur-sm flex-1 min-w-[280px] max-w-[400px]">
                <p className="text-[4.8rem] text-white tracking-[0.2rem] w-fit mx-auto mb-4 font-light">
                  DATE
                </p>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="border-primary focus:outline-none text-[2.4rem] focus:outline-slate-900 focus:outline-solid focus:outline-2 transition-all bg-slate-700/50 rounded-xl px-[1.2rem] mx-auto w-full py-[0.8rem] text-slate-300"
                />
              </div>

              <div className="space-y-6 text-[1.6rem] p-8 rounded-2xl bg-slate-800/30 backdrop-blur-sm flex-1 min-w-[280px] max-w-[400px]">
                <p className="text-[4.8rem] text-white tracking-[0.2rem] w-fit mx-auto mb-4 font-light">
                  GALAXY
                </p>
                <select
                  value={formData.galaxy}
                  onChange={(e) =>
                    setFormData({ ...formData, galaxy: e.target.value })
                  }
                  className="border-primary focus:outline-none text-[2.4rem] focus:outline-slate-900 focus:outline-solid focus:outline-2 transition-all bg-slate-700/50 rounded-xl px-[1.2rem] mx-auto w-full py-[0.8rem] text-slate-300 cursor-pointer appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgb(203 213 225)'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 1rem center",
                    backgroundSize: "1.5em 1.5em",
                    paddingRight: "3rem",
                  }}
                >
                  <option value="" disabled>
                    Choose a galaxy (category)...
                  </option>
                  <option value="emotion">EMOTIONS</option>
                  <option value="personal">PERSONAL</option>
                  <option value="career">CAREER</option>
                  <option value="travel">TRAVEL</option>
                  <option value="milestone">MILESTONES</option>
                </select>
              </div>
            </div>

            <div className="space-y-6 text-[1.6rem] p-8 rounded-2xl bg-slate-800/30 backdrop-blur-sm">
              <p className="text-[4.8rem] text-white tracking-[0.2rem] w-fit mx-auto mb-4 font-light">
                DESCRIPTION
              </p>
              <textarea
                placeholder="Describe this memory..."
                rows="3"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="border-primary focus:outline-none text-[2.4rem] focus:outline-slate-900 focus:outline-solid focus:outline-2 transition-all bg-slate-700/50 rounded-xl px-[1.2rem] mx-auto w-full max-w-[720px] py-[0.8rem] text-slate-300 resize-vertical"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6 text-[1.6rem] p-8 rounded-2xl bg-slate-800/30 backdrop-blur-sm">
          <div className="flex justify-between">
            <p className="text-[4.8rem] text-white tracking-[0.2rem] w-fit mx-auto mb-4 font-light">
              IMPORTANCE
            </p>
            <p className="text-[2rem] text-slate-300">
              {formData.importance}/5
            </p>
          </div>
          <div className="max-w-[720px] mx-auto space-y-4">
            <input
              type="range"
              min="1"
              max="5"
              value={formData.importance}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  importance: parseInt(e.target.value),
                })
              }
              className="w-full h-3 rounded-lg appearance-none cursor-pointer bg-slate-700/50"
              style={{
                background:
                  "linear-gradient(to right, #475569 0%, #64748b 100%)",
              }}
            />
          </div>
        </div>

        <div className="pt-8 pb-4 mt-[4.8rem]">
          <button
            onClick={handleSubmit}
            className="mx-auto block bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-[2.8rem] font-semibold px-[4.8rem] py-[1.2rem] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            CREATE MEMORY
          </button>
        </div>
      </div>

      <div className="absolute top-5 right-5">
        <button
          onClick={() => setModal(false)}
          className="hover:text-red-600 transition-all hover:cursor-pointer"
        >
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
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export function Header() {
  const [infoModal, setInfoModal] = useState(false);
  const [addModal, setAddModal] = useState(false);

  return (
    <>
      <AnimatePresence>
        {infoModal && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setInfoModal(false);
              }
            }}
            className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center z-50 bg-slate-950/90"
          >
            <InfoModalContent setModal={setInfoModal} />
          </motion.div>
        )}
        {addModal && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setAddModal(false);
              }
            }}
            className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center z-50 bg-slate-950/90"
          >
            <AddModalContent setModal={setAddModal} />
          </motion.div>
        )}
      </AnimatePresence>
      <header className="p-[2rem] bg-slate-900 flex items-center max-w-[1920px]">
        <ul className="pb-[1.5rem] flex items-center justify-between w-full">
          <li className="flex items-center gap-[1.8rem] text-white text-[4.8rem] tracking-[1.2rem]">
            <Sparkles className="p-6 rounded-full w-20 h-20 text-white bg-gradient-to-br from-[#6b9fff] to-[#a78bfa]" />
            <p>STAR VAULT</p>
          </li>

          <li className="relative flex items-center gap-[6rem]">
            <button
              onClick={() => setAddModal(true)}
              className="hover:cursor-pointer px-[3.2rem] flex items-center justify-between gap-[2.4rem] rounded-full bg-gray-900 hover:bg-gray-800 text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 text-[2rem] border-2 border-gray-700"
            >
              <span className="text-[3.6rem] text-blue-500 transform translate-y-[-0.5rem]">
                +
              </span>
              <span>ADD MEMORY</span>
            </button>

            <button
              onClick={() => setInfoModal(true)}
              className="group relative hover:cursor-pointer px-[3.2rem] py-[1.2rem] flex items-center justify-between gap-[2.4rem] rounded-full bg-white text-slate-800 font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 text-[2rem] border-2 border-amber-400"
            >
              WHAT IS THIS?
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="purple"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
              <span className="text-[1.2rem] absolute left-1/2 -translate-x-1/2 top-full mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap shadow-xl before:content-[''] before:absolute before:bottom-full before:left-1/2 before:-translate-x-1/2 before:border-8 before:border-transparent before:border-b-slate-800">
                Learn more about this Website
              </span>
            </button>
          </li>
        </ul>
      </header>
    </>
  );
}

export default Header;
