import { useLocation } from "react-router";
import { useNavigate } from "react-router";

const sideBar = ["emotion", "travel", "career", "personal", "milestone"];
const colorClasses = {
  emotion: "bg-emotion",
  travel: "bg-travel",
  career: "bg-career",
  personal: "bg-personal",
  milestone: "bg-milestone",
};

function SideBar() {
  const location = useLocation();
  console.log(location);
  const navigate = useNavigate();

  return (
    <ul className="transform translate-y-[25%] z-20 flex gap-[10rem] max-md:gap-[10rem] absolute flex-col rounded-2xl max-md:flex-row max-md:flex-wrap max-md:top-auto max-md:bottom-24 max-md:left-1/2 max-md:-translate-x-1/2 max-md:translate-y-0  max-md:justify-center max-md:w-full max-md:px-4">
      {sideBar.map((item) => {
        const isActive = location.pathname === `/${item}`;
        return (
          <li
            key={item}
            onClick={() => navigate(`/${item}`)}
            className={`flex flex-col gap-[2.4rem] items-center group transition-all hover:cursor-pointer justify-center ${
              isActive
                ? "translate-x-[125%] max-md:translate-x-0 max-md:-translate-y-[50%] max-md:scale-110"
                : "translate-x-[50%] max-md:translate-x-0 max-md:translate-y-0"
            }`}
          >
            <div
              className={`${colorClasses[item]} ${
                isActive ? "scale-200" : "scale-100"
              } group-hover:scale-200 transition-all w-[1.25rem] h-[1.25rem] rounded-full`}
            ></div>
            <span
              className={`text-[1.2rem] max-md:text-[1rem] tracking-[0.4rem] max-md:tracking-[0.2rem] uppercase group-hover:text-tertiary ${
                isActive ? "text-tertiary scale-125" : "text-text scale-100"
              } transition-all group-hover:scale-125`}
            >
              {item}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export default SideBar;
