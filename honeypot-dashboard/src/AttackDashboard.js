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

  // FETCH DATA
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

  // CLEAN IP HANDLER 🔥
  const getIP = (a) => {
    let ip = a.ip_address || a.ip || "Unknown";

    if (ip === "::1") return "127.0.0.1 (localhost)";
    if (ip.startsWith("::ffff:")) return ip.replace("::ffff:", "");

    return ip;
  };

  // FILTER
  const filteredAttacks =
    selectedPort === "All"
      ? attacks
      : attacks.filter(a => String(a.port) === selectedPort);

  // SORT (IMPORTANT 🔥)
  const sortedAttacks = [...filteredAttacks].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  // STATS
  const totalAttacks = sortedAttacks.length;

  const uniqueIPs = new Set(
    sortedAttacks.map(a => getIP(a))
  ).size;

  const lastAttack =
    sortedAttacks.length > 0
      ? new Date(sortedAttacks[0].timestamp).toLocaleString()
      : "No Data";

  // CHART DATA
  const groupByTime = {};

  sortedAttacks.forEach(a => {
    const date = new Date(a.timestamp);
    const label = `${date.getHours()}:00`;
    groupByTime[label] = (groupByTime[label] || 0) + 1;
  });

  const sortedLabels = Object.keys(groupByTime).sort(
    (a, b) => parseInt(a) - parseInt(b)
  );

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

  // FEED + TABLE
  const attackFeed = sortedAttacks;
  const recentTable = sortedAttacks.slice(0, 10);

  return (
    <>
      <Navbar />

      <div style={styles.page}>

        {/* BACK BUTTON */}
        <button onClick={() => navigate("/")} style={styles.backBtn}>
          ← Back to Home
        </button>

        <h2 style={styles.title}>
          Honeypot Attack Monitoring Dashboard
        </h2>

        {/* STATS */}
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

        {/* FILTER */}
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

        {/* GRID */}
        <div style={styles.grid}>

          {/* LIVE FEED */}
          <div style={styles.panelDark}>
            <h3 style={styles.titleFixed}>Live Attack Feed</h3>

            <div style={styles.feedScroll}>
              {attackFeed.map((a, i) => (
                <div key={i} style={styles.feedCard}>
                  <h4>Port {a.port}</h4>
                  <p>IP: {getIP(a)}</p>
                  <p>{new Date(a.timestamp).toLocaleString()}</p>
                </div>
              ))}

              {attackFeed.length === 0 && <p>No data</p>}
            </div>
          </div>

          {/* CHART */}
          <div style={styles.panelLight}>
            <h3>Attack Statistics</h3>
            <Line data={chartData} />
          </div>

        </div>

        {/* TABLE */}
        <div style={styles.panelLight}>
          <h3>Recent Attacks</h3>

          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.left}>#</th>
                <th>IP Address</th>
                <th style={styles.left}>Port</th>
                <th>Timestamp</th>
              </tr>
            </thead>

            <tbody>
              {recentTable.map((a, i) => (
                <tr key={i} style={styles.tableRow}>
                  <td style={styles.center}>{i + 1}</td>
                  <td>{getIP(a)}</td>
                  <td style={styles.center}>{a.port}</td>
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

// STYLES
const styles = {

  page: {
    background: "#0f172a",
    minHeight: "100vh",
    color: "white",
    padding: "30px"
  },

  backBtn: {
    marginBottom: "20px",
    padding: "8px 15px",
    background: "#334155",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
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

  panelDark: {
    background: "#1e293b",
    padding: "20px",
    borderRadius: "10px",
    scrollBehavior: "smooth"  
  },

  panelLight: {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "10px",
    color: "black"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse"
  },

  tableRow: {
    borderBottom: "1px solid #ccc"
  },

  portBadge: {
    background: "#3b82f6",
    padding: "4px 8px",
    borderRadius: "5px",
    fontSize: "12px",
    color: "white"
  },

  titleFixed: {
    margin: 0,
    fontWeight: "bold",
    color: "white",
    paddingBottom: "10px",
  },

  feedScroll: {
    maxHeight: "350px",
    overflowY: "auto",
    scrollBehavior: "smooth"
  },

  feedCard: {
    background: "#334155",
    padding: "10px",
    borderRadius: "6px",
    marginBottom: "10px"
  }


};