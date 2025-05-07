import { jwtDecode } from "jwt-decode";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

interface Cosmetic {
  cosmeticId: string;
  name: string;
  description: string;
  iconUrl: string;
  price: number;
}

interface FetchCosmeticsResult {
  allCosmetics: Cosmetic[];
  unlockedMap: Record<string, boolean>;
  coins: number;
  hunger: number;
  userId: string;
}

interface UserCosmeticEntry {
  cosmeticId: string;
  isUnlocked: boolean;
}

export const fetchCosmetics = async (): Promise<FetchCosmeticsResult> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("User not authenticated");

  const decodedToken: any = jwtDecode(token);
  const userId = decodedToken.userId;
  if (!userId) throw new Error("User ID not found in token");

  const unlockedRes = await fetch(`${baseUrl}api/cosmetics/user/${userId}`, {
    headers: getAuthHeaders(),
  });

  if (!unlockedRes.ok) {
    const errText = await unlockedRes.text();
    console.error("Error fetching user cosmetics:", errText);
    throw new Error("Failed to fetch user cosmetics");
  }

  const userData = await unlockedRes.json();

  const unlockedMap: Record<string, boolean> = {};
  const userCosmetics = userData.cosmetics as UserCosmeticEntry[];
  userCosmetics.forEach((entry) => {
    unlockedMap[entry.cosmeticId] = entry.isUnlocked;
  });

  const allRes = await fetch(`${baseUrl}api/cosmetics`, {
    headers: getAuthHeaders(),
  });

  if (!allRes.ok) {
    const errText = await allRes.text();
    console.error("Error fetching all cosmetics:", errText);
    throw new Error("Failed to fetch all cosmetics");
  }

  const allCosmeticsRaw = await allRes.json();

  if (!Array.isArray(allCosmeticsRaw)) {
    console.error(
      "Expected cosmetics response to be an array, got:",
      allCosmeticsRaw
    );
    throw new Error("Invalid cosmetics format");
  }

  const allCosmetics: Cosmetic[] = allCosmeticsRaw.filter((c, index) => {
    const isValid =
      c &&
      typeof c.cosmeticId === "string" &&
      typeof c.name === "string" &&
      typeof c.iconUrl === "string" &&
      typeof c.price === "number";
    if (!isValid) {
      console.warn("Invalid cosmetic at index", index, c);
    }
    return isValid;
  });

  return {
    allCosmetics,
    unlockedMap,
    coins: userData.currency ?? 0,
    hunger: userData.hunger ?? 0,
    userId,
  };
};

export const purchaseCosmetic = async (cosmeticId: string): Promise<any> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("User not authenticated");

  const decodedToken: any = jwtDecode(token);
  const userId = decodedToken.userId;
  if (!userId) throw new Error("User ID not found in token");

  const res = await fetch(`${baseUrl}api/cosmetics/user/buy/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ userId, cosmeticId }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("Error purchasing cosmetic:", errText);
    throw new Error("Failed to purchase cosmetic");
  }

  const purchasedCosmetic = await res.json();
  return purchasedCosmetic;
};
