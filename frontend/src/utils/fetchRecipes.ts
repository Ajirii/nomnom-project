type FetchRecipesParams = {
  ingredients: string[];
  cuisine: string;
  strict: boolean;
};

export const fetchRecipes = async ({
  ingredients,
  cuisine,
  strict,
}: FetchRecipesParams) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const query = new URLSearchParams({
    ingredients: ingredients.join(","),
    cuisine,
    strict: strict.toString(),
  });
  console.log(
    "API URL:",
    `${baseUrl}/api/recipes?ingredients=${ingredients}&cuisine=${cuisine}&strict=${strict}`
  );

  const res = await fetch(`${baseUrl}/api/recipes?${query}`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch recipe");
  }

  return await res.json();
};
