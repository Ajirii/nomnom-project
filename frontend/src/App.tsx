import { useState, useEffect } from "react";
import Navbar from "./components/Navbar/Navbar";
import "./components/Navbar/Navbar.css";
import NormalFace from "./components/Faces/Normalface";
import "./components/Faces/Normalface.css";
import Home from "./components/Home/Home";
import "./components/Home/Home.css";
import Companion from "./components/Companion/Companion";
import "./components/Companion/Companion.css";
import { Quests } from "./components/Quests/Quests";
import "./components/Quests/Quests.css";
import Recipes from "./components/Recipes/Recipes";
import "./components/Recipes/Recipes.css";
import Login from "./components/Login/Login";
import "./components/Login/Login.css";
import Footer from "./components/Footer/Footer";
import "./components/Footer/Footer.css";
import Start from "./components/Start/Start";
import "./components/Start/Start.css";

const backgrounds: Record<string, string> = {
  home: "/assets/background/Summer2.png",
  quests: "/assets/background/nightcity.png",
  recipes: "/assets/background/flyingship.png",
  companion: "/assets/background/sunflower.png",
  login: "/assets/background/shipwreck.png",
};

const App = () => {
  const [activeComponent, setActiveComponent] = useState<string>("start");
  const [hunger, setHunger] = useState<number>(100);
  const [cosmetic, setCosmetic] = useState<string>(
    "/assets/white_face_assets/blush.svg"
  );
  const [faceState, setFaceState] = useState<
    "default" | "happy" | "arrow" | "meh" | "hungry"
  >("default");
  const [coins, setCoins] = useState<number>(0);

  const handleStartClick = () => {
    setActiveComponent("home");
  };

  const handleLinkClick = (component: string) => {
    setActiveComponent(component);
  };

  const handleCosmeticChange = (newCosmetic: string) => {
    setCosmetic(newCosmetic);
  };

  const handleFaceStateChange = (
    newFaceState: "default" | "happy" | "arrow" | "meh" | "hungry"
  ) => {
    setFaceState(newFaceState);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setHunger((prevHunger) => Math.max(prevHunger - 10, 0));
    }, 6 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main>
      {/* Background Image Container */}
      {activeComponent !== "start" && (
        <div
          className="fullscreen-image"
          style={{
            backgroundImage: `url(${backgrounds[activeComponent]})`,
          }}
        />
      )}

      {activeComponent === "start" ? (
        <Start onStartClick={handleStartClick} />
      ) : (
        <>
          <Navbar onLinkClick={handleLinkClick} />
          <NormalFace faceState={faceState} cosmeticSrc={cosmetic} />

          {activeComponent === "home" && (
            <Home onFaceStateChange={handleFaceStateChange} />
          )}
          {activeComponent === "companion" && (
            <Companion
              hunger={hunger}
              coins={coins}
              setCoins={setCoins}
              onCosmeticChange={handleCosmeticChange}
            />
          )}
          {activeComponent === "quests" && <Quests coins={coins} setCoins={setCoins} />}
          {activeComponent === "recipes" && <Recipes />}
          {activeComponent === "login" && <Login />}
          <Footer />
        </>
      )}
    </main>
  );
};

export default App;