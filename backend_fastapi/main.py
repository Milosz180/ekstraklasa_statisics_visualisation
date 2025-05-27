import json
from fastapi import FastAPI, Query, HTTPException
from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_DIR = Path(__file__).parent / "stats"

def load_season_data(season: str):
    filename = DATA_DIR / f"sezon-{season}.json"
    if not filename.exists():
        raise HTTPException(status_code=404, detail=f"Sezon {season} nie znaleziony")
    with open(filename, encoding="utf-8") as f:
        data = json.load(f)
    return data

@app.get("/seasons/")
async def get_seasons():
    seasons = []
    for file in DATA_DIR.glob("sezon-*.json"):
        season_name = file.stem.replace("sezon-", "")
        seasons.append(season_name)
    return sorted(seasons)

@app.get("/season/")
async def get_season_data(season: str = Query(..., description="Format: np. 2023-24")):
    data = load_season_data(season)
    return data

@app.get("/teams/")
async def get_teams(season: str = Query(..., description="Sezon np. 2023-24")):
    data = load_season_data(season)
    teams = [team["klub"] for team in data]
    return teams


@app.get("/h2h/")
async def get_h2h(season: str, teams: list[str] = Query(...)):
    data = load_season_data(season)
    filtered = [team for team in data if team["klub"] in teams]
    return filtered

@app.get("/team-stats/")
async def get_team_stats(season: str, team: str):
    data = load_season_data(season)
    for entry in data:
        if entry["klub"] == team:
            return entry
    raise HTTPException(status_code=404, detail=f"Drużyna {team} nie znaleziona w sezonie {season}")

@app.get("/all-teams/")
async def get_all_teams():
    all_teams = set()
    for file in DATA_DIR.glob("sezon-*.json"):
        with open(file, encoding="utf-8") as f:
            data = json.load(f)
            for team in data:
                all_teams.add(team["klub"])
    return sorted(all_teams)