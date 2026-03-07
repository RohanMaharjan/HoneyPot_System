//pool manages multiple connections to the database
const { Pool } = require("pg");

//create database connections
const pool = new Pool({
  user: "Rohan",//database user
  host: "localhost",//database host
  database: "honeypot",//databse name
  password: "rohan",//databse password
  port: 5432,//databse port
});

module.exports = pool;//exports the pool object to be used in other parts of the application