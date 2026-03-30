// src/pages/LandingPage.js
import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function LandingPage() {
  const navigate = useNavigate();
  // const token = localStorage.getItem("token");

  const handleGetStarted = () => {
    
      navigate("/dashboard");
    
  };

  const features = [
    "Detect port scanning attempts",
    "Monitor web attacks in real-time",
    "Store & analyze attack logs",
    "User authentication for dashboard",
    "Interactive charts and tables"
  ];

  return (
    <>
      <Navbar />

      <div style={{
        minHeight: "90vh",
        backgroundColor: "#121212",
        color: "#fff",
        textAlign: "center",
        padding: "60px 20px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}>
        <h1 style={{ fontSize: "3rem", marginBottom: "20px", color: "#00bcd4" }}>
          Honeypot Web Attack Monitoring System
        </h1>

        <p style={{
          maxWidth: "750px",
          margin: "0 auto 40px",
          fontSize: "1.2rem",
          lineHeight: "1.8",
          color: "#ccc"
        }}>
          Protect your network with real-time detection of port scanning and web attacks. 
          Collect, store, and analyze attack logs to improve security and monitor threats with an interactive dashboard.
        </p>

        <button 
          onClick={handleGetStarted}
          style={{
            backgroundColor: "#00bcd4",
            color: "#121212",
            fontWeight: "bold",
            padding: "12px 30px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            marginBottom: "50px",
            transition: "0.3s"
          }}
          onMouseOver={e => e.currentTarget.style.backgroundColor = "#0097a7"}
          onMouseOut={e => e.currentTarget.style.backgroundColor = "#00bcd4"}
        >
          Get Started
        </button>

        <div style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "20px",
          marginTop: "20px"
        }}>
          {features.map((feature, index) => (
            <div key={index} style={{
              backgroundColor: "#1e1e1e",
              padding: "20px",
              borderRadius: "10px",
              minWidth: "180px",
              maxWidth: "220px",
              color: "#fff",
              fontSize: "16px",
              transition: "0.3s",
              cursor: "default"
            }}
              onMouseOver={e => e.currentTarget.style.backgroundColor = "#272727"}
              onMouseOut={e => e.currentTarget.style.backgroundColor = "#1e1e1e"}
            >
              {feature}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default LandingPage;