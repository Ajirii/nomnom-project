import { useState, useEffect } from "react";
import Navbar from "./components/Navbar/Navbar";
import "./components/Navbar/Navbar.css";
import NormalFace from "./components/Faces/Normalface";
import "./components/Faces/Normalface.css";
import Home from "./components/Home/Home";
import "./components/Home/Home.css";
import Mood from "./components/Mood/Mood";
import "./components/Mood/Mood.css";
import Quests from "./components/Quests/Quests";
import "./components/Quests/Quests.css";
import Recipes from "./components/Recipes/Recipes";
import "./components/Recipes/Recipes.css";
import Login from "./components/Login/Login";
import "./components/Login/Login.css";
import Footer from "./components/Footer/Footer";
import "./components/Footer/Footer.css";

const App = () => {
  const [activeComponent, setActiveComponent] = useState<string>("home");
  const [hunger, setHunger] = useState<number>(100);

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
      <Navbar onLinkClick={handleLinkClick} />
      <NormalFace />
      {activeComponent === "home" && <Home />}
      {activeComponent === "mood" && <Mood hunger={hunger} />}
      {activeComponent === "quests" && <Quests />}
      {activeComponent === "recipes" && <Recipes />}
      {activeComponent === "login" && <Login />}
      <Footer />
    </main>
  );
};

export default App;
