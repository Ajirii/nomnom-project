import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { useAuth } from "../../context/AuthContext";

//import navbar images
import cheesecake from "/assets/pixel_images/23_cheesecake_dish.png";
import gummy from "/assets/pixel_images/50_giantgummybear.png";
import book from "/assets/pixel_images/book.png";
import daisy from "/assets/pixel_images/daisy.png";
import noodlebowl from "/assets/pixel_images/noodlebowl.png";

interface NavbarProps {
  onLinkClick: (component: string) => void;
}

const Navbar = ({ onLinkClick }: NavbarProps) => {
  const [toggleNav, setToggleNav] = useState(false);
  const { isLoggedIn, setIsLoggedIn } = useAuth();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    onLinkClick("home");
  };

  return (
    <nav className="navbar">
      <div className="navbar_heading">
        <img src={noodlebowl} className="navbar_heading_emote" />
        <h1 className="navbar_title">NomNom</h1>
      </div>
      <ul className="navbar_links">
        <li className="navbar_font">
          <img src={daisy} className="navbar_daisy" />
          <a href="#home" onClick={() => onLinkClick("home")}>
            Home
          </a>
        </li>
        <li className="navbar_font">
          <img src={gummy} className="navbar_small_emotes" />
          <a href="#companion" onClick={() => onLinkClick("companion")}>
            Companion
          </a>
        </li>
        <li className="navbar_font">
          <img src={book} className="navbar_small_emotes" />
          <a href="#quests" onClick={() => onLinkClick("quests")}>
            Quests
          </a>
        </li>
        <li className="navbar_font">
          <img src={cheesecake} className="navbar_cheesecake" />
          <a href="#recipes" onClick={() => onLinkClick("recipes")}>
            Recipes
          </a>
        </li>
      </ul>
      <div className="navbar_login">
        {isLoggedIn ? (
          <a className="navbar_font" onClick={handleSignOut}>
            Sign Out
          </a>
        ) : (
          <a
            href="#login"
            className="navbar_font"
            onClick={() => onLinkClick("login")}
          >
            Sign In
          </a>
        )}
      </div>
      <div className="navbar_smallscreen">
        <GiHamburgerMenu
          className="overlay_close"
          onClick={() => setToggleNav(true)}
        />

        {toggleNav && (
          <div className="navbar_smallscreen_overlay">
            <GiHamburgerMenu
              className="overlay_open"
              onClick={() => setToggleNav(false)}
            />
            <ul
              className="navbar_smallscreen_links"
              onClick={() => setToggleNav(false)}
            >
              <li className="navbar_font">
                <a href="#home" onClick={() => onLinkClick("home")}>
                  Home
                </a>
              </li>
              <li className="navbar_font">
                <a href="#companion" onClick={() => onLinkClick("companion")}>
                  Companion
                </a>
              </li>
              <li className="navbar_font">
                <a href="#quests" onClick={() => onLinkClick("quests")}>
                  Quests
                </a>
              </li>
              <li className="navbar_font">
                <a href="#recipes" onClick={() => onLinkClick("recipes")}>
                  Recipes
                </a>
              </li>
              <li className="navbar_font">
                <a href="#login" onClick={() => onLinkClick("login")}>
                  Log In
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
