# 🌤️ Weather-ML: 7-Day Temperature Forecasting System

A full-stack machine learning weather forecasting platform that predicts the next 7 days of daily average temperatures using time-series ML models and live weather data.

Built with **FastAPI + React 19 + Recharts + MongoDB Atlas + Scikit-Learn**.

---

## ✨ Features & Highlights

- **🧠 Time-Series Machine Learning Pipeline**: Trained model (Random Forest / XGBoost Regressor) using lag features, rolling statistics, and calendar features.
- **📡 Real-Time Data Ingestion**: Live historical and real-time data integration via **Open-Meteo API** with automatic gap handling.
- **🛡️ Resilient Failover Architecture**: Automatic fallback to real-time API queries if MongoDB Atlas connection or DNS resolution is unavailable.
- **🎨 Glassmorphic Modern Dashboard**: Built with custom CSS, Google Fonts (*Outfit*, *Plus Jakarta Sans*, *Inter*), glowing glassmorphism cards, and responsive layouts.
- **📈 Interactive Data Visualizations**: Interactive **Recharts** dashboard supporting both **Gradient Area View** and **Smooth Line View**, custom tooltips, weekly average reference indicators, and click-to-select day highlighting.
- **⚡ One-Command Startup**: Concurrent execution of backend and frontend servers using `npm run dev`.

---

## 🏗️ Tech Stack

| Domain | Technology |
| :--- | :--- |
| **Backend Framework** | [FastAPI](https://fastapi.tiangolo.com/) + Uvicorn |
| **Machine Learning** | Scikit-Learn, Pandas, Joblib |
| **Database** | MongoDB Atlas / PyMongo |
| **Data Ingestion** | Open-Meteo Weather API |
| **Frontend Framework** | React 19, Recharts, Custom Glassmorphism CSS |
| **Dev Tooling** | `concurrently`, Python Virtual Environment |

---

## 📁 Repository Structure

```text
weather-ml/
├── backend/
│   ├── data/
│   │   ├── fetch_weather.py      ← Open-Meteo API ingestion engine
│   │   └── weather_db.py         ← MongoDB upsert & gap-proofing script
│   ├── db/
│   │   └── mongo_loader.py       ← MongoDB database connection helper
│   ├── models/
│   │   └── 7day_temp_model.pkl   ← Serialized ML forecast model
│   ├── notebooks/
│   │   └── trainingModel.ipynb   ← Jupyter notebook for model training
│   ├── main.py                   ← FastAPI REST server & inference endpoint
│   └── config.py                 ← Environment configuration loader
├── frontend/
│   ├── public/                   ← Index HTML & Google Fonts metadata
│   └── src/
│       ├── App.js                ← Glassmorphic Weather Dashboard & Recharts
│       └── App.css               ← Responsive Glassmorphism Design System
├── .env                          ← Environment variables (MongoDB URI & config)
├── package.json                  ← Root package manager & npm scripts
├── requirements.txt              ← Backend Python dependencies
└── README.md
```

---

## 🔌 API Documentation (FastAPI)

### Endpoints

#### 1. Root Health Check
`GET /`

```json
{
  "message": "Weather ML API is running 🚀"
}
```

#### 2. Predict 7-Day Forecast
`GET /predict`

Returns a 7-day temperature forecast starting from the **current date (Today)**:

```json
{
  "forecast": [
    {"date": "2026-08-07", "temperature": 23.79},
    {"date": "2026-08-08", "temperature": 23.69},
    {"date": "2026-08-09", "temperature": 23.63},
    {"date": "2026-08-10", "temperature": 23.68},
    {"date": "2026-08-11", "temperature": 23.67},
    {"date": "2026-08-12", "temperature": 23.64},
    {"date": "2026-08-13", "temperature": 23.68}
  ]
}
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/ravindidhananjana/weather-ml.git
cd weather-ml
```

### 2️⃣ Backend Setup (Python Virtual Environment)

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# Linux / macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3️⃣ Environment Configuration

Create a `.env` file in the root directory:

```env
MONGO_URI="your_mongodb_connection_string"
DB_NAME="weather_database"
COLLECTION_NAME="weather_records"
```

### 4️⃣ Frontend Setup

```bash
cd frontend
npm install
cd ..
```

---

## 🚀 Running the Application

Start both the **FastAPI Backend** and **React Frontend** concurrently from the root directory:

```bash
npm run dev
```

- **Frontend Dashboard**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8000](http://localhost:8000)
- **Interactive Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 📊 Machine Learning Pipeline

1. **Data Collection**: Fetch historical hourly weather records (Temperature, Humidity, Pressure, Wind Speed, Cloud Cover, Rain).
2. **Feature Engineering**:
   - Lag features (`temp_lag_1`, `temp_lag_2`, `temp_lag_3`, `temp_lag_7`, `temp_lag_14`)
   - Rolling statistics (`temp_roll_7`, `temp_roll_14`)
   - Calendar features (`day_of_year`, `month`, `week_of_year`)
3. **Model Inference**: Recursive multi-step daily temperature predictions for the upcoming 7-day horizon.

---

## 📜 License

Distributed under the ISC License.
