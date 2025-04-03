import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";

//import navbar images
import cheesecake from "../../assets/pixel_images/23_cheesecake_dish.png";
import mirror from "../../assets/pixel_images/item_mirror.png";
import book from "../../assets/pixel_images/item_book_red_lines.png";
import flower from "../../assets/pixel_images/item_flower_daisy.png";
import basket from "../../assets/pixel_images/basket_yellow.png";

interface NavbarProps {
  onLinkClick: (component: string) => void;
}

const Navbar = ({ onLinkClick }: NavbarProps) => {
  const [toggleNav, setToggleNav] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar_heading">
        <img src={basket} className="navbar_heading_emote" />
        <h1 className="navbar_title">NomNom</h1>
      </div>
      <ul className="navbar_links">
        <li className="navbar_font">
          <img src={flower} className="navbar_emotes" />
          <a href="#home" onClick={() => onLinkClick("home")}>
            Home
          </a>
        </li>
        <li className="navbar_font">
          <img src={mirror} className="navbar_emotes" />
          <a href="#companion" onClick={() => onLinkClick("companion")}>
            Companion
          </a>
        </li>
        <li className="navbar_font">
          <img src={book} className="navbar_emotes" />
          <a href="#quests" onClick={() => onLinkClick("quests")}>
            Quests
          </a>
        </li>
        <li className="navbar_font">
          <img src={cheesecake} className="navbar_emotes" />
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
