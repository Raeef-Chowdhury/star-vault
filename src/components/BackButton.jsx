/* eslint-disable react/no-unknown-property */
import { Link } from "react-router";
function BackButton() {
  return (
    <Link to="/">
      <button className="text-primary flex items-center gap-[1.2rem] hover:gap-[2.4rem] hover:cursor-pointer border-slate border-2 transition-all rounded-full px-[1.8rem] py-[0.2rem] bg-background text-[2.4rem] uppercase  tracking-[0.6rem] ">
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
          class="lucide lucide-move-left-icon lucide-move-left"
        >
          <path d="M6 8L2 12L6 16" />
          <path d="M2 12H22" />
        </svg>
        BACK TO UNIVERSE
      </button>
    </Link>
  );
}
export default BackButton;
