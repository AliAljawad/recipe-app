import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { routes } from "../../utils/routes";
import "./styles.css";
import { useEffect } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const userIdFromSession = sessionStorage.getItem('user_id');
    if (userIdFromSession) {
      window.location.href = '/homepage';
    } 
}, []);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = { email, password };

    try {
      const response = await axios.post(
        "http://localhost/recipe-app-backend/users/login.php",
        userData,
        { withCredentials: true } 
      );
      if (response.data.status === "success") {
        sessionStorage.setItem("user_id", response.data.user_id);
        navigate(routes.homePage);
      } else {
        setError(response.data.error || "Login failed. Please try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="form">
      <img src="/assets/images/loginBg.jpg" className="img" alt="background" />
      <div className="login">
        <form onSubmit={handleSubmit} id="loginForm">
          <div className="spacing">
            <p>Welcome Back!</p>
            <p className="header">Log in to your Account</p>
            <label>E-mail</label>
            <input
              type="email"
              required
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>Password</label>
            <input
              type="password"
              required
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="error">{error}</p>}
            <button type="submit" className="login-btn">
              Log in
            </button>
            <p onClick={() => navigate(routes.register)}>
              Don't have an account? Sign up
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
