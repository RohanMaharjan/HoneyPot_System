import React from "react";
import Navbar from "./components/Navbar";
import {
  Line
} from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

function AttackDashboard() {

  const stats = [
    { title: "Total Attacks", value: 125, color: "#3b82f6" },
    { title: "Unique IPs", value: 30, color: "#22c55e" },
    { title: "Recent Attack", value: "5m Ago", color: "#f59e0b" },
    { title: "DB Status", value: "Connected", color: "#ef4444" }
  ];

  const attackFeed = [
    { port: "21 - FTP", ip: "127.0.0.1", time: "13:02:15" },
    { port: "22 - SSH", ip: "127.0.0.1", time: "13:03:10" },
    { port: "80 - HTTP", ip: "127.0.0.1", time: "13:03:30" }
  ];

  const chartData = {
    labels: ["12:50", "12:55", "13:00", "13:05", "13:10"],
    datasets: [
      {
        label: "FTP",
        data: [0, 10, 13, 9, 4],
        borderColor: "#3b82f6"
      },
      {
        label: "SSH",
        data: [0, 5, 3, 4, 8],
        borderColor: "#22c55e"
      },
      {
        label: "Telnet",
        data: [0, 1, 7, 5, 11],
        borderColor: "#f59e0b"
      }
    ]
  };

  return (
    <>
      <Navbar />

      <div style={styles.page}>

        <h2 style={styles.title}>
          Honeypot Web Attack Dashboard
        </h2>

        {/* Top Stats */}
        <div style={styles.statsRow}>
          {stats.map((item, i) => (
            <div
              key={i}
              style={{
                ...styles.card,
                background: item.color
              }}
            >
              <h4>{item.title}</h4>
              <h2>{item.value}</h2>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={styles.filters}>
          <span>Filter by Port:</span>

          {["All", "FTP 21", "SSH 22", "Telnet 23", "HTTP 80", "MySQL 3306"].map((f, i) => (
            <button key={i} style={styles.filterBtn}>
              {f}
            </button>
          ))}
        </div>

        <div style={styles.grid}>

          {/* Live Feed */}
          <div style={styles.panel}>
            <h3>Live Attack Feed</h3>

            {attackFeed.map((attack, i) => (
              <div key={i} style={styles.feedCard}>
                <h4>Port {attack.port}</h4>
                <p>IP: {attack.ip}</p>
                <p>Time: {attack.time}</p>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div style={styles.panel}>
            <h3>Attack Statistics</h3>
            <Line data={chartData} />
          </div>

        </div>

        {/* Recent IP Table */}
        <div style={styles.panel}>
          <h3>Recent IPs</h3>

          <table style={styles.table}>
            <thead>
              <tr>
                <th>IP Address</th>
                <th>Port</th>
                <th>Timestamp</th>
              </tr>
            </thead>

            <tbody>
              {attackFeed.map((attack, i) => (
                <tr key={i}>
                  <td>{attack.ip}</td>
                  <td>{attack.port}</td>
                  <td>{attack.time}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>

      </div>
    </>
  );
}

export default AttackDashboard;

const styles = {

  page: {
    background: "#0f172a",
    minHeight: "100vh",
    color: "white",
    padding: "30px"
  },

  title: {
    marginBottom: "20px"
  },

  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4,1fr)",
    gap: "20px",
    marginBottom: "30px"
  },

  card: {
    padding: "20px",
    borderRadius: "10px"
  },

  filters: {
    marginBottom: "20px"
  },

  filterBtn: {
    margin: "5px",
    padding: "8px 12px",
    background: "#1e293b",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginBottom: "20px"
  },

  panel: {
    background: "#1e293b",
    padding: "20px",
    borderRadius: "10px"
  },

  feedCard: {
    background: "#334155",
    padding: "10px",
    borderRadius: "6px",
    marginBottom: "10px"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse"
  }
};