import { useEffect, useState } from "react";
import eggIcon from "/assets/cosmetics/egg3.png";
import { fetchAllRecipes } from "../../utils/fetchRecipes";

interface Recipe {
  title: string;
  ingredients: string[];
  instructions: string[];
  cookingMinutes: number;
  servings: number;
  notes: string;
  cuisine: string;
  favorite: boolean;
  createdBy?: string;
  createdAt?: string;
}

// const categories = ["All", "Breakfast", "Main Dishes", "Drinks", "Desserts"];

const favbuttons = ["All", "Favorites"];

const Recipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  // const [activeCategory, setActiveCategory] = useState("All");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showingFavorites, setShowingFavorites] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const data = await fetchAllRecipes();
        const mapped = data.map((recipe: any) => ({
          title: recipe.title,
          ingredients: recipe.ingredients || [],
          instructions: recipe.instructions || [],
          cookingMinutes: recipe.cookingMinutes,
          servings: recipe.servings,
          notes: recipe.notes || "",
          cuisine: recipe.cuisine || "any",
          favorite: recipe.favorite || false,
          createdBy: recipe.createdBy || "",
          createdAt: recipe.createdAt,
        }));
        setRecipes(mapped);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    loadRecipes();
  }, []);

  const toggleFavorite = (title: string) => {
    setFavorites((prev) =>
      prev.includes(title)
        ? prev.filter((name) => name !== title)
        : [...prev, title]
    );
  };

  const filteredRecipes = recipes.filter((recipe) => {
    // const matchesCategory =
    //   activeCategory === "All" || recipe.cuisine === activeCategory;
    const matchesFavorites =
      !showingFavorites || favorites.includes(recipe.title);
    const matchesSearch =
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.notes.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFavorites && matchesSearch;
  });

  return (
    <div className="recipes-section">
      <div className="recipes-header">
        <h1 className="recipes-title">Recipes </h1>
        <img src={eggIcon} alt="fried egg" className="recipes-icon" />
      </div>

      <p className="recipes-subtitle">Explore recipes</p>

      <div className="search-bar">
        <input
          type="text"
          placeholder=" Search recipes... "
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="recipe-filters">
        {/* {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-btn ${
              activeCategory === cat && !showingFavorites ? "active" : ""
            }`}
            onClick={() => {
              setActiveCategory(cat);
              setShowingFavorites(false);
            }}
          >
            {cat}
          </button>
        ))} */}
        {favbuttons.map((button) => (
          <button
            key={button}
            className={`filter-btn ${
              (button === "Favorites" && showingFavorites) ||
              (button === "All" && !showingFavorites)
                ? "active"
                : ""
            }`}
            onClick={() => setShowingFavorites(button === "Favorites")}
          >
            {button}
          </button>
        ))}
      </div>

      {/* <div className="favorites-toggle">
        <button
          className={`filter-btn ${showingFavorites ? "active" : ""}`}
          onClick={() => setShowingFavorites((prev) => !prev)}
        >
          {showingFavorites ? "Show All Recipes" : "Show Favorites "}
        </button>
      </div> */}

      <div className="recipe-grid">
        {filteredRecipes.map((recipe) => (
          <div
            className="recipe-card"
            key={recipe.title}
            onClick={() => {
              setSelectedRecipe(recipe);
              setShowModal(true);
            }}
          >
            {/* <div className="recipe-placeholder-img">🍳</div> */}
            <div className="recipe-overlay">
              <button
                className="favorite-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(recipe.title);
                }}
              >
                {favorites.includes(recipe.title) ? "❤️" : "🤍"}
              </button>
              <h2 className="recipe-name">{recipe.title}</h2>
              <p className="recipe-desc">{recipe.notes}</p>
            </div>
          </div>
        ))}
      </div>

      {showModal && selectedRecipe && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-body">
              <h2 className="modal-title">{selectedRecipe.title}</h2>
              <p className="modal-description">{selectedRecipe.notes}</p>

              <div className="modal-meta">
                <p>
                  <strong>Cooking Time:</strong> {selectedRecipe.cookingMinutes}{" "}
                  min
                </p>
                <p>
                  <strong>Servings:</strong> {selectedRecipe.servings}
                </p>
              </div>

              <div className="modal-ingredients">
                <h3>Ingredients</h3>
                <ul>
                  {selectedRecipe.ingredients.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="modal-steps">
                <h3>Steps</h3>
                <ol>
                  {selectedRecipe.instructions.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>
              <button
                className="close-button"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recipes;
