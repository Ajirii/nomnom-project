import { useEffect, useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import "./components/Navbar/Navbar.css";
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
import SignUp from "./components/SignUp/SignUp";
import Footer from "./components/Footer/Footer";
import "./components/Footer/Footer.css";
import Start from "./components/Start/Start";
import "./components/Start/Start.css";
import { useAuth } from "./context/AuthContext";
import ClickableNomNom from "./components/Faces/ClickableNomNom";
import Modal from "./components/Modal/loginModal";
import { fetchCosmetics } from "./utils/fetchCosmetics";

const backgrounds: Record<string, string> = {
  start: "/assets/background/nightcloud.png",
  home: "/assets/background/Summer2.png",
  quests: "/assets/background/nightcity.png",
  recipes: "/assets/background/flyingship.png",
  companion: "/assets/background/sunsetcloud.png",
  login: "/assets/background/winterbirch.png",
  signup: "/assets/background/Summer8.png",
};

const App = () => {
  const [activeComponent, setActiveComponent] = useState<string>("start");
  const [cosmetic, setCosmetic] = useState<string>(
    "/assets/cosmetics/blush.svg"
  );
  const [faceState, setFaceState] = useState<
    "default" | "happy" | "arrow" | "meh" | "hungry"
  >("default");

  const { isLoggedIn } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [coins, setCoins] = useState<number>(0);
  const [unlockedCosmetics, setUnlockedCosmetics] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    const loadCosmetics = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("Token not found, skipping cosmetics fetch.");
          return;
        }

        const { allCosmetics, unlockedMap, coins, currentCosmeticId } =
          await fetchCosmetics();

        setUnlockedCosmetics(unlockedMap);
        setCoins(coins);

        const equipped = allCosmetics.find(
          (c) => c.cosmeticId === currentCosmeticId
        );
        if (equipped) {
          setCosmetic(equipped.iconUrl);
        }
      } catch (error) {
        console.error("Failed to load cosmetics:", error);
      }
    };

    if (isLoggedIn) {
      loadCosmetics();
    }
    if (!isLoggedIn) {
      setCosmetic("");
    }
  }, [isLoggedIn]);

  const handleStartClick = () => {
    setActiveComponent("home");
  };

  const handleLinkClick = (component: string) => {
    if (
      !isLoggedIn &&
      (component === "companion" ||
        component === "quests" ||
        component === "recipes")
    ) {
      setShowModal(true);
      return;
    }
    setActiveComponent(component);
  };

  const handleCosmeticChange = (newCosmetic: string) => {
    setCosmetic(newCosmetic);
  };

  const handleFaceStateChange = (newFaceState: typeof faceState) => {
    setFaceState(newFaceState);
  };

  return (
    <main>
      <div
        className={`fullscreen-image ${
          activeComponent === "recipes" ? "dark-overlay" : ""
        }`}
        style={{
          backgroundImage: `url(${backgrounds[activeComponent] || ""})`,
        }}
      />

      {activeComponent === "start" ? (
        <Start onStartClick={handleStartClick} />
      ) : (
        <>
          <Navbar onLinkClick={handleLinkClick} />
          <ClickableNomNom
            baseFaceState={faceState}
            cosmeticSrc={isLoggedIn ? cosmetic : undefined}
          />

          {activeComponent === "home" && (
            <Home onFaceStateChange={handleFaceStateChange} />
          )}

          {activeComponent === "companion" && (
            <Companion
              coins={coins}
              setCoins={setCoins}
              onCosmeticChange={handleCosmeticChange}
              unlockedCosmetics={unlockedCosmetics}
              setUnlockedCosmetics={setUnlockedCosmetics}
            />
          )}

          {activeComponent === "quests" && (
            <Quests coins={coins} setCoins={setCoins} />
          )}

          {activeComponent === "recipes" && <Recipes />}

          {!isLoggedIn && activeComponent === "login" && (
            <Login
              onLoginSuccess={() => setActiveComponent("home")}
              setActiveComponent={setActiveComponent}
            />
          )}

          {!isLoggedIn && activeComponent === "signup" && (
            <SignUp onSignUpSuccess={() => setActiveComponent("home")} />
          )}

          {showModal && (
            <Modal
              message="Please sign in to access this page!"
              onClose={() => setShowModal(false)}
            />
          )}
        </>
      )}
      <Footer />
    </main>
  );
};

export default App;
