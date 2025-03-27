import { useState } from "react";

interface Recipe {
  id: number;
  name: string;
  image: string;
  category: string;
  description: string;
}

const recipes: Recipe[] = [
  {
    id: 1,
    name: "Fried Eggs",
    image: "/assets/recipes/fried-eggs.jpg",
    category: "Breakfast",
    description: "Made with eggs, lettuce, salt, oil and other ingredients.",
  },
  {
    id: 2,
    name: "Hawaiian Pizza",
    image: "/assets/recipes/hawaiian-pizza.jpg",
    category: "Main Dishes",
    description: "Made with eggs, lettuce, salt, oil and other ingredients.",
  },
  {
    id: 3,
    name: "Martinez Cocktail",
    image: "/assets/recipes/cocktail.jpg",
    category: "Drinks",
    description: "Made with eggs, lettuce, salt, oil and other ingredients.",
  },
  {
    id: 4,
    name: "Butterscotch Cake",
    image: "/assets/recipes/cake.jpg",
    category: "Desserts",
    description: "Made with eggs, lettuce, salt, oil and other ingredients.",
  },
  {
    id: 5,
    name: "Mint Lemonade",
    image: "/assets/recipes/mint-lemonade.jpg",
    category: "Drinks",
    description: "Made with eggs, lettuce, salt, oil and other ingredients.",
  },
  {
    id: 6,
    name: "Chocolate Icecream",
    image: "/assets/recipes/chocolate-icecream.jpg",
    category: "Desserts",
    description: "Made with eggs, lettuce, salt, oil and other ingredients.",
  },
  {
    id: 7,
    name: "Cheese Burger",
    image: "/assets/recipes/cheese-burger.jpg",
    category: "Main Dishes",
    description: "Made with eggs, lettuce, salt, oil and other ingredients.",
  },
  {
    id: 8,
    name: "Classic Waffles",
    image: "/assets/recipes/classic-waffles.jpg",
    category: "Breakfast",
    description: "Made with eggs, lettuce, salt, oil and other ingredients.",
  },
];

const categories = ["All", "Breakfast", "Main Dishes", "Drinks", "Desserts"];

const Recipes = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredRecipes =
    activeCategory === "All"
      ? recipes
      : recipes.filter((recipe) => recipe.category === activeCategory);

  return (
    <div className="recipes-section">
      <h1 className="recipes-title">Recipes</h1>
      <p className="recipes-subtitle">Explore recipes</p>

      <div className="recipe-filters">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-btn ${activeCategory === cat ? "active" : ""}`}
            onClick={() => {
              setActiveCategory(cat);
              console.log("Selected Category:", cat);
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="recipe-grid">
        {filteredRecipes.map((recipe) => (
          <div className="recipe-card" key={recipe.id}>
            <img src={recipe.image} alt={recipe.name} className="recipe-img" />
            <h2 className="recipe-name">{recipe.name}</h2>
            <p className="recipe-desc">{recipe.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recipes;
