import pytest
from fastapi.testclient import TestClient
from main import app
from pathlib import Path
import json

client = TestClient(app)

DATA_DIR = Path(__file__).parent / "stats"

# zwracanie dostępnych sezonów
def test_get_seasons():
    response = client.get("/seasons/")
    assert response.status_code == 200
    seasons = response.json()
    assert isinstance(seasons, list)

# pobieranie danych dla danego sezonu
def test_get_season_data():
    files = list(DATA_DIR.glob("sezon-*.json"))
    if not files:
        pytest.skip("No season data files found")
    season_name = files[0].stem.replace("sezon-", "")
    
    response = client.get("/season/", params={"season": season_name})
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    if data:
        assert "klub" in data[0]

# lista nazwa drużyn z danego sezonu
def test_get_teams():
    files = list(DATA_DIR.glob("sezon-*.json"))
    if not files:
        pytest.skip("No season data files found")
    season_name = files[0].stem.replace("sezon-", "")
    
    response = client.get("/teams/", params={"season": season_name})
    assert response.status_code == 200
    teams = response.json()
    assert isinstance(teams, list)
    if teams:
        assert isinstance(teams[0], str)

# zwracanie drużyn dla h2h
def test_get_h2h():
    files = list(DATA_DIR.glob("sezon-*.json"))
    if not files:
        pytest.skip("No season data files found")
    season_name = files[0].stem.replace("sezon-", "")
    with open(files[0], encoding="utf-8") as f:
        data = json.load(f)
    
    if len(data) < 2:
        pytest.skip("Not enough teams in season data for h2h test")
    teams = [data[0]["klub"], data[1]["klub"]]

    response = client.get("/h2h/", params=[("season", season_name), ("teams", teams[0]), ("teams", teams[1])])
    assert response.status_code == 200
    filtered = response.json()
    assert isinstance(filtered, list)
    assert all(team["klub"] in teams for team in filtered)

# dane konkretnej drużyny z sezonu 
def test_get_team_stats():
    files = list(DATA_DIR.glob("sezon-*.json"))
    if not files:
        pytest.skip("No season data files found")
    season_name = files[0].stem.replace("sezon-", "")
    with open(files[0], encoding="utf-8") as f:
        data = json.load(f)
    if not data:
        pytest.skip("No team data in season for test")

    team_name = data[0]["klub"]

    response = client.get("/team-stats/", params={"season": season_name, "team": team_name})
    assert response.status_code == 200
    team_data = response.json()
    assert team_data["klub"] == team_name

    response_404 = client.get("/team-stats/", params={"season": season_name, "team": "nonexistent_team"})
    assert response_404.status_code == 404

# unikalne drużyny dla wszystkich sezonów
def test_get_all_teams():
    response = client.get("/all-teams/")
    assert response.status_code == 200
    all_teams = response.json()
    assert isinstance(all_teams, list)
    if all_teams:
        assert isinstance(all_teams[0], str)

# test błędnego sezonu
def test_invalid_season():
    response = client.get("/season/", params={"season": "1900-01"})
    assert response.status_code == 404

# test bez podanie sezonu 
def test_teams_missing_season_param():
    response = client.get("/teams/")
    assert response.status_code == 422

# test z jedną drużyną
def test_h2h_single_team():
    files = list(DATA_DIR.glob("sezon-*.json"))
    if not files:
        pytest.skip("No season data files found")
    season_name = files[0].stem.replace("sezon-", "")
    with open(files[0], encoding="utf-8") as f:
        data = json.load(f)
    if not data:
        pytest.skip("No data in file")

    team = data[0]["klub"]
    response = client.get("/h2h/", params=[("season", season_name), ("teams", team)])
    assert response.status_code == 200
    assert isinstance(response.json(), list)
