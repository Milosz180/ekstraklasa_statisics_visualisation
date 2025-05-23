import React, { useState, useEffect } from "react";
import Select from "react-select";
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
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [selectedStats, setSelectedStats] = useState(DEFAULT_STATS);
  // stany tryb: sezon po sezonie
  const [trendTeams, setTrendTeams] = useState([]);
  const [trendStat, setTrendStat] = useState("punkty");
  const [trendData, setTrendData] = useState({});
  const [trendStatOptions, setTrendStatOptions] = useState([]);
  
  // opcja wyboru wielokrotnego na rozwijanych listach
  const options = teams.map((team) => ({ value: team, label: team }));

  // opcja statystyk na podstawie danych
  const allStatKeys = new Set();
  data.forEach((teamStats) => {
    Object.entries(teamStats).forEach(([key, value]) => {
      if (typeof value === "number" || key.includes("procent")) {
        allStatKeys.add(key);
      }
    });
  });
  const statOptions = (data.length > 0
    ? Array.from(allStatKeys)
    : DEFAULT_STATS
  ).map((stat) => ({ value: stat, label: stat }));

  // pobieranie listy zespołów
  useEffect(() => {
    if (seasons.length > 0) return;
    fetch("/seasons/")
      .then((res) => res.json())
      .then(setSeasons)
      .catch(console.error);
  }, [mode]);

  useEffect(() => {
    if (seasons.length > 0 && !selectedSeason) {
      setSelectedSeason(seasons[0]);
    }
  }, [seasons]);

  // reset statystyk po ładowaniu danych
  useEffect(() => {
    if (data.length > 0) {
      const allStatKeys = new Set();
      data.forEach((teamStats) => {
        Object.entries(teamStats).forEach(([key, value]) => {
          if (typeof value === "number" || key.includes("procent")) {
            allStatKeys.add(key);
          }
        });
      });

      const updatedStats = Array.from(allStatKeys);
      setSelectedStats((prev) =>
        prev.filter((stat) => updatedStats.includes(stat)).length > 0
          ? prev.filter((stat) => updatedStats.includes(stat))
          : updatedStats.slice(0, 5)
      );
    }
  }, [data]);

  // pobieranie drużyn dla danego sezonu
  useEffect(() => {
    if (!selectedSeason) {
      setTeams([]);
      setSelectedTeams([]);
      return;
    }
    fetch(`/teams/?season=${encodeURIComponent(selectedSeason)}`)
      .then((res) => res.json())
      .then(setTeams)
      .catch(console.error);
  }, [selectedSeason]);

  // pobieranie danych H2H
  useEffect(() => {
    if (
      mode !== "h2h" ||
      !selectedSeason ||
      selectedTeams.length === 0 ||
      new Set(selectedTeams).size !== selectedTeams.length
    ) {
      setData([]);
      return;
    }

    // query z parametrami teams
    const params = new URLSearchParams();
    params.append("season", selectedSeason);
    selectedTeams.forEach((team) => params.append("teams", team));

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
    if (seasons.length === 0 || teams.length === 0) return;

    const firstSeason = seasons[0];
    const firstTeam = teams[0];

    if (!firstTeam) {
      setTrendStatOptions(DEFAULT_STATS.map(stat => ({ value: stat, label: stat })));
      return;
    }

    fetch(`/team-stats/?season=${encodeURIComponent(firstSeason)}&team=${encodeURIComponent(firstTeam)}`)
      .then(res => res.json())
      .then(data => {
        if (data && typeof data === "object") {
          const stats = Object.keys(data).filter(key => typeof data[key] === "number" || key.includes("procent"));
          setTrendStatOptions(stats.map(stat => ({ value: stat, label: stat })));
          if (!stats.includes(trendStat)) {
            setTrendStat(stats[0] || DEFAULT_STATS[0]);
          }
        } else {
          setTrendStatOptions(DEFAULT_STATS.map(stat => ({ value: stat, label: stat })));
        }
      })
      .catch(() => {
        setTrendStatOptions(DEFAULT_STATS.map(stat => ({ value: stat, label: stat })));
      });
  }, [mode, seasons, teams]);

  useEffect(() => {
  if (mode !== "season-trend" || trendTeams.length === 0) {
    setTrendData({});
    return;
  }

  // pobieranie danych dla drużyn
  const fetchAll = async () => {
    const newTrendData = {};

    for (const team of trendTeams) {
      newTrendData[team] = [];

      for (const season of seasons) {
        try {
          const res = await fetch(
            `/team-stats/?season=${encodeURIComponent(season)}&team=${encodeURIComponent(team)}`
          );

          if (res.ok) {
            const data = await res.json();
            const y = data?.[trendStat] ?? null;
            newTrendData[team].push({ x: season, y });
          } else {
            newTrendData[team].push({ x: season, y: null }); // brak danych
          }
        } catch (e) {
          newTrendData[team].push({ x: season, y: null });
        }
      }
    }

      setTrendData(newTrendData);
    };

    fetchAll();
  }, [mode, trendTeams, trendStat, seasons]);

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
          <div>
            <label className="block mb-1 font-semibold">Wybierz drużyny:</label>
            <Select
              isMulti
              options={options}
              value={options.filter((o) => selectedTeams.includes(o.value))}
              onChange={(selected) => {
                const values = selected ? selected.map((s) => s.value) : [];
                setSelectedTeams(values);
              }}
              isDisabled={!selectedSeason}
              placeholder="Wybierz drużyny..."
            />
          </div>

          {/* lista statystyk */}
          <div>
            <label className="block mb-1 font-semibold">Wybierz statystyki:</label>
            <Select
              isMulti
              options={statOptions}
              value={statOptions.filter((o) => selectedStats.includes(o.value))}
              onChange={(selected) => {
                const values = selected ? selected.map((s) => s.value) : [];
                setSelectedStats(values);
              }}
              placeholder="Wybierz statystyki..."
              isDisabled={statOptions.length === 0}
            />
          </div>
        </div>
      )}

      {/* Tabela H2H */}
      {mode === "h2h" && data.length > 0 && (
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
            <Select
              isMulti
              options={options}
              value={options.filter(o => trendTeams.includes(o.value))}
              onChange={(selected) => setTrendTeams(selected.map(s => s.value))}
            />
          </div>

          {/* wybór statystyki */}
          <div>
            <label className="block mb-1 font-semibold">Statystyka:</label>
            <Select
              options={trendStatOptions} 
              value={trendStatOptions.find((o) => o.value === trendStat)}
              onChange={(selected) => setTrendStat(selected ? selected.value : DEFAULT_STATS[0])}
              isClearable={false}
              isDisabled={trendStatOptions.length === 0}
              placeholder="Wybierz statystykę..."
            />
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
