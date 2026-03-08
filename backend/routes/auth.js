const express = require("express");
const router = express.Router();//loading database connection pool
const pool = require("../db");
const bcrypt = require("bcrypt");//loading jsonwebtoken library for token generation
const jwt = require("jsonwebtoken");//sekret key for JWT signing

const SECRET = "honeypotsecret";

// Signup
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      "INSERT INTO users (username,email,password) VALUES ($1,$2,$3) RETURNING *",
      [username, email, hashedPassword]
    );

    res.json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Signup failed");
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(401).send("User not found");
    }

    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].password
    );

    if (!validPassword) {
      return res.status(401).send("Invalid password");
    }

    const token = jwt.sign(
      { id: user.rows[0].id },
      SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Login failed");
  }
});

module.exports = router;