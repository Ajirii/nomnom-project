import { useState } from "react";

interface Recipe {
  id: number;
  name: string;
  image: string;
  category: string;
  description: string;
  ingredients: string[];
  steps: string[];
  tags: string[];
  cooking_time: string;
  servings: number;
  additional_notes: string;
}

const recipes: Recipe[] = [
  {
    id: 1,
    name: "Lentil and Carrot Chowder",
    image: "/assets/recipes/chowder.jpg",
    category: "Main Dishes",
    description:
      "This hearty Lentil and Carrot Chowder combines protein-rich lentils with the natural sweetness of carrots. Perfect for chilly days or whenever you need a healthy meal.",
    ingredients: [
      "1 tablespoon olive oil",
      "1 medium onion, diced",
      "2 cloves garlic, minced",
      "3 medium carrots, diced",
      "1 cup dried lentils (green or brown), rinsed",
      "4 cups vegetable broth",
      "1 cup coconut milk",
      "1 teaspoon ground cumin",
      "1 teaspoon dried thyme",
      "Salt and pepper to taste",
      "Fresh parsley for garnish"
    ],
    steps: [
      "In a large pot, heat the olive oil over medium heat.",
      "Add the diced onion and sauté until translucent, about 5 minutes.",
      "Stir in the minced garlic and diced carrots; cook for another 3 minutes.",
      "Add the rinsed lentils, vegetable broth, cumin, and thyme. Bring to a boil.",
      "Reduce heat, cover, and let simmer for 25 minutes, or until lentils are tender.",
      "Stir in the coconut milk and season with salt and pepper. Simmer for an additional 5 minutes.",
      "If desired, blend for a creamier texture using an immersion blender.",
      "Serve hot, garnished with fresh parsley."
    ],
    tags: ["chowder", "soup", "healthy", "vegan", "lentils"],
    cooking_time: "30 minutes",
    servings: 4,
    additional_notes: "Serve with crusty bread for dipping and enjoy this hearty meal for breakfast or brunch."
  },
  {
    id: 2,
    name: "Avocado Toast",
    image: "/assets/recipes/avocado-toast.jpg",
    category: "Breakfast",
    description:
      "A simple and nutritious breakfast made with creamy avocado spread over crispy toast.",
    ingredients: [
      "2 slices of whole grain bread",
      "1 ripe avocado",
      "Salt and pepper to taste",
      "Red pepper flakes",
      "Lemon juice",
      "Optional toppings: poached egg, cherry tomatoes, microgreens"
    ],
    steps: [
      "Toast the bread slices until golden brown.",
      "Mash the avocado in a bowl and season with salt, pepper, and lemon juice.",
      "Spread the avocado mixture evenly on the toast.",
      "Sprinkle red pepper flakes and add any desired toppings.",
      "Serve immediately."
    ],
    tags: ["breakfast", "healthy", "vegetarian", "quick"],
    cooking_time: "10 minutes",
    servings: 1,
    additional_notes: "Top with a poached egg for extra protein."
  },
  {
    id: 3,
    name: "Spaghetti Carbonara",
    image: "/assets/recipes/carbonara.jpg",
    category: "Main Dishes",
    description:
      "A creamy and savory Italian classic pasta made with eggs, cheese, pancetta, and pepper.",
    ingredients: [
      "200g spaghetti",
      "100g pancetta",
      "2 large eggs",
      "50g grated Parmesan cheese",
      "Salt and black pepper",
      "1 clove garlic (optional)"
    ],
    steps: [
      "Cook the spaghetti in salted water until al dente.",
      "Fry pancetta until crispy. Optionally add garlic for aroma, then remove it.",
      "Beat the eggs with grated Parmesan cheese.",
      "Drain pasta and toss it with pancetta. Remove from heat.",
      "Stir in egg-cheese mixture quickly to create a creamy sauce.",
      "Season with black pepper and serve hot."
    ],
    tags: ["pasta", "italian", "comfort food"],
    cooking_time: "25 minutes",
    servings: 2,
    additional_notes: "Use freshly grated Parmesan for best flavor."
  },
  {
    id: 4,
    name: "Berry Smoothie",
    image: "/assets/recipes/berry-smoothie.jpg",
    category: "Drinks",
    description:
      "A refreshing blend of berries and yogurt perfect for a quick, nutritious boost.",
    ingredients: [
      "1 cup mixed berries (fresh or frozen)",
      "1/2 banana",
      "1/2 cup Greek yogurt",
      "1/2 cup milk or juice",
      "1 teaspoon honey (optional)"
    ],
    steps: [
      "Add all ingredients to a blender.",
      "Blend until smooth and creamy.",
      "Taste and adjust sweetness with honey if desired.",
      "Pour into a glass and serve chilled."
    ],
    tags: ["smoothie", "healthy", "drink", "berries"],
    cooking_time: "5 minutes",
    servings: 1,
    additional_notes: "Use frozen berries for a thicker smoothie."
  },
  {
    id: 5,
    name: "Chocolate Mug Cake",
    image: "/assets/recipes/mug-cake.jpg",
    category: "Desserts",
    description:
      "A quick and easy chocolate cake made in the microwave—perfect for one!",
    ingredients: [
      "4 tablespoons all-purpose flour",
      "2 tablespoons cocoa powder",
      "2 tablespoons sugar",
      "1/4 teaspoon baking powder",
      "3 tablespoons milk",
      "2 tablespoons vegetable oil",
      "1/2 teaspoon vanilla extract",
      "Pinch of salt"
    ],
    steps: [
      "In a mug, mix flour, cocoa powder, sugar, salt, and baking powder.",
      "Add milk, oil, and vanilla extract. Mix well until smooth.",
      "Microwave on high for 1 to 1.5 minutes (depending on microwave power).",
      "Let cool slightly and enjoy!"
    ],
    tags: ["dessert", "microwave", "chocolate", "quick"],
    cooking_time: "5 minutes",
    servings: 1,
    additional_notes: "Top with ice cream or berries if desired."
  }
];

const categories = ["All", "Breakfast", "Main Dishes", "Drinks", "Desserts"];

const Recipes = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showingFavorites, setShowingFavorites] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [searchQuery, setSearchQuery] = useState("");


  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesCategory =
      activeCategory === "All" || recipe.category === activeCategory;
    const matchesFavorites = !showingFavorites || favorites.includes(recipe.id);
    const matchesSearch =
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase());
  
    return matchesCategory && matchesFavorites && matchesSearch;
  });
  

  return (
    <div className="recipes-section">
      <h1 className="recipes-title">Recipes🍳</h1>
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
        {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-btn ${activeCategory === cat && !showingFavorites ? "active" : ""}`}
            onClick={() => {
              setActiveCategory(cat);
              setShowingFavorites(false);
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="favorites-toggle">
        <button
          className={`filter-btn ${showingFavorites ? "active" : ""}`}
          onClick={() => setShowingFavorites((prev) => !prev)}
        >
          {showingFavorites ? "Show All Recipes" : "Show Favorites "}
        </button>
      </div>

      <div className="recipe-grid">
        {filteredRecipes.map((recipe) => (
          <div
            className="recipe-card"
            key={recipe.id}
            onClick={() => {
              setSelectedRecipe(recipe);
              setShowModal(true);
            }}
          >
            <img src={recipe.image} alt={recipe.name} className="recipe-img" />
            <h2 className="recipe-name">{recipe.name}</h2>
            <p className="recipe-desc">{recipe.description}</p>
            <button
              className="favorite-btn"
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(recipe.id);
              }}
            >
              {favorites.includes(recipe.id) ? "❤️" : "🤍"}
            </button>
          </div>
        ))}
      </div>

      {showModal && selectedRecipe && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">{selectedRecipe.name}</h2>
            <img src={selectedRecipe.image} alt={selectedRecipe.name} className="modal-image" />
            <p className="modal-description">{selectedRecipe.description}</p>

            <div className="modal-meta">
              <p><strong>Cooking Time:</strong> {selectedRecipe.cooking_time}</p>
              <p><strong>Servings:</strong> {selectedRecipe.servings}</p>
              <p><strong>Notes:</strong> {selectedRecipe.additional_notes}</p>
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
                {selectedRecipe.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>

            <div className="modal-tags">
              {selectedRecipe.tags.map((tag, index) => (
                <span className="tag" key={index}>{tag}</span>
              ))}
            </div>

            <button className="close-button" onClick={() => setShowModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recipes;