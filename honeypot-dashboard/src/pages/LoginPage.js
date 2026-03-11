import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";   // Home icon
import Navbar from "../components/Navbar";

function LoginPage() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const validateForm = () => {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[!@#$%^&*]).{8,}$/;

    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }

    if (!passwordRegex.test(password)) {
      return "Password must be at least 8 characters and include a special character";
    }

    return null;
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {

      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        setError("Invalid credentials");
      }

    } catch {
      setError("Server error");
    }
  };

  return (
    <>
      <Navbar />

      <div style={{
        minHeight: "90vh",
        backgroundColor: "#121212",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#fff"
      }}>

        <form
          onSubmit={handleSubmit}
          style={{
            background: "#1e1e1e",
            padding: "40px",
            borderRadius: "10px",
            width: "350px",
            position: "relative"
          }}
        >

          {/* Home Icon */}
          <FaHome
            onClick={() => navigate("/")}
            style={{
              position: "absolute",
              top: "15px",
              left: "15px",
              cursor: "pointer",
              fontSize: "20px",
              color: "#00bcd4"
            }}
          />

          <h2 style={{
            textAlign: "center",
            marginBottom: "25px",
            color: "#00bcd4"
          }}>
            Login
          </h2>

          {error && (
            <p style={{ color: "red", fontSize: "14px" }}>
              {error}
            </p>
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            required
          />

          <button type="submit" style={buttonStyle}>
            Login
          </button>

        </form>
      </div>
    </>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "15px",
  borderRadius: "6px",
  border: "none"
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  backgroundColor: "#00bcd4",
  border: "none",
  borderRadius: "6px",
  color: "#121212",
  fontWeight: "bold",
  cursor: "pointer"
};

export default LoginPage;