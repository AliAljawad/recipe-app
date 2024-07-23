import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { routes } from "../../utils/routes";
import { useEffect } from "react";
import "./styles.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState('');
 useEffect(() => {
        const userIdFromSession = sessionStorage.getItem('user_id');
        if (userIdFromSession) {
          window.location.href = '/homepage';
        } 
    }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = { fullname: name, email, password };

    try {
      const response = await axios.post(
        "http://localhost/recipe-app-backend/users/create.php",
        userData
      );
      if (response.data.status === "success") {
        sessionStorage.setItem("user_id", response.data.user_id);
        navigate(routes.login);
      } else {
        setError(
          response.data.error || "Registration failed. Please try again."
        );
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="form">
      <img src="/assets/images/loginBg.jpg" className="img" alt="background" />
      <div className="login">
        <form onSubmit={handleSubmit} id="registerForm">
          <div className="spacing">
            <p>Welcome!</p>
            <p className="header">Create Your Account</p>
            <label>Name</label>
            <input
              type="text"
              required
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
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
              Sign up
            </button>
            <p onClick={() => navigate(routes.login)}>
              Already have an account? Log in
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
