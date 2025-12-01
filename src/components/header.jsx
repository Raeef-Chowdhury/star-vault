import { Sparkles } from "lucide-react";

function Header() {
  return (
    <>
      <header className="">
        <ul className="flex items-center justify-between">
          <li className="flex items-center gap-[1.8rem] text-text text-[3.2rem] tracking-[1.2rem]">
            <Sparkles className="p-4 rounded-full w-16 h-16 text-white bg-gradient-to-br from-[#6b9fff] to-[#a78bfa]" />{" "}
            <p>STAR VAULT</p>
          </li>
        </ul>
      </header>
    </>
  );
}
export default Header;
