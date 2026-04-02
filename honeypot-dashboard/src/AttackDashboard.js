import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import { useNavigate } from "react-router-dom";
import { Line, Pie } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

function AttackDashboard() {
  const [attacks, setAttacks] = useState([]);
  const [selectedPort, setSelectedPort] = useState("All");
  const navigate = useNavigate();

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

  const getIP = (a) => {
    let ip = a.ip_address || a.ip || "Unknown";
    if (ip === "::1") return "127.0.0.1 (localhost)";
    if (ip.startsWith("::ffff:")) return ip.replace("::ffff:", "");
    return ip;
  };

  const filteredAttacks =
    selectedPort === "All"
      ? attacks
      : attacks.filter(a => String(a.port) === selectedPort);

  const sortedAttacks = [...filteredAttacks].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  const totalAttacks = sortedAttacks.length;

  const uniqueIPs = new Set(
    sortedAttacks.map(a => getIP(a))
  ).size;

  const lastAttack =
    sortedAttacks.length > 0
      ? new Date(sortedAttacks[0].timestamp).toLocaleString()
      : "No Data";

  // LINE CHART
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

  // PIE CHART
  const portCounts = {};
  sortedAttacks.forEach(a => {
    const port = a.port;
    portCounts[port] = (portCounts[port] || 0) + 1;
  });

  const pieData = {
    labels: Object.keys(portCounts),
    datasets: [
      {
        data: Object.values(portCounts),
        backgroundColor: ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"]
      }
    ]
  };

  const attackFeed = sortedAttacks;
  const recentTable = sortedAttacks.slice(0, 10);

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
            </div>
          </div>

          {/* LINE CHART */}
          <div style={styles.panelLight}>
            <h3>Attack Statistics</h3>
            <Line data={chartData} />
          </div>
        </div>

        {/* TABLE + PIE */}
        <div style={styles.grid}>
          {/* TABLE */}
          <div style={styles.panelDark}>
            <h3>Recent Attacks</h3>

            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>#</th>
                    <th style={styles.th}>IP Address</th>
                    <th style={styles.th}>Port</th>
                    <th style={styles.th}>Timestamp</th>
                  </tr>
                </thead>

                <tbody>
                  {recentTable.map((a, i) => (
                    <tr
                      key={i}
                      style={styles.tableRow}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#334155")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <td style={styles.td}>{i + 1}</td>
                      <td style={styles.td}>{getIP(a)}</td>
                      <td style={styles.td}>
                        <span style={styles.portBadge}>{a.port}</span>
                      </td>
                      <td style={styles.td}>
                        {new Date(a.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* PIE */}
          <div style={styles.panelLight}>
            <h3>Port Distribution</h3>
            <Pie
              data={pieData}
              options={{
                plugins: {
                  legend: {
                    position: "right"
                  }
                },
                radius: "70%"
              }}
            />
          </div>
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
    borderRadius: "5px",
    color: "white",
    border: "none",
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
    borderRadius: "10px"
  },

  panelLight: {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "10px",
    color: "black"
  },


  tableWrapper: {
    maxHeight: "300px"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "10px"
  },

  th: {
    padding: "12px",
    textAlign: "left",
    borderBottom: "2px solid #475569",
    color: "#cbd5f5"
  },

  td: {
    padding: "10px",
    borderBottom: "1px solid #334155",
    whiteSpace: "nowrap"
  },

  tableRow: {
    transition: "0.2s"
  },

  portBadge: {
    padding: "4px 8px",
    borderRadius: "5px",
    fontSize: "12px",
    color: "white"
  },

  titleFixed: {
    margin: 0,
    paddingBottom: "10px"
  },

  feedScroll: {
    maxHeight: "350px",
    overflowY: "auto"
  },

  feedCard: {
    background: "#334155",
    padding: "10px",
    borderRadius: "6px",
    marginBottom: "10px"
  }
};