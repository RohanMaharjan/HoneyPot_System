import React, { useEffect, useState } from "react";

function AttackDashboard() {
  const [attacks, setAttacks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/attacks")
      .then((res) => res.json())
      .then((data) => setAttacks(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Web Attack Dashboard</h1>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>IP Address</th>
            <th>Port</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {attacks.map((attack) => (
            <tr key={attack.id}>
              <td>{attack.id}</td>
              <td>{attack.ip_address}</td>
              <td>{attack.port}</td>
              <td>{new Date(attack.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AttackDashboard;