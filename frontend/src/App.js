import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import './App.css';

function App() {
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const city = "Kandy";

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        
        const res = await fetch("/predict");
        console.log("Response status:", res.status);

        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

        const json = await res.json();
        console.log("Forecast JSON:", json);

        const roundedForecast = (json.forecast || []).map((f) => ({
          date: f.date,
          temperature: parseFloat(f.temperature),
        }));

        setForecast(roundedForecast);
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchForecast();
  }, []);

  return (
    <div className="App">
    <div className='overlay'>
      <h2>🌤 7-Day Temperature Forecast – {city}</h2>

      {loading && <p>Loading forecast...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {!loading && !error && forecast.length > 0 && (
        <ResponsiveContainer width="100%" height={300}>
  <LineChart
    data={forecast}
    margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
  >
    <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
    <XAxis 
      dataKey="date" 
      type="category" 
      padding={{ left: 20, right: 20 }}
    />
    <YAxis domain={["dataMin - 1", "dataMax + 1"]} unit="°C" />
    <Tooltip formatter={(value) => `${value} °C`} />
    <Line type="monotone" dataKey="temperature" stroke="#8884d8" strokeWidth={2} />
  </LineChart>
</ResponsiveContainer>
      )}

      {!loading && !error && forecast.length === 0 && (
        <p>No forecast available</p>
      )}
    </div>
  </div>
  );
}

export default App;
