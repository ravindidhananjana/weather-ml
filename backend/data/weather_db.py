from pymongo import MongoClient, UpdateOne
import fetch_weather as fw
from config import MONGO_URI, DB_NAME, COLLECTION_NAME


# Establish MongoDB connection

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
collection = db[COLLECTION_NAME]


documents = fw.fetch_weather()

# insert documents with gap-proofing using bulk operations

if documents:
    operations = [
        UpdateOne(
            {"time": doc["time"]},  
            {"$set": doc},          
            upsert=True
        )
        for doc in documents
    ]

    result = collection.bulk_write(operations)
    print(f"Processed {result.matched_count + result.upserted_count} documents (gap-proof, bulk).")
else:
    print("No data to insert")

