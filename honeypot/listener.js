//loading net library
const net = require("net");
//node.js module to create TCP servers and clients
const pool = require("../backend/db");

//fake ports to listen up.FTP, SSH, Telnet, HTTP, MySQL
const ports = [21, 22, 23, 80, 3306];

ports.forEach((port) => {//create a TCP server for each port
  const server = net.createServer((socket) => {//create TCP server, socket object represents the connection

    // Handle socket errors BEFORE doing anything else
    socket.on("error", (err) => {
      console.log(`Socket error on port ${port}:`, err.message);
    });

    const attackerIP = socket.remoteAddress;//gget attacker's IP address
    const time = new Date();//get current date and time

    console.log("Connection detected!");//log connection details
    console.log("IP:", attackerIP);//log attacker's IP address
    console.log("Port:", port);//log the port 
    console.log("Time:", time);//log the time of attack
    console.log("----------------------");

    // Insert attack into PostgreSQL
    pool.query(
      "INSERT INTO attack_logs (ip_address, port, timestamp) VALUES ($1, $2, $3)",
      [attackerIP, port, time]
    )
      .then(() => console.log("Stored in database"))
      .catch((err) => console.error("DB ERROR:", err.message));

    // Close socket safely
    socket.end();
  });

  // Handle server-level errors
  server.on("error", (err) => {
    console.error(`Server error on port ${port}:`, err.message);
  });

  server.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
});