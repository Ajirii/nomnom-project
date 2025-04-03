import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";

//import navbar images
import carrot_pixel from "../../assets/pixel_images/carrot_pixel.png";
import soy_pixel from "../../assets/pixel_images/soy_pixel.png";
import corn_pixel from "../../assets/pixel_images/corn_pixel.png";
import cookie_pixel from "../../assets/pixel_images/cookie_pixel.png";
import noodle_pixel from "../../assets/pixel_images/noodle_pixel.png";
import orange_pixel from "../../assets/pixel_images/orange_pixel.png";
import salad_pixel from "../../assets/pixel_images/salad_pixel.png";
import onion_pixel from "../../assets/pixel_images/onion_pixel.png";

interface NavbarProps {
  onLinkClick: (component: string) => void;
}

const Navbar = ({ onLinkClick }: NavbarProps) => {
  const [toggleNav, setToggleNav] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar_heading">
        <img src={carrot_pixel} className="navbar_heading_emote" />
        <h1 className="navbar_title">NomNom</h1>
      </div>
      <ul className="navbar_links">
        <li className="navbar_font">
          <img src={soy_pixel} className="navbar_emotes" />
          <a href="#home" onClick={() => onLinkClick("home")}>
            Home
          </a>
        </li>
        <li className="navbar_font">
          <img src={corn_pixel} className="navbar_emotes" />
          <a href="#companion" onClick={() => onLinkClick("companion")}>
            Companion
          </a>
        </li>
        <li className="navbar_font">
          <img src={orange_pixel} className="navbar_emotes" />
          <a href="#quests" onClick={() => onLinkClick("quests")}>
            Quests
          </a>
        </li>
        <li className="navbar_font">
          <img src={cookie_pixel} className="navbar_emotes" />
          <a href="#recipes" onClick={() => onLinkClick("recipes")}>
            Recipes
          </a>
        </li>
      </ul>
      <div className="navbar_login">
        <a
          href="#login"
          className="navbar_font"
          onClick={() => onLinkClick("login")}
        >
          Log In
        </a>
        <div />
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
