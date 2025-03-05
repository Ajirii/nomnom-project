import { useState, useEffect } from "react";
import Navbar from "./components/Navbar/Navbar";
import "./components/Navbar/Navbar.css";
import NormalFace from "./components/Faces/Normalface";
import "./components/Faces/Normalface.css";
import Home from "./components/Home/Home";
import "./components/Home/Home.css";
import Companion from "./components/Companion/Companion";
import "./components/Companion/Companion.css";
import Quests from "./components/Quests/Quests";
import "./components/Quests/Quests.css";
import Recipes from "./components/Recipes/Recipes";
import "./components/Recipes/Recipes.css";
import Login from "./components/Login/Login";
import "./components/Login/Login.css";
import Footer from "./components/Footer/Footer";
import "./components/Footer/Footer.css";
import Start from "./components/Start/Start";
import "./components/Start/Start.css";
import ClickEffects from "./components/MouseEffects/ClickEffects";
import "./components/MouseEffects/ClickEffects.css";

const App = () => {
  const [activeComponent, setActiveComponent] = useState<string>("start");
  const [hunger, setHunger] = useState<number>(100);

  const handleStartClick = () => {
    setActiveComponent("home");
  };

  const handleLinkClick = (component: string) => {
    setActiveComponent(component);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setHunger((prevHunger) => Math.max(prevHunger - 10, 0));
    }, 6 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main>
      <ClickEffects />
      {activeComponent === "start" && <Start onStartClick={handleStartClick} />}
      {activeComponent !== "start" && (
        <>
          <Navbar onLinkClick={handleLinkClick} />
          <NormalFace />
          {activeComponent === "home" && <Home />}
          {activeComponent === "companion" && <Companion hunger={hunger} />}
          {activeComponent === "quests" && <Quests />}
          {activeComponent === "recipes" && <Recipes />}
          {activeComponent === "login" && <Login />}
          <Footer />
        </>
      )}
    </main>
  );
};

export default App;
