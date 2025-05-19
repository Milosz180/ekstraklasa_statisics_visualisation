import os
import json

DATA_DIR = "./stats"

def load_all_data():
    all_data = {}
    for filename in os.listdir(DATA_DIR):
        if filename.endswith(".json"):
            season = filename.replace(".json", "")
            with open(os.path.join(DATA_DIR, filename), encoding="utf-8") as f:
                all_data[season] = json.load(f)
    return all_data

def get_season_data(season):
    filepath = os.path.join(DATA_DIR, f"{season}.json")
    if os.path.exists(filepath):
        with open(filepath, encoding="utf-8") as f:
            return json.load(f)
    return []