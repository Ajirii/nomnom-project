import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

interface SignUpProps {
  onSignUpSuccess: () => void;
}

const SignUp = ({ onSignUpSuccess }: SignUpProps) => {
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { setIsLoggedIn } = useAuth();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setSuccessMessage("");
      setError("All fields are required.");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}api/login/register`,
        { email, password }
      );

      const { user, token } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setIsLoggedIn(true);
      setSuccessMessage("Sign Up Successful!");
      onSignUpSuccess();
      setError("");
    } catch (err: any) {
      setSuccessMessage("");
      const message = err.response?.data?.message || "Sign Up failed";
      setError(message);
      console.error("Sign Up error:", err);
    }
  };

  return (
    <div className="signup-section">
      <div className="row">
        <div className="main">
          <div className="login-container">
            <h2>Sign Up</h2>
            <form onSubmit={handleSignUp}>
              <input
                className="login-input"
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
              />
              <input
                className="login-input"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
              <button className="sign-in" type="submit">
                Sign Up
              </button>
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

export default SignUp;
