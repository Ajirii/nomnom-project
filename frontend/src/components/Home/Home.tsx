import { useState } from "react";

const Home = () => {
  const [ingredientInput, setIngredientInput] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [cuisine, setCuisine] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleGenerateRecipe = () => {
    setMessage("");

    if (ingredients.length < 3) {
      setMessage("Dish needs atleast 3 ingredients");
      return;
    }

    if (!cuisine || cuisine === "") {
      setMessage("Please select a cuisine!");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setMessage(` Your ${cuisine} recipe with ${ingredients.join(", ")} is ready! `);
    }, 2000);
  };

  return (
    <div className="row">
      <div className="main">
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
                {ingredient} <span className="remove-tag" onClick={() => removeIngredient(index)}>✖</span>
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
        {message && <p className="retro-message">{message}</p>}
      </div>
    </div>
  );
};

export default Home;
