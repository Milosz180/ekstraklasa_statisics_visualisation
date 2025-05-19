from flask import Flask, jsonify, request
from data_loader import load_all_data, get_season_data
from analyzers.h2h import compare_teams
from analyzers.season_chart import team_stats_over_seasons
from analyzers.charts import scatter_chart

app = Flask(__name__)
all_data = load_all_data()

@app.route("/api/h2h", methods=["GET"])
def h2h():
    season = request.args.get("season")
    team1 = request.args.get("team1")
    team2 = request.args.get("team2")
    stats = request.args.getlist("stats")

    season_data = get_season_data(season)
    result = compare_teams(team1, team2, season_data, stats)
    return jsonify(result)

@app.route("/api/season_chart", methods=["GET"])
def season_chart():
    team = request.args.get("team")
    stat = request.args.get("stat")
    result = team_stats_over_seasons(all_data, team, stat)
    return jsonify(result)

@app.route("/api/scatter_chart", methods=["GET"])
def scatter():
    stat_x = request.args.get("x")
    stat_y = request.args.get("y")
    result = scatter_chart(all_data, stat_x, stat_y)
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)