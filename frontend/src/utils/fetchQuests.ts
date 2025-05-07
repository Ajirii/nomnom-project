import { jwtDecode } from "jwt-decode";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const getUserIdFromToken = (): string => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("User not authenticated");
  const decodedToken: any = jwtDecode(token);
  return decodedToken.userId;
};

export const fetchUserQuests = async (): Promise<{
  quests: any[];
  completedCount: number;
  coins: number;
}> => {
  const userId = getUserIdFromToken();

  const res = await fetch(`${baseUrl}api/quests/user-quest?userId=${userId}`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch user quests");

  const data = await res.json();
  return {
    quests: data.quests || [],
    completedCount: data.completedQuests || 0,
    coins: data.currency ?? 0,
  };
};

export const completeQuest = async (questId: string): Promise<number> => {
  const userId = getUserIdFromToken();

  const res = await fetch(`${baseUrl}api/quests/complete`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ userId, questId }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("Error completing quest:", errText);
    throw new Error("Quest completion failed");
  }

  const { currency } = await res.json();
  return currency;
};

export const acceptQuest = async (questId: string): Promise<void> => {
  const userId = getUserIdFromToken();

  const res = await fetch(`${baseUrl}api/quests/accept`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ userId, questId }),
  });

  if (!res.ok) throw new Error("Failed to accept quest");
};
