import { Close, Menu } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [menu, setMenu] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menu]);

  return (
    <>
      <nav className="bg-[#E3E8ED] py-6">
        <div className="container mx-auto flex justify-between items-center px-4">
          <div>
            <Link to="/" className="font-semibold text-xl">
              MOVIECRITIC
            </Link>
          </div>
          <div>
            <ul className="space-x-4 hidden lg:flex md:flex">
              <li>
                <Link
                  to="/"
                  className="text-[#6558F5] border-[#B5B4EF] border-2 rounded bg-white p-2 shadow"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/add-movie"
                  className="text-[#6558F5] border-[#B5B4EF] border-2 rounded bg-white p-2 shadow"
                >
                  Add new movie
                </Link>
              </li>
              <li>
                <Link to="/add-review" className="text-white bg-[#6558F5] rounded p-2 shadow">
                  Add new review
                </Link>
              </li>
            </ul>
            <span className="lg:hidden md:hidden">
              {menu ? (
                <Close onClick={() => setMenu(false)} sx={{ fontSize: 27 }} />
              ) : (
                <Menu onClick={() => setMenu(true)} sx={{ fontSize: 27 }} />
              )}
            </span>
          </div>
        </div>
      </nav>

      <div
        ref={menuRef}
        className={`fixed text-lg left-0 top-0 w-[70vw] z-10 h-full bg-[#E3E8ED] duration-200 transform shadow ${
          menu ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <p className="border-b-2 border-white p-6 pb-[.5rem] text-lg">Menu</p>
        <div className="flex flex-col p-4 pt-6 space-y-4">
          <Link
            to="/"
            onClick={() => setMenu(false)}
            className="text-[#6558F5] border-[#B5B4EF] border-2 rounded bg-white p-2 shadow"
          >
            Home
          </Link>

          <Link
            to="/add-movie"
            onClick={() => setMenu(false)}
            className="text-[#6558F5] border-[#B5B4EF] border-2 rounded bg-white p-2 shadow"
          >
            Add new movie
          </Link>

          <Link
            to="/add-review"
            onClick={() => setMenu(false)}
            className="text-white bg-[#6558F5] rounded p-2 shadow"
          >
            Add new review
          </Link>
        </div>
      </div>
    </>
  );
};

export default Header;
