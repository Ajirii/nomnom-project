const baseUrl = import.meta.env.VITE_API_BASE_URL;

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem("token");
  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
};

export const fetchCosmetics = async () => {
  const url = `${baseUrl}api/cosmetics`;

  const res = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch cosmetics");
  }

  return await res.json();
};
