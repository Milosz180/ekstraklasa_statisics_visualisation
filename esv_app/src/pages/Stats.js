import React, { useState, useEffect } from "react";

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
  const [mode, setMode] = useState("h2h");
  const [data, setData] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState("");
  const [selectedTeams, setSelectedTeams] = useState(["", ""]);
  const [selectedStats, setSelectedStats] = useState(DEFAULT_STATS);

  // 1. Pobierz listę sezonów przy starcie
  useEffect(() => {
    fetch("/seasons/")
      .then((res) => res.json())
      .then(setSeasons)
      .catch(console.error);
  }, []);

  // 2. Po wybraniu sezonu pobierz listę drużyn
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

  // 3. Po zmianie sezonu lub drużyn pobierz dane H2H
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

    // Budujemy query z dwoma parametrami teams
    const params = new URLSearchParams();
    params.append("season", selectedSeason);
    params.append("teams", selectedTeams[0]);
    params.append("teams", selectedTeams[1]);

    fetch(`/h2h/?${params.toString()}`)
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, [mode, selectedSeason, selectedTeams]);

  // Pomocnik - pobierz dane drużyny z tablicy data
  const getTeamData = (team) => data.find((d) => d.klub === team);

  return (
    <div className="p-4 space-y-6">
      {/* Tryb */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setMode("h2h")}
          className={`btn ${mode === "h2h" ? "bg-blue-500 text-white" : ""}`}
        >
          Statystyki H2H
        </button>
        {/* Możesz dodać inne tryby */}
      </div>

      {/* Panel wyboru sezonu i drużyn */}
      {mode === "h2h" && (
        <div className="space-y-4">
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

          {/* Lista statystyk */}
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
    </div>
  );
};

export default Stats;
