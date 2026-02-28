from pymongo import MongoClient
import pandas as pd
from config import MONGO_URI, DB_NAME, COLLECTION_NAME
from pymongo import MongoClient



# Function to load weather data from MongoDB and return as a pandas DataFrame

def load_weather_data():
    client = MongoClient(MONGO_URI)
    
    collection = client[DB_NAME][COLLECTION_NAME]

    docs=list(collection.find())

    if not docs:
        raise ValueError("No documents found in the collection.")
    
    df=pd.DataFrame(docs)

    df.drop(columns=['_id'], inplace=True)
    df['time'] = pd.to_datetime(df['time'])
    df=df.sort_values(by='time')

    return df