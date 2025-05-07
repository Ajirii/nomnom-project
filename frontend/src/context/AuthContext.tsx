import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  userId: string | null;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  userId: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          console.warn("Token expired");
          localStorage.removeItem("token");
          setIsLoggedIn(false);
          setUserId(null);
        } else {
          setIsLoggedIn(true);
          setUserId(decoded.userId);
        }
      } catch (error) {
        console.error("Invalid token:", error);
        setIsLoggedIn(false);
        setUserId(null);
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, userId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
