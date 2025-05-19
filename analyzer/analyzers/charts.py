def scatter_chart(data, stat_x, stat_y):
    result = []
    for season, teams in data.items():
        for team in teams:
            if stat_x in team and stat_y in team:
                result.append({
                    "klub": team["klub"],
                    "season": season,
                    "x": team[stat_x],
                    "y": team[stat_y]
                })
    return result