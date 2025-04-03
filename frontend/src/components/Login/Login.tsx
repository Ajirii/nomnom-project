const Login = () => {
  return (
    <div className="row">
      <div className="main">
        <div className="login-container">
          <h2>Login</h2>
          <form>
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
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
