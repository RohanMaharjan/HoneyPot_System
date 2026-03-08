//loading express library
const express = require("express");
//postgreSQL connetion pool
const pool = require("./db");
//loading cors library to allow react frontend to call backend
const cors = require("cors");
//loading auth routes
const authRoutes = require("./routes/auth");

const app = express();//create express app
app.use(cors());//enable cors for all routes
app.use(express.json());//middleware to purse JSON bodies
app.use("/auth", authRoutes);//use auth routes for auth endpoints

//get all attacks logs
app.get("/attacks", async (req, res) => {
  try {
    const attacks = await pool.query("SELECT * FROM attack_logs ORDER BY timestamp DESC");
    res.json(attacks.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));