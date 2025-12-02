import { Sparkles } from "lucide-react";

function Header() {
  return (
    <>
      <header className="p-[2rem] bg-header flex items-center min-w-[1920px]">
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

            <button className="group relative hover:cursor-pointer px-[3.2rem] py-[1.2rem] flex items-center justify-between gap-[2.4rem] rounded-full bg-white text-slate-800 font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 text-[2rem] border-2 border-amber-400">
              <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                xmlns="http://www.w3.org/2000/svg"
                className="text-amber-500"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M15.5 8.5c2 1 4 3 3 6-1 3-4 4-6 5-2 1-5 1.2-7-1-2-2.2-1.5-5.5 0-7.5" />
                <path d="M5 6l0.8 0.8M20 7.2l0.6 0.6M7.5 18.5l0.7 0.7" />
              </svg>
              ADD GALAXY
              <span className="text-[1.2rem] absolute left-1/2 -translate-x-1/2 top-full mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap shadow-xl before:content-[''] before:absolute before:bottom-full before:left-1/2 before:-translate-x-1/2 before:border-8 before:border-transparent before:border-b-slate-800">
                Create a New Category
              </span>
            </button>
          </li>
        </ul>
      </header>
    </>
  );
}
export default Header;
