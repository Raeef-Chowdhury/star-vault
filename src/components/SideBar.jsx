import { useLocation } from "react-router";
import { useNavigate } from "react-router";
const sideBar = ["emotion", "travel", "career", "personal", "milestones"];
const colorClasses = {
  emotion: "bg-emotion",
  travel: "bg-travel",
  career: "bg-career",
  personal: "bg-personal",
  milestones: "bg-milestones",
};
function SideBar() {
  const location = useLocation();
  console.log(location);
  const navigate = useNavigate();
  return (
    <ul
      className={`transform  translate-y-[25%] z-2 flex gap-[10rem]  absolute flex-col rounded-2xl `}
    >
      {sideBar.map((item) => {
        const isActive = location.pathname === `/${item}`;
        return (
          <li
            key={item}
            onClick={() => navigate(`/${item}`)}
            className={`flex  flex-col gap-[2.4rem] items-center group  transition-all hover:cursor-pointer  ${
              isActive ? "translate-x-[125%]" : "translate-x-[50%] "
            } justify-center`}
          >
            <div
              className={`${colorClasses[item]} ${
                isActive ? "scale-200" : "scale-100"
              } group-hover:scale-200 transition-all w-[1.25rem] h-[1.25rem] rounded-full`}
            ></div>
            <span
              className={`text-[1.2rem] tracking-[0.4rem] uppercase group-hover:text-tertiary ${
                isActive ? "text-tertiary scale-125" : "text-text scale-100"
              } transition-all  group-hover:scale-125`}
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
