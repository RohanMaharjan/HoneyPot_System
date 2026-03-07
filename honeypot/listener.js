//node.js module to create TCP servers and clients
const net = require("net");

//fake ports to listen up.FTP, SSH, Telnet, HTTP, MySQL
const ports = [21, 22, 23, 80, 3306];

ports.forEach((port) => {//create a TCP server for each port
  const server = net.createServer((socket) => { //create TCP server, socket object represents the connection
    const attackerIP = socket.remoteAddress;//get the IP aaddress of the attacker
    const time = new Date();//get the curent time of the attack

    console.log("Connection detected!");//log the attack details
    console.log("IP:", attackerIP);//log the attacker's IP
    console.log("Port:", port);//log the port
    console.log("Time:", time);//log the time
    console.log("----------------------");

    socket.end();//close the connection after logging the attack
  });

  server.listen(port, () => {//tells node.js to start listening on the ports
    console.log(`Listening on port ${port}`);
  });
});