import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaEye, FaEyeSlash } from "react-icons/fa";
import Navbar from "../components/Navbar";

function SignupPage() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showPasswordOptions, setShowPasswordOptions] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const domains = [
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "hotmail.com"
  ];

  // Email suggestion handler
  const handleEmailChange = (e) => {

    const value = e.target.value;
    setEmail(value);

    if (value.includes("@")) {

      const namePart = value.split("@")[0];

      const newSuggestions = domains.map(
        (domain) => `${namePart}@${domain}`
      );

      setSuggestions(newSuggestions);

    } else {
      setSuggestions([]);
    }
  };

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

  //password suggestions
  const generateStrongPassword = () => {

  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*";

  const allChars = upper + lower + numbers + symbols;

  let password = "";
  
  password += upper[Math.floor(Math.random() * upper.length)];
  password += lower[Math.floor(Math.random() * lower.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  for (let i = 4; i < 12; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  setPassword(password);
  setShowPasswordOptions(false);
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
            style={{ ...inputStyle, marginTop: "10px", marginBottom: "20px" }}
          />

          {/* Email Input */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            style={inputStyle}
          />

          {/* Email Suggestions */}
          {suggestions.length > 0 && (
            <div
              style={{
                background: "#272727",
                borderRadius: "6px",
                marginBottom: "10px",
                overflow: "hidden",
              }}
            >
              {suggestions.map((item, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setEmail(item);
                    setSuggestions([]);
                  }}
                  style={{
                    padding: "8px",
                    cursor: "pointer",
                    borderBottom: "1px solid #333"
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          )}

          {/* Password input with show/hide toggle and suggestions */}
          <div style={{ position: "relative", marginBottom: "12px", width: "100%" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onFocus={() => setShowPasswordOptions(true)}
              onChange={(e) => setPassword(e.target.value)}
              style={{ ...inputStyle, marginBottom: "0px", paddingRight: "8px", marginTop:"10px" }}
            />

            {/* Eye Icon */}
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "5px",
                marginTop:"5px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#555"
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

            {showPasswordOptions && (
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  marginBottom: "12px"
                }}
              >
                <button
                  type="button"
                  onClick={generateStrongPassword}
                  style={optionButton}
                >
                  Suggest Strong Password
                </button>

                <button
                  type="button"
                  onClick={() => setShowPasswordOptions(false)}
                  style={optionButton}
                    >
                        Create My Own
                      </button>
                    </div>
                  )}

          <button type="submit" style={{ ...buttonStyle, width:"100%", marginBottom:"10px", marginTop:"10px" }}>
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

const optionButton = {
  flex: 1,
  padding: "6px",
  fontSize: "12px",
  backgroundColor: "#333",
  border: "none",
  borderRadius: "6px",
  color: "#fff",
  cursor: "pointer"
};

export default SignupPage;