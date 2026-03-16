// auth.js
const express = require("express");
const router = express.Router();
const pool = require("../db"); // PostgreSQL pool
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET = "honeypotsecret";

// ------------------ SIGNUP ------------------
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  // Validate input
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if email already exists
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const newUser = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, hashedPassword]
    );

    // Generate JWT token
    const token = jwt.sign({ id: newUser.rows[0].id }, SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
});

// ------------------ LOGIN ------------------
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const userQuery = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (userQuery.rows.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    const user = userQuery.rows[0];

    // Compare password
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: "1h" });

    res.json({ token });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

module.exports = router;