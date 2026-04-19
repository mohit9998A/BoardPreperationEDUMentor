from pymongo import MongoClient
import os
from django.conf import settings

def get_mongo_client():
    # Use environment variables if set, otherwise default to local MongoDB
    mongo_uri = os.environ.get('MONGO_URI', 'mongodb://localhost:27017/')
    # Set a short timeout so the server doesn't hang if MongoDB is down
    client = MongoClient(mongo_uri, serverSelectionTimeoutMS=2000)
    return client

def get_db():
    client = get_mongo_client()
    # Use the 'boardprep' database
    return client['boardprep']

def get_users_collection():
    db = get_db()
    # Use the 'users' collection
    return db['users']
