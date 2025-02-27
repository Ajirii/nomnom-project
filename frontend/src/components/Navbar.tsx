import { useRef, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";

const navItems = ["Home", "Quests", "Recipes", "Login"];

const Navbar = () => {
  const [toggleNav, setToggleNav] = useState(false);
  const navContainerRef = useRef(null);

  return (
    <div
      ref={navContainerRef}
      className="fixed inset-x-0 top-4 z-50 h-16 border-none transition-all duration-700 sm:inset-x-6"
    >
      <header className="absolute top-1/2 w-full -translate-y-1/2">
        <nav className="flex size-full items-center justify-between p-4">
          <div className="flex h-full items-center ml-auto">
            <div className="hidden md:flex">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="navbar"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          <div className="navbar_smallscreen">
            <GiHamburgerMenu
              className="overlay_open"
              onClick={() => setToggleNav(true)}
            />

            {toggleNav && (
              <div className="navbar_smallscreen_overlay">
                <GiHamburgerMenu
                  className="overlay_close"
                  onClick={() => setToggleNav(false)}
                />
                <div className="hidden md:block">
                  {navItems.map((item) => (
                    <a
                      key={item}
                      href={`#${item.toLowerCase()}`}
                      className="navbar_smallscreen"
                      onClick={() => setToggleNav(false)}
                    >
                      {item}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Navbar;
