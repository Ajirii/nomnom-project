import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Recipes from "./components/Recipes";
import Login from "./components/Login";

const App = () => {
  return (
    <main>
      <Navbar />
      <Home />
      <Recipes />
      <Login />
    </main>
  );
};

export default App;
