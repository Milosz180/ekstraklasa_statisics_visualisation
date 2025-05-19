def team_stats_over_seasons(all_data, team_name, stat_key):
    result = []
    for season, teams in all_data.items():
        team = next((t for t in teams if t["klub"] == team_name), None)
        if team and stat_key in team:
            result.append({
                "season": season,
                "value": team[stat_key]
            })
    return result