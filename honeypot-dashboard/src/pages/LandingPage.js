// src/pages/LandingPage.js
import React from "react";
import Navbar from "../components/Navbar";

function LandingPage() {
  return (
    <>
      <Navbar />

      <div style={{
        minHeight: "90vh",
        backgroundColor: "#121212",  // dark background
        color: "#ffffff",            // white text
        textAlign: "center",
        padding: "50px 20px"
      }}>
        <h1 style={{ fontSize: "36px", marginBottom: "20px" }}>
          Honeypot Web Attack Monitoring System
        </h1>

        <p style={{
          maxWidth: "700px",
          margin: "0 auto 30px",
          fontSize: "18px",
          lineHeight: "1.6"
        }}>
          This system detects unauthorized network activity such as port scanning 
          and web attacks. It collects attack logs in real-time, analyzes threat patterns, 
          and provides an interactive dashboard for monitoring malicious activities.
        </p>

        <h3 style={{ marginBottom: "15px" }}>Features:</h3>
        <ul style={{
          listStyle: "disc",
          maxWidth: "600px",
          margin: "0 auto",
          textAlign: "left",
          fontSize: "16px",
          lineHeight: "1.8"
        }}>
          <li>Detect port scanning attempts on your network</li>
          <li>Monitor web attacks in real-time</li>
          <li>Store and analyze attack logs in PostgreSQL</li>
          <li>User authentication to protect dashboard access</li>
          <li>Interactive dashboard with charts and tables</li>
        </ul>
      </div>
    </>
  );
}

export default LandingPage;