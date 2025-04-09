import { useState } from "react";
import RecipeCard from "./RecipeCard"; // Importing the new component

type Recipe = {
  title: string;
  ingredients: string[];
  instructions: string[];
  cookingMinutes: number;
  servings: number;
  notes: string;
};

const Home = () => {
  const [ingredientInput, setIngredientInput] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [cuisine, setCuisine] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null); // Store the generated recipe

  const handleAddIngredient = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && ingredientInput.trim()) {
      e.preventDefault();
      if (!ingredients.includes(ingredientInput.trim())) {
        setIngredients([...ingredients, ingredientInput.trim()]);
      }
      setIngredientInput("");
    }
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleGenerateRecipe = async () => {
    setMessage("");
    setRecipe(null);

    if (ingredients.length < 3) {
      setMessage("Dish needs at least 3 ingredients");
      return;
    }

    if (!cuisine || cuisine === "") {
      setMessage("Please select a cuisine!");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      // Hardcoded Recipe for Testing
      setRecipe({
        title: "Cheesy Fiesta Pizzadilla",
        ingredients: [
          "1 large flour tortilla",
          "1 cup shredded Oaxaca cheese (or mozzarella)",
          "1 medium tomato, diced",
          "1/2 cup refried beans",
          "1/4 cup diced red onion",
          "1 jalapeño, sliced (optional for heat)",
          "1/2 teaspoon ground cumin",
          "1/4 teaspoon smoked paprika",
          "Fresh cilantro, for garnish",
          "Sour cream and salsa, for serving",
        ],
        instructions: [
          "In a small bowl, mix the diced tomato, red onion, cumin, and smoked paprika together. Set aside.",
          "Heat a non-stick skillet over medium heat. Spread the refried beans evenly on one-half of the tortilla.",
          "Layer the shredded Oaxaca cheese on top of the refried beans, followed by the tomato mixture and jalapeño slices (if using).",
          "Fold the tortilla in half to create a half-moon shape and place it in the skillet.",
          "Cook for 3-4 minutes until the bottom is golden and crispy. Carefully flip and cook for another 3-4 minutes until the cheese is melted and the other side is golden.",
          "Remove from the skillet and let it cool for a minute before slicing into wedges.",
          "Garnish with fresh cilantro and serve with sour cream and salsa on the side.",
        ],
        cookingMinutes: 15,
        servings: 2,
        notes:
          "Feel free to add any leftover proteins like shredded chicken or beef to the filling for extra flavor. This dish is a fun cross between pizza and quesadilla, perfect for a quick meal or snack!",
      });
    }, 1000);
    // try {
    //   // Simulating an API request (Replace with actual API call)
    //   const response = await fetch("/api/generate-recipe", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ ingredients, cuisine }),
    //   });
    //   const data = await response.json();
    //   setRecipe(data);
    // } catch (error) {
    //   setMessage("Error fetching recipe. Try again!");
    // }

    // setLoading(false);
  };

  return (
    <div className="row">
      <div className="main">
        <div>{message && <p className="retro-message">{message}</p>}</div>
        <div className="input-container">
          <input
            type="text"
            className="chat-input"
            placeholder="List your ingredients here ..."
            value={ingredientInput}
            onChange={(e) => setIngredientInput(e.target.value)}
            onKeyDown={handleAddIngredient}
          />
          <div className="ingredients-list">
            {ingredients.map((ingredient, index) => (
              <div key={index} className="ingredient-tag">
                {ingredient}{" "}
                <span
                  className="remove-tag"
                  onClick={() => removeIngredient(index)}
                >
                  ✖
                </span>
              </div>
            ))}
          </div>
          <select
            className="cuisine-select"
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
          >
            <option value="">Select your cuisine...</option>
            <option value="italian">Italian</option>
            <option value="mexican">Mexican</option>
            <option value="chinese">Chinese</option>
            <option value="indian">Indian</option>
            <option value="no-preference">No Preference</option>
          </select>
          <button
            className="send-button"
            onClick={handleGenerateRecipe}
            disabled={loading}
          >
            {loading ? "Generating..." : "Send"}
          </button>
        </div>
      </div>

      {/* Recipe Card Wrapper */}
      <div className="recipe-container">
        {recipe && <RecipeCard recipe={recipe} />}
      </div>
    </div>
  );
};

export default Home;
