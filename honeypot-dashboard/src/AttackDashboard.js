import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import { Line } from "react-chartjs-2";

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

  const [attacks, setAttacks] = useState([]);
  const [selectedPort, setSelectedPort] = useState("All");

  // Fetch Data
  useEffect(() => {
    fetchAttacks();

    const interval = setInterval(() => {
      fetchAttacks();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchAttacks = () => {
    fetch("http://localhost:5000/attacks")
      .then(res => res.json())
      .then(data => setAttacks(data))
      .catch(err => console.error(err));
  };

  // =========================
  // FILTER LOGIC
  // =========================
  const filteredAttacks =
    selectedPort === "All"
      ? attacks
      : attacks.filter(a => String(a.port) === selectedPort);

  // =========================
  // Stats
  // =========================
  const totalAttacks = filteredAttacks.length;

  const uniqueIPs = new Set(filteredAttacks.map(a => a.ip)).size;

  const lastAttack =
    filteredAttacks.length > 0
      ? new Date(filteredAttacks[filteredAttacks.length - 1].timestamp).toLocaleTimeString()
      : "No Data";

  // =========================
  // Chart Data
  // =========================
  const groupByTime = {};

  filteredAttacks.forEach(a => {
    const time = new Date(a.timestamp).getHours() + ":00";

    if (!groupByTime[time]) {
      groupByTime[time] = 0;
    }

    groupByTime[time]++;
  });

  const chartData = {
    labels: Object.keys(groupByTime),
    datasets: [
      {
        label: "Attacks",
        data: Object.values(groupByTime),
        borderColor: "#3b82f6",
        tension: 0.4
      }
    ]
  };

  // Feed + Table
  const attackFeed = filteredAttacks.slice(-5).reverse();
  const recentTable = filteredAttacks.slice(-10).reverse();

  return (
    <>
      <Navbar />

      <div style={styles.page}>

        <h2 style={styles.title}>
          Honeypot Web Attack Dashboard
        </h2>

        {/* Stats */}
        <div style={styles.statsRow}>

          <div style={{ ...styles.card, background: "#3b82f6" }}>
            <h4>Total Attacks</h4>
            <h2>{totalAttacks}</h2>
          </div>

          <div style={{ ...styles.card, background: "#22c55e" }}>
            <h4>Unique IPs</h4>
            <h2>{uniqueIPs}</h2>
          </div>

          <div style={{ ...styles.card, background: "#f59e0b" }}>
            <h4>Last Attack</h4>
            <h2>{lastAttack}</h2>
          </div>

          <div style={{ ...styles.card, background: "#ef4444" }}>
            <h4>DB Status</h4>
            <h2>Connected</h2>
          </div>

        </div>

        {/* Filters */}
        <div style={styles.filters}>
          <span>Filter by Port:</span>

          {["All", "21", "22", "23", "80", "3306"].map((port, i) => (
            <button
              key={i}
              onClick={() => setSelectedPort(port)}
              style={{
                ...styles.filterBtn,
                background: selectedPort === port ? "#3b82f6" : "#1e293b"
              }}
            >
              {port === "All" ? "All" : `Port ${port}`}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div style={styles.grid}>

          {/* Live Feed */}
          <div style={styles.panel}>
            <h3>
              Live Attack Feed (
              {selectedPort === "All" ? "All Ports" : `Port ${selectedPort}`}
              )
            </h3>

            {attackFeed.map((a, i) => (
              <div key={i} style={styles.feedCard}>
                <h4>Port {a.port}</h4>
                <p>IP: {a.ip}</p>
                <p>{new Date(a.timestamp).toLocaleString()}</p>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div style={styles.panel}>
            <h3>Attack Statistics</h3>
            <Line data={chartData} />
          </div>

        </div>

        {/* Table */}
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
              {recentTable.map((a, i) => (
                <tr key={i}>
                  <td>{a.ip}</td>
                  <td>{a.port}</td>
                  <td>{new Date(a.timestamp).toLocaleString()}</td>
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


// Styles
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