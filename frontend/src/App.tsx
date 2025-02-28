import Navbar from "./components/Navbar/Navbar";
import "./components/Navbar/Navbar.css";
import NormalFace from "./components/Faces/Normalface";
import "./components/Faces/Normalface.css";
import Home from "./components/Home/Home";
import "./components/Home/Home.css";
import Quests from "./components/Quests/Quests";
import "./components/Quests/Quests.css";
import Recipes from "./components/Recipes/Recipes";
import "./components/Recipes/Recipes.css";
import Login from "./components/Login/Login";
import "./components/Login/Login.css";
import Footer from "./components/Footer/Footer";
import "./components/Footer/Footer.css";

const App = () => {
  return (
    <main>
      <Navbar />
      <NormalFace />
      <Home />
      <Quests />
      <Recipes />
      <Login />
      <Footer />
    </main>
  );
};

export default App;
