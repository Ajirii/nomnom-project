import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

const Login = () => {
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const handleGoogleLogin = async (credentialResponse: any) => {
    const { credential } = credentialResponse;

    if (!credential) {
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}api/login/google`,
        { credential }
      );
      console.log("User:", response.data.user);
      setSuccessMessage("Login Successful!");
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
      console.log("User:", response.data.user);
      setSuccessMessage("Login Successful!");
      setError("");
    } catch (err) {
      setSuccessMessage("");
      setError("Incorrect username or password");
      console.error("Login error:", err);
    }

    console.log("Sign In Attempted with", email, password);
  };

  return (
    <div className="row">
      <div className="main">
        <div className="login-container">
          <h2>Login</h2>
          <form onSubmit={handleSignIn}>
            <input
              className="login-input"
              type="email"
              id="email"
              placeholder="Email"
            />
            <input
              className="login-input"
              type="password"
              id="password"
              placeholder="Password"
            />
            <button className="sign-in" type="submit">
              Sign In
            </button>
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => console.log("Login Failed")}
            />
            {error && <div className="error-message">{error}</div>}
            {successMessage && (
              <div className="success-message">{successMessage}</div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
