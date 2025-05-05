import React from "react";
import "./RecipeCard.css";

type Recipe = {
  title: string;
  ingredients: string[];
  instructions: string[];
  cookingMinutes: number;
  servings: number;
  notes: string;
};

type RecipeCardProps = {
  recipe: Recipe;
};

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  return (
    <div className="recipe-home-card">
      <h2 className="recipe-title">{recipe.title}</h2>

      <p className="recipe-home-description">{recipe.notes}</p>

      <div className="recipe-home-meta">
        <p>
          <strong>Cooking Time:</strong> {recipe.cookingMinutes} minutes
        </p>
        <p>
          <strong>Servings:</strong> {recipe.servings}
        </p>
      </div>

      <div className="recipe-home-ingredients">
        <h3>Ingredients</h3>
        <ul>
          {recipe.ingredients.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="recipe-home-steps">
        <h3>Steps</h3>
        <ol>
          {recipe.instructions.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default RecipeCard;
