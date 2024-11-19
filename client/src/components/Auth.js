import { useState } from "react";
import { useCookies } from "react-cookie";


const Auth = () => {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [error, setError] = useState(null);

  console.log(cookies);

  const viewLogin = (status) => {
    setError(null);
    setIsLogin(status);
  };

  const handleSubmit = async (e, endpoint) => {
    e.preventDefault();
    if (!isLogin && password !== confirmPassword) {
      setError("Make sure passwords match!");
      return;
    }

    const response = await fetch(`http://localhost:8000/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (data.detail) {
      setError(data.detail);
    } else {
      setCookie("Email", data.email);
      setCookie("AuthToken", data.token);
      window.location.reload();
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-container-box">
        <div className="welcome-section">
          <img
            src="https://www.google.com/url?sa=i&url=https%3A%2F%2Frive.app%2Fcommunity%2Ffiles%2F2244-4437-animated-login-screen%2F&psig=AOvVaw2Kf25LFdK9-bDtHDlH9z85&ust=1732111954734000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCLi0w4vK6IkDFQAAAAAdAAAAABAx" // Replace with your image URL
            alt="image"
            className="welcome-img"
          />
          <h1>Welcome to my TodoApp</h1>
          
        </div>

        <form>
          <h3>{isLogin ? "Log in" : "Sign up!"}</h3>
          <input
            type="email"
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          {!isLogin && (
            <input
              type="password"
              placeholder="confirm password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          )}
          <input
            type="submit"
            className="create"
            onClick={(e) => handleSubmit(e, isLogin ? "login" : "signup")}
          />
          {error && <p>{error}</p>}
        </form>

        <div className="auth-options">
          <button
            onClick={() => viewLogin(false)}
            style={{
              backgroundColor: !isLogin ? "rgb(255, 255, 255)" : "rgb(188, 188, 188)",
            }}
          >
            Sign Up
          </button>
          <button
            onClick={() => viewLogin(true)}
            style={{
              backgroundColor: isLogin ? "rgb(255, 255, 255)" : "rgb(188, 188, 188)",
            }}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
