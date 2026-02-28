from fastapi import FastAPI, HTTPException
from pymongo import MongoClient
import pandas as pd
import joblib
from datetime import timedelta
from fastapi.middleware.cors import CORSMiddleware
from config import MONGO_URI, DB_NAME, COLLECTION_NAME
from pymongo import MongoClient

app = FastAPI()


origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app = FastAPI(title="7-Day Temperature Forecast API 🚀")

# ---------------- CONFIG ----------------
MONGO_URI = "mongodb+srv://new-user-1:griinor%4078@cluster0.b8x6tip.mongodb.net/?appName=Cluster0"
DB_NAME = "weather_database"
COLLECTION_NAME = "weather_records"

FEATURES = [
    'temperature_2m', 'relative_humidity_2m', 'pressure_msl', 'windspeed_10m',
    'cloudcover', 'rain', 'day_of_year', 'month', 'week_of_year',
    'temp_lag_1', 'temp_lag_2', 'temp_lag_3', 'temp_lag_7', 'temp_lag_14',
    'temp_roll_7', 'temp_roll_14'
]

# ---------------- INIT ----------------
client = MongoClient(MONGO_URI)
collection = client[DB_NAME][COLLECTION_NAME]

model = joblib.load("models/7day_temp_model.pkl")

# ---------------- HELPERS ----------------
def hourly_to_daily(df):
    df = df.set_index("time")
    daily = df.resample("D").agg({
        "temperature_2m": "mean",
        "relative_humidity_2m": "mean",
        "pressure_msl": "mean",
        "windspeed_10m": "mean",
        "cloudcover": "mean",
        "rain": "sum"
    }).dropna()
    daily.reset_index(inplace=True)
    return daily

def create_features(df):
    df = df.sort_values("time").copy()

    # Lags
    df["temp_lag_1"] = df["temperature_2m"].shift(1)
    df["temp_lag_2"] = df["temperature_2m"].shift(2)
    df["temp_lag_3"] = df["temperature_2m"].shift(3)
    df["temp_lag_7"] = df["temperature_2m"].shift(7)
    df["temp_lag_14"] = df["temperature_2m"].shift(14)

    # Rolling stats
    df["temp_roll_7"] = df["temperature_2m"].shift(1).rolling(7).mean()
    df["temp_roll_14"] = df["temperature_2m"].shift(1).rolling(14).mean()

    # Calendar features
    df["day_of_year"] = df["time"].dt.dayofyear
    df["month"] = df["time"].dt.month
    df["week_of_year"] = df["time"].dt.isocalendar().week.astype(int)

    df = df.dropna()
    return df

def recursive_predict(model, last_row, days=7):
    X = pd.DataFrame([last_row[FEATURES]])
    pred = model.predict(X)[0]  
    preds = [round(float(p), 2) for p in pred]
    return preds

# ---------------- API ----------------
@app.get("/")
def root():
    return {"message": "Weather ML API is running 🚀"}

@app.get("/predict")
def predict():
    cursor = collection.find(
        {},
        {"_id": 0, "time": 1, "temperature_2m": 1, "relative_humidity_2m": 1,
         "pressure_msl": 1, "windspeed_10m": 1, "cloudcover": 1, "rain": 1}
    ).sort("time", -1).limit(24 * 40)  # last ~40 days hourly

    data = list(cursor)
    if len(data) < 24 * 20:
        raise HTTPException(400, "Not enough hourly data")

    df = pd.DataFrame(data)
    df["time"] = pd.to_datetime(df["time"])

    # Aggregate to daily + features
    daily_df = hourly_to_daily(df)
    feat_df = create_features(daily_df)
    last_row = feat_df.iloc[-1]

    try:
        predictions = recursive_predict(model, last_row)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

    start_date = daily_df["time"].max() + timedelta(days=1)
    forecast = [
        {"date": (start_date + timedelta(days=i)).strftime("%Y-%m-%d"),
         "temperature": predictions[i]}
        for i in range(len(predictions))
    ]

    return {"forecast": forecast}
