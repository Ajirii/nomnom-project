// app/page.tsx or app/components/Home.tsx
"use client";

import { useState, useRef } from "react";
import RecipeCard from "./RecipeCard";
import { fetchRecipes } from "../../utils/fetchRecipes";
import NormalFace, { NormalFaceHandle } from "../Faces/Normalface";

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
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  const faceRef = useRef<NormalFaceHandle>(null);

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
    faceRef.current?.triggerEyeSwap(); // 👀 Triggers permanent happy eyes

    try {
      const data = await fetchRecipes({
        ingredients,
        cuisine: cuisine === "no-preference" ? "any" : cuisine,
        strict: false,
      });
      setRecipe(data);
    } catch (error) {
      console.error(error);
      setMessage("Error fetching recipe. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recipes-section">
      <NormalFace ref={faceRef} />
      <div className="row">
        <div className="main">
          {message && <p className="retro-message">{message}</p>}

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
              <option value="chinese">Chinese</option>
              <option value="japanese">Japanese</option>
              <option value="indian">Indian</option>
              <option value="french">French</option>
              <option value="mexican">Mexican</option>
              <option value="thai">Thai</option>
              <option value="middle-eastern">Middle Eastern</option>
              <option value="korean">Korean</option>
              <option value="spanish">Spanish</option>
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

        <div className="recipe-container">
          {recipe && <RecipeCard recipe={recipe} />}
        </div>
      </div>
    </div>
  );
};

export default Home;
