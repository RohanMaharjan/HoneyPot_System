import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import Navbar from "../components/Navbar";

function SignupPage() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const validateForm = () => {

    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|outlook|hotmail)\.com$/;

    const passwordRegex =
      /^(?=.*[!@#$%^&*]).{8,}$/;

    if (!name) {
      return "Name is required";
    }

    if (!emailRegex.test(email)) {
      return "Email must be valid (example: user@gmail.com)";
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

      const response = await fetch("http://localhost:5000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        setError(data.message || "Signup failed");
      }

    } catch {
      setError("Server error");
    }
  };

  return (
    <>
      <Navbar />

      <div
        style={{
          minHeight: "90vh",
          backgroundColor: "#121212",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#fff"
        }}
      >

        <form
          onSubmit={handleSubmit}
          style={{
            background: "#1e1e1e",
            padding: "30px",
            borderRadius: "10px",
            width: "100%",
            maxWidth: "300px",
            position: "relative",
            boxShadow: "0 0 15px rgba(0,0,0,0.5)"
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

          <h2
            style={{
              textAlign: "center",
              marginBottom: "20px",
              color: "#00bcd4"
            }}
          >
            Sign Up
          </h2>

          {error && (
            <p style={{ color: "red", fontSize: "14px" }}>
              {error}
            </p>
          )}

          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />

          <button type="submit" style={buttonStyle}>
            Create Account
          </button>

          {/* RULES SECTION */}
          <div style={{ marginTop: "20px", fontSize: "13px", color: "#ccc" }}>
            <p><b>Account Rules:</b></p>
            <ol>
              <li>Email must follow format like <i>user@gmail.com</i></li>
              <li>Allowed domains: gmail.com, yahoo.com, outlook.com, hotmail.com</li>
              <li>Password must contain at least 8 characters</li>
              <li>Password must include at least one special character (!@#$%^&*)</li>
            </ol>
          </div>

        </form>
      </div>
    </>
  );
}

const inputStyle = {
  width: "100%",
  padding: "9px",
  marginBottom: "12px",
  borderRadius: "6px",
  border: "none"
};

const buttonStyle = {
  width: "100%",
  padding: "10px",
  backgroundColor: "#00bcd4",
  border: "none",
  borderRadius: "6px",
  color: "#121212",
  fontWeight: "bold",
  cursor: "pointer"
};

export default SignupPage;