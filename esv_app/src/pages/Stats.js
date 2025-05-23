import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const DEFAULT_STATS = [
  "punkty",
  "zwyciestwa",
  "remisy",
  "porazki",
  "bramki_zdobyte",
  "bramki_stracone",
  "bilans_bramkowy",
];

const Stats = () => {
  // stany podstawowe
  const [mode, setMode] = useState("h2h");
  const [data, setData] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState("");
  const [selectedTeams, setSelectedTeams] = useState(["", ""]);
  const [selectedStats, setSelectedStats] = useState(DEFAULT_STATS);
  // stany tryb: sezon po sezonie
  const [trendTeams, setTrendTeams] = useState([]);
  const [trendStat, setTrendStat] = useState("punkty");
  const [trendData, setTrendData] = useState({});

  // pobieranie listy zespołów
  useEffect(() => {
    fetch("/seasons/")
      .then((res) => res.json())
      .then(setSeasons)
      .catch(console.error);
  }, []);

  // pobieranie drużyn dla danego sezonu
  useEffect(() => {
    if (!selectedSeason) {
      setTeams([]);
      setSelectedTeams(["", ""]);
      return;
    }
    fetch(`/teams/?season=${encodeURIComponent(selectedSeason)}`)
      .then((res) => res.json())
      .then(setTeams)
      .catch(console.error);
  }, [selectedSeason]);

  // 3. pobieranie danych H2H
  useEffect(() => {
    if (
      mode !== "h2h" ||
      !selectedSeason ||
      !selectedTeams[0] ||
      !selectedTeams[1] ||
      selectedTeams[0] === selectedTeams[1]
    ) {
      setData([]);
      return;
    }

    // query z parametrami teams
    const params = new URLSearchParams();
    params.append("season", selectedSeason);
    params.append("teams", selectedTeams[0]);
    params.append("teams", selectedTeams[1]);

    fetch(`/h2h/?${params.toString()}`)
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, [mode, selectedSeason, selectedTeams]);

  // Pomocnik h2h - pobieranie danych drużyn z tabeli
  const getTeamData = (team) => data.find((d) => d.klub === team);

  // pobieranie danych sezon po sezonie
  useEffect(() => {
    if (mode !== "season-trend") return;

      Promise.all(
      seasons.map((season) =>
        fetch(`/teams/?season=${encodeURIComponent(season)}`)
          .then((res) => res.json())
          .catch(() => [])
      )
    ).then((seasonTeamsArrays) => {
      // usuwanie duplikatów
      const allTeams = [...new Set(seasonTeamsArrays.flat())];
      setTeams(allTeams);
    });
  }, [mode, seasons]);

  useEffect(() => {
  if (mode !== "season-trend" || trendTeams.length === 0 || !trendStat) {
    setTrendData({});
    return;
  }

  const fetchTrendData = async () => {
    const trendResults = {};

    for (const team of trendTeams) {
      const teamData = [];

      for (const season of seasons) {
        try {
          const res = await fetch(`/team-stats/?season=${encodeURIComponent(season)}&team=${encodeURIComponent(team)}`);
          const json = await res.json();
          
          const value = json[trendStat];
          teamData.push({ x: season, y: typeof value === "number" ? value : null });
          } catch (err) {
            teamData.push({ x: season, y: null });
          }
        }

        trendResults[team] = teamData;
      }

      setTrendData(trendResults);
    };

    fetchTrendData();
  }, [trendTeams, trendStat, seasons, mode]);

  return (
    <div className="p-4 space-y-6">
      {/* tryby do wyboru: H2H, sezon po sezonie i ......... */}
      <div className="flex space-x-4 mb-4">
        {/* h2h */}
        <button
          onClick={() => setMode("h2h")}
          className={`btn ${mode === "h2h" ? "bg-blue-500 text-white" : ""}`}
        >
          Statystyki H2H
        </button>
        {/* sezon po sezonie */}
        <button
          onClick={() => setMode("season-trend")}
          className={`btn ${mode === "season-trend" ? "bg-blue-500 text-white" : ""}`}
        >
          Sezon po sezonie
        </button>
      </div>

    {/* panel trybu - H2H */}
      {mode === "h2h" && (
        <div className="space-y-4">
          {/* Sezon i drużyny */}
          <div>
            <label className="block mb-1 font-semibold">Wybierz sezon:</label>
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">-- wybierz sezon --</option>
              {seasons.map((season) => (
                <option key={season} value={season}>
                  {season}
                </option>
              ))}
            </select>
          </div>

          <div className="flex space-x-4">
            {[0, 1].map((idx) => (
              <div key={idx} className="flex-1">
                <label className="block mb-1 font-semibold">
                  Wybierz drużynę {idx + 1}:
                </label>
                <select
                  value={selectedTeams[idx]}
                  onChange={(e) => {
                    const updated = [...selectedTeams];
                    updated[idx] = e.target.value;
                    setSelectedTeams(updated);
                  }}
                  className="border p-2 rounded w-full"
                  disabled={!selectedSeason}
                >
                  <option value="">-- wybierz drużynę --</option>
                  {teams.map((team) => (
                    <option key={team} value={team}>
                      {team}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          {/* lista statystyk */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {(data[0]
              ? Object.keys(data[0]).filter(
                  (key) =>
                    typeof data[0][key] === "number" || key.includes("procent")
                )
              : []
            ).map((stat) => (
              <label key={stat} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedStats.includes(stat)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedStats([...selectedStats, stat]);
                    } else {
                      setSelectedStats(selectedStats.filter((s) => s !== stat));
                    }
                  }}
                />
                <span>{stat}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Tabela H2H */}
      {mode === "h2h" && data.length === 2 && (
        <div className="overflow-auto mt-4">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border p-2">Statystyka</th>
                {selectedTeams.map((team, idx) => (
                  <th key={idx} className="border p-2">
                    {team}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {selectedStats.map((stat) => (
                <tr key={stat}>
                  <td className="border p-2 font-bold">{stat}</td>
                  {selectedTeams.map((team, idx) => {
                    const record = getTeamData(team);
                    return (
                      <td key={idx} className="border p-2">
                        {record ? record[stat] ?? "—" : "—"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    {/* panel trybu - sezon po sezonie */}
      {mode === "season-trend" && (
        <div className="space-y-4">
          {/* Wybór drużyn */}
          <div>
            <label className="block mb-1 font-semibold">Wybierz drużyny:</label>
            <select
              multiple
              className="border p-2 rounded w-full"
              value={trendTeams}
              onChange={(e) =>
                setTrendTeams(Array.from(e.target.selectedOptions, (o) => o.value))
              }
            >
              {teams.map((team) => (
                <option key={team} value={team}>
                  {team}
                </option>
              ))}
            </select>
          </div>

          {/* wybór statystyki */}
          <div>
            <label className="block mb-1 font-semibold">Statystyka:</label>
            <select
              className="border p-2 rounded w-full"
              value={trendStat}
              onChange={(e) => setTrendStat(e.target.value)}
            >
              {DEFAULT_STATS.map((stat) => (
                <option key={stat} value={stat}>
                  {stat}
                </option>
              ))}
            </select>
          </div>

          {/* wykres liniowy */}
          {Object.keys(trendData).length > 0 && (
            <div className="mt-6">
              <Line
                data={{
                  labels: seasons,
                  datasets: Object.entries(trendData).map(([team, values], idx) => ({
                    label: team,
                    data: values.map((v) => v.y),
                    fill: false,
                    borderColor: `hsl(${(idx * 360) / trendTeams.length}, 70%, 50%)`,
                    backgroundColor: `hsl(${(idx * 360) / trendTeams.length}, 70%, 50%)`,
                  })),
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: "top",
                    },
                  },
                  scales: {
                    x: {
                      title: {
                        display: true,
                        text: "Sezon",
                      },
                    },
                    y: {
                      title: {
                        display: true,
                        text: trendStat,
                      },
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Stats;
