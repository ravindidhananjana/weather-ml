

# 🌦 Weather-ML: 7-Day Temperature Forecasting System

A full-stack machine learning system that predicts the next 7 days of average temperature using historical weather data.

Built with **FastAPI + React + MongoDB + Scikit-learn**.

---

## 🚀 Features

* 📡 Real-time weather data ingestion (Open-Meteo API)
* 🧠 Time-series ML model (Random Forest Regressor)s
* 💾 MongoDB data storage
* ⚡ FastAPI backend (REST API)
* 🎨 React frontend for visualization
* 🔁 Unified startup with `npm run dev`

---

## 🏗️ Tech Stack

### Backend

* FastAPI
* Uvicorn
* Scikit-learn
* Pandas
* MongoDB

### Frontend

* React.js

### Dev Tools

* concurrently (runs backend + frontend together)

---

## 📁 Project Structure

```
weather-ml/
├─ backend/
│  ├── data/
│  │   ├── fetch_weather.py
│  │   └── weather_db.py
│  ├── db/
│  │   └── mongo_loader.py
│  ├── models/
│  │   └── 7day_temp_model.pkl
│  ├── notebooks/
│  │   └── trainingModel.ipynb
│  ├── main.py           ← FastAPI entry point
│  └── config.py         ← Loads MongoDB credentials from .env
├─ frontend/
│  ├── public/
│  └── src/
├─ .env                  ← MongoDB URI & DB config (ignored by Git)
├─ package.json
├─ requirements.txt
└─ README.md
```

---

## 🧠 Machine Learning Pipeline

1. Fetch historical weather data
2. Store data in MongoDB
3. Feature engineering (lag features, rolling averages, calendar features)
4. Train Random Forest Regressor
5. Save model as `.pkl`
6. Load model in FastAPI for inference
7. Return 7-day temperature predictions via API

---

## 🔌 API (FastAPI)

### Run Backend

```bash
cd backend
uvicorn main:app --reload --port 8000
```

### Endpoint

```
GET /predict
```

### Example Response

```json
{
  "forecast": [
    {"date": "2026-02-06", "temperature": 23.45},
    {"date": "2026-02-07", "temperature": 24.12},
    {"date": "2026-02-08", "temperature": 22.87},
    {"date": "2026-02-09", "temperature": 23.01},
    {"date": "2026-02-10", "temperature": 22.65},
    {"date": "2026-02-11", "temperature": 23.78},
    {"date": "2026-02-12", "temperature": 24.05}
  ]
}
```

---

## 🖥️ Frontend

* Runs on: `http://localhost:3000`
* Communicates with FastAPI backend (`http://localhost:8000`)
* Displays 7-day predictions visually

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/ravindidhananjana/weather-ml.git
cd weather-ml
```

### 2️⃣ Backend Setup

* Create a virtual environment:

```bash
python -m venv venv
```

* Activate the environment:

```bash
# Windows
.\venv\Scripts\activate

```

* Install Python dependencies:

```bash
pip install -r requirements.txt
```

* Create a `.env` file in `backend/`:

```text
MONGO_URI=your_mongodb_uri
DB_NAME=weather_database
COLLECTION_NAME=weather_records
```

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
```

* Install concurrently for unified startup (if not already):

```bash
npm install --save-dev concurrently
```

### 4️⃣ Run the Application

```bash
npm run dev
```

* Starts FastAPI backend on port 8000
* Starts React frontend on port 3000
* Loads ML model and serves predictions

---

## 🌐 Application URLs

* Frontend → [http://localhost:3000](http://localhost:3000)
* Backend API → [http://localhost:8000](http://localhost:8000)
* API Docs (Swagger) → [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 📊 Model Details

* Model: Random Forest Regressor
* Target: Average Daily Temperature
* Forecast Horizon: 7 Days
* Framework: Scikit-learn
* Model file: `backend/models/7day_temp_model.pkl`

---

## 🎯 Learning Outcomes

This project demonstrates:

* End-to-end ML deployment
* Time-series forecasting
* REST API development with FastAPI
* Full-stack integration with React
* Database design and usage with MongoDB
* Model serialization & serving

---

## 🔮 Future Improvements

* LSTM or deep learning model for improved accuracy
* Multi-city or global forecasting
* Cloud deployment (Render / AWS)
* Docker containerization
* CI/CD integration

