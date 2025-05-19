def compare_teams(team1, team2, season_data, selected_stats=None):
    stats1 = next((team for team in season_data if team["klub"] == team1), None)
    stats2 = next((team for team in season_data if team["klub"] == team2), None)

    if not stats1 or not stats2:
        return {"error": "Nie znaleziono jednej z drużyn"}

    if not selected_stats:
        selected_stats = ["punkty", "bramki_zdobyte", "bramki_stracone", "xG", "faule", "zolte_kartki"]

    return {
        "team1": {stat: stats1.get(stat) for stat in selected_stats},
        "team2": {stat: stats2.get(stat) for stat in selected_stats},
        "klub1": stats1["klub"],
        "klub2": stats2["klub"]
    }