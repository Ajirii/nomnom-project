import { useState } from "react";

interface Recipe {
  id: number;
  name: string;
  ingredients: string;
  description: string;
}

const recipeDetails = [
  {
    id: 1,
    name: "Pudding",
    ingredients:
      "2 eggs, 1 tablespoon of butter, 1/3 cup of sugar, 3 tablespoons of cornstarch, 1/8 teaspoon of salt, 2 cups of milk, 1 teaspoon vanilla extract",
    description:
      "Mix everything together, cook it, store it in the fridge until its cold and it's done!",
  },
  {
    id: 2,
    name: "Fried Rice",
    ingredients:
      "4 cups of rice, 3-4 tablespoons of soy sauce, 2 eggs, any vegetables",
    description: "Put everything in a pan and viola!",
  },
  {
    id: 3,
    name: "Tomato Pasta",
    ingredients:
      "1 can of tomatoes, any pasta noodles, salt to taste, 4 gloves of garlic, 1 tablespoon of chopped basil, 1/4 cup of parmesan cheese",
    description: "Boil the pasta, cook the rest.",
  },
  {
    id: 4,
    name: "Miso Soup",
    ingredients:
      "2 cups of water, 1 tablespoon of miso, 1 tsp hondashi, green onion",
    description: "Toss it in, mix, and its ready to eat!",
  },
];

const Recipes = () => {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  return (
    <div id="quests">
      <div className="row">
        <div className="main">
          <div className="recipe-container">
            <div className="master">
              <h2>Recipe Collection</h2>
              <ul>
                {recipeDetails.map((recipe) => (
                  <li
                    key={recipe.id}
                    onClick={() => setSelectedRecipe(recipe)}
                    className={selectedRecipe?.id === recipe.id ? "active" : ""}
                  >
                    {recipe.name}
                  </li>
                ))}
              </ul>
            </div>

            <div className="detail">
              {selectedRecipe ? (
                <div>
                  <h2>{selectedRecipe.name}</h2>
                  <p>
                    <strong>Ingredients:</strong> {selectedRecipe.ingredients}
                  </p>
                  <p>
                    <strong>Description:</strong> {selectedRecipe.description}
                  </p>
                </div>
              ) : (
                <p className="placeholder">Select a recipe to view details</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recipes;
