import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

interface LoginProps {
  onLoginSuccess: () => void;
  setActiveComponent: (component: string) => void;
}

const Login = ({ onLoginSuccess, setActiveComponent }: LoginProps) => {
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [user, setUser] = useState<any>(null);
  const { setIsLoggedIn } = useAuth();

  const handleGoogleLogin = async (credentialResponse: any) => {
    const { credential } = credentialResponse;

    if (!credential) return;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}api/login/google`,
        { credential }
      );

      const { user, token } = response.data;

      localStorage.setItem("token", token);
      setUser(user);
      setIsLoggedIn(true);
      setSuccessMessage("Login Successful!");

      if (user.googleId) {
        setSuccessMessage(
          "Your Google account has been linked to your existing account."
        );
      }

      onLoginSuccess();
      setError("");
    } catch (err) {
      setSuccessMessage("");
      setError("Unable to Log In");
      console.error("Login error:", err);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = (document.getElementById("email") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement)
      .value;

    if (!email || !password) {
      setSuccessMessage("");
      setError("Email and password are required");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}api/login/email`,
        { email, password }
      );

      if (
        response.data.message ===
        "This email is associated with a Google account. Please log in with Google."
      ) {
        setError(
          "This email is associated with a Google account. Please log in with Google."
        );
        return;
      }

      setUser(response.data.user);
      localStorage.setItem("token", response.data.token);
      setIsLoggedIn(true);
      setSuccessMessage("Login Successful!");
      onLoginSuccess();
      setError("");
    } catch (err: any) {
      setSuccessMessage("");
      const message = err.response?.data?.message || "Login failed";
      setError(message);
      console.error("Login error:", err);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsLoggedIn(false);
    setSuccessMessage("");
    setError("");
    console.log("User signed out");
  };

  return (
    <div className="login-section">
      <div className="login-row">
        <div className="login-main">
          <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSignIn}>
              <input
                className="login-input"
                type="email"
                id="email"
                placeholder="Email"
                required
              />
              <input
                className="login-input"
                type="password"
                id="password"
                placeholder="Password"
                required
              />
              {!user ? (
                <button className="sign-in" type="submit">
                  Sign In
                </button>
              ) : (
                <button
                  className="sign-in"
                  type="button"
                  onClick={handleSignOut}
                >
                  Sign Out
                </button>
              )}
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => console.log("Login Failed")}
              />
              <p className="sign-up">
                Don’t have an account?{" "}
                <span
                  className="link"
                  onClick={() => setActiveComponent("signup")}
                >
                  Sign Up
                </span>
              </p>
              {error && <div className="error-message">{error}</div>}
              {successMessage && (
                <div className="success-message">{successMessage}</div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
