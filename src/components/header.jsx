/* eslint-disable react/no-unknown-property */
import { Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

function Header() {
  const [modal, setModal] = useState(false);
  return (
    <>
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="fixed top-0 left-0 w-screen h-screen flex items-center  justify-center z-50 bg-slate-900/90"
          >
            <div className=" relative w-full max-w-[1440px] rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-10 shadow-2xl border border-slate-700">
              <div className="space-y-8">
                <div className="rounded-lg mx-auto justify-self-center bg-slate-800/60 text-center backdrop-blur p-8 shadow-lg border border-slate-700/50">
                  <h3 className="text-[4.8rem] mb-[2.4rem] text-center justify-self-center font-semibold text-blue-300 mb-5 flex items-center gap-2">
                    <span className="text-[3.6rem]">✨</span> What is Star
                    Vault?
                  </h3>
                  <div className="space-y-4 text-[1.6rem] p-[1rem] max-w-[960px] justify-self-center text-slate-300 leading-relaxed">
                    <p>
                      Star Vault is a personal universe designed to visualize
                      your thoughts as stars scattered across a calm, open
                      space. Instead of viewing memories, ideas, or notes as
                      plain lists, Star Vault turns them into a constellation
                      you can freely explore. This helps you think in a more
                      visual, intuitive way, making your inner world feel
                      organized rather than overwhelming.
                    </p>
                    <p>
                      Each star represents a piece of information youve added —
                      a memory, a reminder, a goal, a feeling, or anything you
                      want to store. Their positions arent random: theyre
                      arranged so that related ideas naturally drift closer
                      together, creating subtle constellations that reflect how
                      your mind groups things. Faint lines between stars show
                      soft relationships, helping you quickly see connections
                      you may not have noticed before.
                    </p>
                    <p>
                      You can hover over a star to preview its title, click to
                      open its full details, or drag across the space to journey
                      through your vault. The movement is intentionally smooth
                      and gentle to make the experience feel more like exploring
                      a quiet night sky than navigating a menu. The goal is to
                      create a sense of clarity and calm — a place where your
                      thoughts can be externalized without stress.
                    </p>
                  </div>
                </div>

                <div className="rounded-lg mx-auto justify-self-center px-[4rem]  bg-indigo-950/40 backdrop-blur p-6 border border-indigo-800/30 shadow-lg">
                  <div className="flex justify-center items-center gap-4">
                    <span className="text-4xl flex-shrink-0 leading-none">
                      💡
                    </span>
                    <p className="text-base text-indigo-200 font-medium text-[1.65rem]">
                      <strong className="text-indigo-100 text-[2.4rem]">
                        Quick Tip:
                      </strong>{" "}
                      If the space feels empty, start your journey by adding
                      your first memory star using the button above.
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
            <button className="hover:cursor-pointer px-[3.2rem] flex items-center justify-between gap-[2.4rem] rounded-full bg-gray-900 hover:bg-gray-800 text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 text-[2rem] border-2 border-gray-700">
              <span className="text-[3.6rem] text-blue-500 transform translate-y-[-0.5rem]">
                +
              </span>
              <span>ADD MEMORY</span>
            </button>

            <button
              onClick={() => setModal(true)}
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
