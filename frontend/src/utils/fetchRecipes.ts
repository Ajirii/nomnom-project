type FetchRecipesParams = {
  ingredients: string[];
  cuisine: string;
  strict: boolean;
};

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem("token");
  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
};

export const fetchRecipes = async ({
  ingredients,
  cuisine,
  strict,
}: FetchRecipesParams) => {
  const query = new URLSearchParams({
    ingredients: ingredients.join(","),
    cuisine,
    strict: strict.toString(),
  });

  const url = `${baseUrl}api/recipes?${query.toString()}`;
  console.log("API URL:", url);

  const res = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch recipe");
  }

  return await res.json();
};

export const fetchAllRecipes = async () => {
  const url = `${baseUrl}api/recipes/all`;
  const res = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch all recipes");
  }

  return await res.json();
};
