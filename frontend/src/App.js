import React, { useEffect, useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import "./App.css";

function App() {
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [chartType, setChartType] = useState("area"); // "area" | "line"
  
  const city = "Kandy";
  const country = "Sri Lanka";

  const fetchForecast = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const res = await fetch("/predict");
      if (!res.ok) throw new Error(`Server returned HTTP ${res.status}`);

      const json = await res.json();

      const roundedForecast = (json.forecast || []).map((f, idx) => {
        const dateObj = new Date(f.date);
        const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" });
        const formattedDate = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        const temp = parseFloat(f.temperature);

        let condition = "Pleasant";
        let emoji = "🌤️";
        if (temp >= 26) {
          condition = "Warm";
          emoji = "☀️";
        } else if (temp >= 23.5) {
          condition = "Mild";
          emoji = "🌤️";
        } else if (temp >= 20) {
          condition = "Cool";
          emoji = "⛅";
        } else {
          condition = "Chilly";
          emoji = "🌧️";
        }

        return {
          id: idx,
          date: f.date,
          dayName,
          formattedDate,
          temperature: temp,
          condition,
          emoji,
        };
      });

      setForecast(roundedForecast);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message || "Failed to load forecast data from server.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchForecast();
  }, []);

  // Calculated metrics
  const metrics = useMemo(() => {
    if (!forecast || forecast.length === 0) return null;
    const temps = forecast.map((f) => f.temperature);
    const maxTemp = Math.max(...temps);
    const minTemp = Math.min(...temps);
    const avgTemp = (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1);
    
    const maxDay = forecast.find((f) => f.temperature === maxTemp);
    const minDay = forecast.find((f) => f.temperature === minTemp);

    return {
      today: forecast[0],
      maxTemp,
      maxDate: maxDay ? maxDay.formattedDate : "",
      minTemp,
      minDate: minDay ? minDay.formattedDate : "",
      avgTemp,
    };
  }, [forecast]);

  const selectedDay = forecast[selectedIndex] || forecast[0];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <div className="tooltip-date">
            {data.dayName}, {data.formattedDate}
          </div>
          <div className="tooltip-temp">
            {data.emoji} {data.temperature} °C
          </div>
          <div style={{ fontSize: "0.78rem", color: "#94a3b8", marginTop: "0.2rem" }}>
            Condition: {data.condition}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="App">
      <div className="dashboard-container">
        {/* Header Bar */}
        <header className="header-bar">
          <div className="brand-info">
            <div className="brand-icon">🌤️</div>
            <div className="brand-title-group">
              <h1>Weather ML Intelligence</h1>
              <div className="brand-subtitle">
                <span>7-Day Machine Learning Forecast</span>
                <span className="location-badge">📍 {city}, {country}</span>
              </div>
            </div>
          </div>

          <div className="header-actions">
            <div className="status-pill">
              <span className="status-dot"></span>
              <span>ML Model Active</span>
            </div>
            <button
              className={`btn-refresh ${refreshing ? "spinning" : ""}`}
              onClick={() => fetchForecast(true)}
              disabled={loading || refreshing}
              title="Refresh Forecast"
            >
              <span className="refresh-icon">🔄</span>
              <span>{refreshing ? "Updating..." : "Refresh"}</span>
            </button>
          </div>
        </header>

        {/* Main Content Body */}
        {loading ? (
          <div className="state-container">
            <div className="loading-spinner-ring"></div>
            <div className="loading-text">Computing 7-Day ML Forecast...</div>
          </div>
        ) : error ? (
          <div className="error-banner">
            <div className="error-icon">⚠️</div>
            <h3>Unable to fetch forecast</h3>
            <p style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>{error}</p>
            <button
              className="btn-refresh"
              onClick={() => fetchForecast(true)}
              style={{ margin: "1.25rem auto 0 auto" }}
            >
              Try Again
            </button>
          </div>
        ) : forecast.length > 0 ? (
          <>
            {/* Top Metrics Cards */}
            {metrics && (
              <div className="metrics-grid">
                <div className="metric-card">
                  <div className="metric-icon-wrap hero">{selectedDay?.emoji || "🌤️"}</div>
                  <div className="metric-content">
                    <span className="metric-label">Selected Day ({selectedDay?.dayName})</span>
                    <span className="metric-value">{selectedDay?.temperature} °C</span>
                    <span className="metric-sub">{selectedDay?.condition} • {selectedDay?.formattedDate}</span>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-icon-wrap avg">📊</div>
                  <div className="metric-content">
                    <span className="metric-label">Weekly Average</span>
                    <span className="metric-value">{metrics.avgTemp} °C</span>
                    <span className="metric-sub">Mean over 7 days</span>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-icon-wrap max">🔥</div>
                  <div className="metric-content">
                    <span className="metric-label">Highest Temp</span>
                    <span className="metric-value">{metrics.maxTemp} °C</span>
                    <span className="metric-sub">Peak on {metrics.maxDate}</span>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-icon-wrap min">❄️</div>
                  <div className="metric-content">
                    <span className="metric-label">Lowest Temp</span>
                    <span className="metric-value">{metrics.minTemp} °C</span>
                    <span className="metric-sub">Low on {metrics.minDate}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 7-Day Forecast Cards */}
            <section className="forecast-section">
              <div className="section-header">
                <div className="section-title">
                  <span>📅 7-Day Forecast Breakdown</span>
                </div>
              </div>

              <div className="forecast-grid">
                {forecast.map((day, idx) => (
                  <div
                    key={day.date}
                    className={`forecast-card ${selectedIndex === idx ? "active" : ""}`}
                    onClick={() => setSelectedIndex(idx)}
                  >
                    <div className="day-name">{idx === 0 ? "Today" : day.dayName}</div>
                    <div className="day-date">{day.formattedDate}</div>
                    <div className="weather-emoji">{day.emoji}</div>
                    <div className="card-temp">{day.temperature}°C</div>
                    <div className="temp-pill">{day.condition}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Recharts Analytics Card */}
            <section className="chart-card">
              <div className="chart-header">
                <div className="section-title">
                  <span>📈 Temperature Trend Analysis</span>
                </div>
                <div className="view-toggle">
                  <button
                    className={`toggle-btn ${chartType === "area" ? "active" : ""}`}
                    onClick={() => setChartType("area")}
                  >
                    Area View
                  </button>
                  <button
                    className={`toggle-btn ${chartType === "line" ? "active" : ""}`}
                    onClick={() => setChartType("line")}
                  >
                    Line View
                  </button>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={320}>
                {chartType === "area" ? (
                  <AreaChart
                    data={forecast}
                    margin={{ top: 20, right: 20, left: -10, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.6} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.08)" />
                    <XAxis
                      dataKey="dayName"
                      stroke="#94a3b8"
                      tick={{ fill: "#94a3b8", fontSize: 12 }}
                      tickLine={false}
                    />
                    <YAxis
                      domain={["dataMin - 1.5", "dataMax + 1.5"]}
                      unit="°"
                      stroke="#94a3b8"
                      tick={{ fill: "#94a3b8", fontSize: 12 }}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    {metrics && (
                      <ReferenceLine
                        y={parseFloat(metrics.avgTemp)}
                        stroke="#a855f7"
                        strokeDasharray="4 4"
                        label={{
                          value: `Avg: ${metrics.avgTemp}°C`,
                          fill: "#a855f7",
                          fontSize: 11,
                          position: "top",
                        }}
                      />
                    )}
                    <Area
                      type="monotone"
                      dataKey="temperature"
                      stroke="#38bdf8"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#tempGradient)"
                      activeDot={{ r: 7, stroke: "#ffffff", strokeWidth: 2, fill: "#38bdf8" }}
                    />
                  </AreaChart>
                ) : (
                  <LineChart
                    data={forecast}
                    margin={{ top: 20, right: 20, left: -10, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.08)" />
                    <XAxis
                      dataKey="dayName"
                      stroke="#94a3b8"
                      tick={{ fill: "#94a3b8", fontSize: 12 }}
                      tickLine={false}
                    />
                    <YAxis
                      domain={["dataMin - 1.5", "dataMax + 1.5"]}
                      unit="°"
                      stroke="#94a3b8"
                      tick={{ fill: "#94a3b8", fontSize: 12 }}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="temperature"
                      stroke="#a855f7"
                      strokeWidth={3.5}
                      dot={{ r: 4, fill: "#a855f7" }}
                      activeDot={{ r: 8, stroke: "#ffffff", strokeWidth: 2, fill: "#ec4899" }}
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </section>
          </>
        ) : (
          <div className="state-container">
            <p>No forecast data currently available.</p>
          </div>
        )}

        {/* Dashboard Footer */}
        <footer className="dashboard-footer">
          <div>
            <span>Powered by XGBoost Recursive Time-Series Pipeline</span>
          </div>
          <div className="footer-tech">
            <span className="tech-tag">FastAPI</span>
            <span className="tech-tag">React 19</span>
            <span className="tech-tag">Open-Meteo</span>
            <span className="tech-tag">MongoDB</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
