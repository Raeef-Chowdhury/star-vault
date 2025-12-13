/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import { Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
function InfoModalContent({ setModal }) {
  return (
    <div className=" relative w-full max-w-[1440px] rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-10 shadow-2xl border border-slate-700">
      <div className="space-y-8">
        <div className="rounded-lg mx-auto justify-self-center bg-slate-800/60 text-center backdrop-blur p-8 shadow-lg border border-slate-700/50">
          <h3 className="text-[4.8rem] mb-[2.4rem] text-center justify-self-center font-semibold text-blue-300 mb-5 flex items-center gap-2">
            <span className="text-[3.6rem]">✨</span> What is Star Vault?
          </h3>
          <div className="space-y-4 text-[1.6rem] p-[1rem] max-w-[644px] justify-self-center text-slate-300 leading-relaxed">
            <p>
              Star Vault is your own unique journal of ideas and memories
              represented through planets and galaxies. These memroies are
              represented by planets while each of the 5 dsitinct galaxies
              represent a core category on their own. You can always add or
              remove memories as you please.
            </p>
            <p>
              Each star represents a piece of information youve added — a
              memory, a reminder, a goal, a feeling, or anything you want to
              store. Their positions arent random: theyre arranged so that
              related ideas naturally drift closer together, creating subtle
              constellations that reflect how your mind groups things. Faint
              lines between stars show soft relationships, helping you quickly
              see connections you may not have noticed before.
            </p>
            <p>
              You can hover over a star to preview its title, click to open its
              full details, or drag across the space to journey through your
              vault. The movement is intentionally smooth and gentle to make the
              experience feel more like exploring a quiet night sky than
              navigating a menu. The goal is to create a sense of clarity and
              calm — a place where your thoughts can be externalized without
              stress.
            </p>
          </div>
        </div>

        <div className="rounded-lg mx-auto justify-self-center px-[4rem]  bg-indigo-950/40 backdrop-blur p-6 border border-indigo-800/30 shadow-lg">
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
  return (
    <div className=" relative w-full max-w-[944px] overflow-y-scroll max-h-[80vh] rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-10 shadow-2xl border border-slate-700">
      <div className="space-y-8">
        <div className="rounded-lg mx-auto justify-self-center  text-center backdrop-blur p-8 ">
          <h3 className="text-[4.8rem] flex items-center gap-[2.4rem] mb-[2.4rem] text-center justify-self-center font-semibold shadow-lg border border-slate-700/50 p-[1rem] rounded-md px-[4.8rem] text-blue-300 mb-5 flex items-center gap-2">
            <span className="text-[4.8rem] text-amber">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-plus-icon lucide-plus"
              >
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
            </span>{" "}
            ADD A MEMORY:
          </h3>
          <div className="space-y-16 max-w-[832px] mx-auto">
            <div className="space-y-6 text-[1.6rem] p-8 rounded-2xl bg-slate-800/30 backdrop-blur-sm">
              <p className="text-[4.8rem] text-text tracking-[0.2rem] w-fit mx-auto mb-4 font-light">
                TITLE
              </p>
              <input
                type="text"
                placeholder="Name This Memory..."
                className="border-primary focus:outline-none text-[2.4rem] focus:outline-slate-900 focus:outline-solid focus:outline-2 transition-all bg-slate-700/50 rounded-xl px-[1.2rem] mx-auto w-full max-w-[520px] py-[0.8rem] text-slate-300"
              />
            </div>

            <div className="flex gap-6 flex-wrap justify-center">
              <div className="space-y-6 text-[1.6rem] p-8 rounded-2xl bg-slate-800/30 backdrop-blur-sm flex-1 min-w-[280px] max-w-[400px]">
                <p className="text-[4.8rem] text-text tracking-[0.2rem] w-fit mx-auto mb-4 font-light">
                  DATE
                </p>
                <input
                  type="date"
                  placeholder="Name This Memory..."
                  className="border-primary focus:outline-none text-[2.4rem] focus:outline-slate-900 focus:outline-solid focus:outline-2 transition-all bg-slate-700/50 rounded-xl px-[1.2rem] mx-auto w-full py-[0.8rem] text-slate-300"
                />
              </div>

              <div className="space-y-6 text-[1.6rem] p-8 rounded-2xl bg-slate-800/30 backdrop-blur-sm flex-1 min-w-[280px] max-w-[400px]">
                <p className="text-[4.8rem] text-text tracking-[0.2rem] w-fit mx-auto mb-4 font-light">
                  GALAXY
                </p>
                <select
                  name="Galaxy"
                  placeholder="Choose a Galaxy..."
                  className="border-primary focus:outline-none text-[2.4rem] focus:outline-slate-900 focus:outline-solid focus:outline-2 transition-all bg-slate-700/50 rounded-xl px-[1.2rem] mx-auto w-full py-[0.8rem] text-slate-300 cursor-pointer appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgb(203 213 225)'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 1rem center",
                    backgroundSize: "1.5em 1.5em",
                    paddingRight: "3rem",
                  }}
                >
                  {" "}
                  <option
                    value=""
                    disabled
                    className="bg-slate-800 text-slate-400"
                  >
                    Choose a galaxy (category)...
                  </option>
                  <option
                    value="milky-way"
                    className="bg-slate-800 text-slate-300"
                  >
                    EMOTIONS
                  </option>
                  <option
                    value="milky-way"
                    className="bg-slate-800 text-slate-300"
                  >
                    PERSONAL
                  </option>
                  <option
                    value="milky-way"
                    className="bg-slate-800 text-slate-300"
                  >
                    CAREER
                  </option>
                  <option
                    value="andromeda"
                    className="bg-slate-800 text-slate-300"
                  >
                    TRAVEL
                  </option>
                  <option
                    value="triangulum"
                    className="bg-slate-800 text-slate-300"
                  >
                    MILESTONES
                  </option>
                </select>
              </div>
            </div>
            <div className="space-y-6 text-[1.6rem] p-8 rounded-2xl bg-slate-800/30 backdrop-blur-sm">
              <p className="text-[4.8rem] text-text tracking-[0.2rem] w-fit mx-auto mb-4 font-light">
                DESCRIPTION
              </p>
              <textarea
                placeholder="Name This Memory..."
                rows="3"
                className="border-primary focus:outline-none text-[2.4rem] focus:outline-slate-900 focus:outline-solid focus:outline-2 transition-all bg-slate-700/50 rounded-xl px-[1.2rem] mx-auto w-full max-w-[720px] py-[0.8rem] text-slate-300 resize-vertical"
              />
            </div>
          </div>
        </div>
        <div className="space-y-6 text-[1.6rem] p-8 rounded-2xl bg-slate-800/30 backdrop-blur-sm">
          <div className="flex justify-between ">
            <p className="text-[4.8rem] text-text tracking-[0.2rem] w-fit mx-auto mb-4 font-light">
              IMPORTANCE
            </p>
            <p>Intensity/5</p>
          </div>
          <div className="max-w-[720px] mx-auto space-y-4">
            <input
              type="range"
              min="1"
              max="5"
              defaultValue="3"
              className="w-full h-3 rounded-lg appearance-none cursor-pointer bg-slate-700/50"
              style={{
                background:
                  "linear-gradient(to right, #475569 0%, #64748b 100%)",
              }}
            />
            <div className="flex justify-between text-[1.8rem] text-slate-400 px-2"></div>
          </div>
        </div>
        <div className="pt-8 pb-4 mt-[4.8rem]">
          <button
            type="submit"
            className="mx-auto block bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-[2.8rem] font-semibold px-[4.8rem] py-[1.2rem] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            CREATE MEMORY
          </button>
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
function Header() {
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
            className="fixed top-0 left-0 w-screen h-screen flex items-center  justify-center z-50 bg-slate-950/90"
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
            className="fixed top-0 left-0 w-screen h-screen flex items-center  justify-center z-50 bg-slate-950/90"
          >
            <AddModalContent setModal={setAddModal} />
          </motion.div>
        )}
      </AnimatePresence>
      <header className="p-[2rem] bg-header flex items-center max-w-[1920px]">
        <ul className="pb-[1.5rem] flex items-center justify-between w-full">
          <li className="flex items-center gap-[1.8rem] text-text text-[4.8rem] tracking-[1.2rem]">
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
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-info-icon lucide-info text-primary"
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
