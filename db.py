from pymongo import MongoClient
import string, random

db = MongoClient(
    "mongodb+srv://AviaxMusic:AviaxMusic@cluster0.qtfk4yn.mongodb.net/?retryWrites=true&w=majority"
).testdb.login


def is_user_exist(email: str, password: str):
    user = db.find_one({"email": email})
    if not user:
        return False

    if user["password"] == password:
        token = get_new_token(email)
        return token
    else:
        return False


def get_new_token(email: str):
    token = "".join(random.choices(string.ascii_letters + string.digits, k=10))
    db.update_one({"email": email}, {"$set": {"token": token}})
    return token


def is_token_exist(token: str): # Check if token exists in the database
    user = db.find_one({"token": token})
    if not user:
        return False
    return True

def create_user(email: str, password: str):
    if db.find_one({"email": email}):
        return False
    db.insert_one({"email": email, "password": password})
    return True
