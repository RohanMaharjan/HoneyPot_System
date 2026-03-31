import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  // =========================
  // FETCH DATA
  // =========================
  useEffect(() => {
    fetchAttacks();

    const interval = setInterval(fetchAttacks, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchAttacks = async () => {
    try {
      const res = await fetch("http://localhost:5000/attacks");
      const data = await res.json();
      setAttacks(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  // =========================
  // SAFE IP HANDLER 🔥
  // =========================
  const getIP = (a) => {
    return a.ip_address || a.ip || "Unknown";
  };

  // =========================
  // FILTER LOGIC
  // =========================
  const filteredAttacks =
    selectedPort === "All"
      ? attacks
      : attacks.filter(a => String(a.port) === selectedPort);

  // =========================
  // STATS
  // =========================
  const totalAttacks = filteredAttacks.length;

  const uniqueIPs = new Set(
    filteredAttacks.map(a => getIP(a))
  ).size;

  const lastAttack =
    filteredAttacks.length > 0
      ? new Date(filteredAttacks[0].timestamp).toLocaleString()
      : "No Data";

  // =========================
  // CHART DATA (Sorted 🔥)
  // =========================
  const groupByTime = {};

  filteredAttacks.forEach(a => {
    const date = new Date(a.timestamp);
    const label = `${date.getHours()}:00`;

    groupByTime[label] = (groupByTime[label] || 0) + 1;
  });

  const sortedLabels = Object.keys(groupByTime).sort((a, b) => {
    return parseInt(a) - parseInt(b);
  });

  const chartData = {
    labels: sortedLabels,
    datasets: [
      {
        label: "Attacks per Hour",
        data: sortedLabels.map(l => groupByTime[l]),
        borderColor: "#3b82f6",
        backgroundColor: "#3b82f6",
        tension: 0.4
      }
    ]
  };

  // =========================
  // FEED + TABLE
  // =========================
  const attackFeed = filteredAttacks.slice(0, 5);
  const recentTable = filteredAttacks.slice(0, 10);

  return (
    <>
      <Navbar />

      <div style={styles.page}>
        <button onClick={() => navigate("/")} style={styles.backBtn}>
          ← Back to Home
        </button>

        <h2 style={styles.title}>
          Honeypot Attack Monitoring Dashboard
        </h2>

        {/* ========================= */}
        {/* STATS */}
        {/* ========================= */}
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
            <h2>{attacks.length > 0 ? "Active" : "No Data"}</h2>
          </div>

        </div>

        {/* ========================= */}
        {/* FILTER */}
        {/* ========================= */}
        <div style={styles.filters}>
          <span style={{ marginRight: "10px" }}>Filter by Port:</span>

          {["All", "21", "22", "23", "80", "3306"].map((port, i) => (
            <button
              key={i}
              onClick={() => setSelectedPort(port)}
              style={{
                ...styles.filterBtn,
                background:
                  selectedPort === port ? "#3b82f6" : "#1e293b"
              }}
            >
              {port === "All" ? "All" : `Port ${port}`}
            </button>
          ))}
        </div>

        {/* ========================= */}
        {/* GRID */}
        {/* ========================= */}
        <div style={styles.grid}>

          {/* LIVE FEED */}
          <div style={styles.panel}>
            <h3>
              Live Attack Feed (
              {selectedPort === "All" ? "All Ports" : `Port ${selectedPort}`}
              )
            </h3>

            {attackFeed.map((a, i) => (
              <div key={i} style={styles.feedCard}>
                <h4>Port {a.port}</h4>
                <p>IP: {getIP(a)}</p>
                <p>{new Date(a.timestamp).toLocaleString()}</p>
              </div>
            ))}

            {attackFeed.length === 0 && <p>No data</p>}
          </div>

          {/* CHART */}
          <div style={styles.panel}>
            <h3>Attack Statistics</h3>
            <Line data={chartData} />
          </div>

        </div>

        {/* ========================= */}
        {/* TABLE */}
        {/* ========================= */}
        <div style={styles.panel}>
          <h3>Recent Attacks</h3>

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
                  <td>{getIP(a)}</td>
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

// =========================
// STYLES
// =========================
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
  },

  backBtn: {
  marginBottom: "20px",
  padding: "8px 15px",
  background: "#334155",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
}

};