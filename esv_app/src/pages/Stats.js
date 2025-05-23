import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Line, Bar, Pie, Scatter } from "react-chartjs-2";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
  Title,
} from "chart.js";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Title, BarElement, ArcElement, ChartDataLabels);
ChartJS.register(ChartDataLabels);

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
  // stany tryb: 
  const [scatterSeason, setScatterSeason] = useState("");
  const [scatterTeams, setScatterTeams] = useState([]);
  const [scatterStatX, setScatterStatX] = useState("");
  const [scatterStatY, setScatterStatY] = useState("");
  const [scatterStatOptions, setScatterStatOptions] = useState([]);
  const [scatterData, setScatterData] = useState({});
  // stany tryb: dowolne wykresy
  const [customChartType, setCustomChartType] = useState("bar");
  const [customSeason, setCustomSeason] = useState("");
  const [customTeams, setCustomTeams] = useState([]);
  const [customStat, setCustomStat] = useState("");
  const [customData, setCustomData] = useState({});
  const [customStatOptions, setCustomStatOptions] = useState([]);
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
  const statOptions = Array.from(allStatKeys).map((stat) => ({ value: stat, label: stat }));

  // pobieranie listy zespołów
  useEffect(() => {
    if (seasons.length > 0) return;
    fetch("/seasons/")
      .then((res) => res.json())
      .then(setSeasons)
      .catch(console.error);
  }, [mode]);

  useEffect(() => {
    if (seasons.length > 0) {
      if (!selectedSeason) setSelectedSeason(seasons[0]);
      if (!scatterSeason) setScatterSeason(seasons[0]);
      if (!customSeason) setCustomSeason(seasons[0]);
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

  useEffect(() => {
    if (!customSeason) return;
    fetch(`/teams/?season=${encodeURIComponent(customSeason)}`)
      .then((res) => res.json())
      .then(setTeams)
      .catch(console.error);
  }, [customSeason]);

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

  useEffect(() => {
    if (mode !== "custom") return;
    if (!customSeason || customTeams.length === 0 || !customStat) {
      setCustomData({});
      return;
    }

    const fetchAll = async () => {
      const newData = {};
      for (const team of customTeams) {
        try {
          const res = await fetch(`/team-stats/?season=${encodeURIComponent(customSeason)}&team=${encodeURIComponent(team)}`);
          if (res.ok) {
            const data = await res.json();
            newData[team] = data?.[customStat] ?? null;
          } else {
            newData[team] = null;
          }
        } catch {
          newData[team] = null;
        }
      }
      setCustomData(newData);
    };

    fetchAll();
  }, [mode, customTeams, customSeason, customStat]);

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
    if (mode !== "custom" || !customSeason || customTeams.length === 0) return;

    const fetchStats = async () => {
      try {
        const res = await fetch(`/team-stats/?season=${encodeURIComponent(customSeason)}&team=${encodeURIComponent(customTeams[0])}`);
        if (!res.ok) return;
        const data = await res.json();
        const keys = Object.keys(data).filter(
          (key) => typeof data[key] === "number" || key.includes("procent")
        );
        const options = keys.map((stat) => ({ value: stat, label: stat }));
        setCustomStatOptions(options);
      } catch (err) {
        console.error("Błąd pobierania statystyk:", err);
      }
    };

    fetchStats();
  }, [mode, customSeason, customTeams]);

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

  useEffect(() => {
    if (mode !== "scatter" || !scatterSeason || scatterTeams.length === 0) return;

    const fetchStatsScatter = async () => {
      try {
        const res = await fetch(`/team-stats/?season=${encodeURIComponent(scatterSeason)}&team=${encodeURIComponent(scatterTeams[0])}`);
        if (!res.ok) return;
        const data = await res.json();
        const keys = Object.keys(data).filter(
          (key) => typeof data[key] === "number" || key.includes("procent")
        );
        const options = keys.map((stat) => ({ value: stat, label: stat }));
        setScatterStatOptions(options);
        if (!options.some(o => o.value === scatterStatX)) {
          setScatterStatX(options[0]?.value || "");
        }
        if (!options.some(o => o.value === scatterStatY)) {
          setScatterStatY(options[1]?.value || options[0]?.value || "");
        }
      } catch {
        setScatterStatOptions([]);
      }
    };
    fetchStatsScatter();
  }, [mode, scatterSeason, scatterTeams]);

  // --- pobieranie danych dla scatter ---
  useEffect(() => {
    if (mode !== "scatter") return;
      if (!scatterSeason || scatterTeams.length === 0 || !scatterStatX || !scatterStatY) {
        setScatterData({});
        return;
      }

      const fetchScatterData = async () => {
        const points = [];
        for (const team of scatterTeams) {
          try {
            const res = await fetch(`/team-stats/?season=${encodeURIComponent(scatterSeason)}&team=${encodeURIComponent(team)}`);
            if (res.ok) {
              const data = await res.json();
              const x = data[scatterStatX];
              const y = data[scatterStatY];
              if (typeof x === "number" && typeof y === "number") {
                points.push({ x, y, label: team });
              }
            }
          } catch {}
        }
        setScatterData(points);
      };
      fetchScatterData();
    }, [mode, scatterSeason, scatterTeams, scatterStatX, scatterStatY]);

  return (
    <div className="p-4 space-y-6">
      {/* tryby do wyboru: H2H, sezon po sezonie i ......... */}
      <div className="flex space-x-4 mb-4">
        {/* h2h */}
        <button onClick={() => setMode("h2h")} className={`btn ${mode === "h2h" ? "bg-blue-500 text-white" : ""}`}>Statystyki H2H</button>
        {/* sezon po sezonie */}
        <button onClick={() => setMode("season-trend")} className={`btn ${mode === "season-trend" ? "bg-blue-500 text-white" : ""}`}>Sezon po sezonie</button>
        {/* wykres zależności */}
        <button onClick={() => setMode("scatter")} disabled={mode === "scatter"}>Wykres zależności</button>
        {/* dowolne wykresy */}
        <button onClick={() => setMode("custom")} className={`btn ${mode === "custom" ? "bg-blue-500 text-white" : ""}`}>Dowolne wykresy</button>
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
          <h2>TABELA H2H - Sezon: {selectedSeason || "wszystkie"}</h2>
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
                    title: {
                      display: true,
                      text: `Wykres liniowy - ${trendStat} - Sezon po sezonie`,
                      font: {
                        size: 18,
                        weight: 'bold',
                      },
                      padding: {
                        top: 10,
                        bottom: 30,
                      },
                    },
                    datalabels: {
                      color: 'black',
                      anchor: 'end',
                      align: 'top',
                      offset: -4,
                      font: {
                        size: 12,
                        weight: 'normal',
                      },
                      formatter: (value) => value,
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
                plugins={[ChartDataLabels]}
              />
            </div>
          )}
        </div>
      )}
      {mode === "scatter" && (
        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold">Wybierz sezon:</label>
            <select
              value={scatterSeason}
              onChange={(e) => setScatterSeason(e.target.value)}
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
              value={options.filter((o) => scatterTeams.includes(o.value))}
              onChange={(selected) => {
                const values = selected ? selected.map((s) => s.value) : [];
                setScatterTeams(values);
              }}
              placeholder="Wybierz drużyny..."
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Wybierz statystykę na oś X:</label>
            <Select
              options={scatterStatOptions}
              value={scatterStatOptions.find((o) => o.value === scatterStatX)}
              onChange={(selected) => setScatterStatX(selected ? selected.value : "")}
              placeholder="Statystyka X..."
              isClearable={false}
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Wybierz statystykę na oś Y:</label>
            <Select
              options={scatterStatOptions}
              value={scatterStatOptions.find((o) => o.value === scatterStatY)}
              onChange={(selected) => setScatterStatY(selected ? selected.value : "")}
              placeholder="Statystyka Y..."
              isClearable={false}
            />
          </div>

          <div className="mt-6">
            {scatterData.length > 0 ? (
              <Scatter
                data={{
                  datasets: [
                    {
                      label: `Scatter: ${scatterStatX} vs ${scatterStatY}`,
                      data: scatterData,
                      backgroundColor: 'rgba(27, 32, 177, 0.6)',
                      pointRadius: 7,
                      pointHoverRadius: 9,
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: { display: false },
                    title: {
                      display: true,
                      text: `Wykres zależności - ${scatterStatY} od ${scatterStatX} - Sezon: ${customSeason || "wszystkie"}`,
                      font: {
                        size: 18,
                        weight: 'bold',
                      },
                      padding: {
                        top: 10,
                        bottom: 30,
                      },
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          const point = context.raw;
                          return `${point.label}: (${scatterStatX}: ${point.x}, ${scatterStatY}: ${point.y})`;
                        },
                      },
                    },
                    datalabels: {
                      align: 'right',
                      anchor: 'end',
                      formatter: (value) => value.label,
                      font: { weight: 'bold' },
                    },
                  },
                  scales: {
                    x: { title: { display: true, text: scatterStatX }, beginAtZero: true },
                    y: { title: { display: true, text: scatterStatY }, beginAtZero: true },
                  },
                }}
              />
            ) : (
              <p>Brak danych do wyświetlenia. Wybierz sezon, drużyny oraz statystyki.</p>
            )}
          </div>
        </div>
      )}
      {mode === "custom" && (
        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold">Typ wykresu:</label>
            <div className="flex space-x-4">
              {[
                { value: "bar", label: "Wykres słupkowy" },
                { value: "column", label: "Wykres kolumnowy" },
                { value: "pie", label: "Wykres kołowy" },
              ].map((opt) => (
                <label key={opt.value} className="flex items-center space-x-2">
                  <input type="radio" name="chartType" value={opt.value} checked={customChartType === opt.value} onChange={() => setCustomChartType(opt.value)} />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block mb-1 font-semibold">Wybierz sezon:</label>
            <select value={customSeason} onChange={(e) => setCustomSeason(e.target.value)} className="border p-2 rounded">
              <option value="">-- wybierz sezon --</option>
              {seasons.map((season) => (
                <option key={season} value={season}>{season}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-semibold">Wybierz drużyny:</label>
            <Select
              isMulti
              options={options}
              value={options.filter((o) => customTeams.includes(o.value))}
              onChange={(selected) => {
                const values = selected ? selected.map((s) => s.value) : [];
                setCustomTeams(values);
              }}
              placeholder="Wybierz drużyny..."
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Wybierz statystykę:</label>
            <Select
              options={customStatOptions}
              value={customStatOptions.find((o) => o.value === customStat)}
              onChange={(selected) => setCustomStat(selected ? selected.value : "")}
              isClearable={false}
              placeholder="Wybierz statystykę..."
            />
          </div>

          {Object.keys(customData).length > 0 && (
            <div className="mt-6">
            {customChartType === "bar" && (
              <Bar
                data={{
                  labels: Object.keys(customData),
                  datasets: [
                    {
                      label: customStat,
                      data: Object.values(customData),
                      backgroundColor: Object.keys(customData).map((_, i) =>
                        `hsl(${(i * 360) / Object.keys(customData).length}, 70%, 50%)`
                      ),
                    },
                  ],
                }}
                options={{
                  indexAxis: "x",
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                    title: {
                      display: true,
                      text: `Wykres słupkowy - ${customStat} - Sezon: ${customSeason || "wszystkie"}`,
                      font: {
                        size: 18,
                        weight: 'bold',
                      },
                      padding: {
                        top: 10,
                        bottom: 30,
                      },
                    },
                    datalabels: {
                      color: '#fff',
                      font: {
                        weight: 'bold',
                        size: 12,
                      },
                    },
                  },
                }}
                plugins={[ChartDataLabels]}
              />
            )}

            {customChartType === "column" && (
              <Bar
                data={{
                  labels: Object.keys(customData),
                  datasets: [
                    {
                      label: customStat,
                      data: Object.values(customData),
                      backgroundColor: Object.keys(customData).map((_, i) =>
                        `hsl(${(i * 360) / Object.keys(customData).length}, 70%, 50%)`
                      ),
                    },
                  ],
                }}
                options={{
                  indexAxis: "y",
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                    title: {
                      display: true,
                      text: `Wykres kolumnowy - ${customStat} - Sezon: ${customSeason || "wszystkie"}`,
                      font: {
                        size: 18,
                        weight: 'bold',
                      },
                      padding: {
                        top: 10,
                        bottom: 30,
                      },
                    },
                    datalabels: {
                      color: '#fff',
                      font: {
                        weight: 'bold',
                        size: 12,
                      },
                    },
                  },
                }}
                plugins={[ChartDataLabels]}
              />
            )}

            {customChartType === "pie" && (
              <Pie
                data={{
                  labels: Object.keys(customData),
                  datasets: [
                    {
                      data: Object.values(customData),
                      backgroundColor: Object.keys(customData).map((_, i) =>
                        `hsl(${(i * 360) / Object.keys(customData).length}, 70%, 50%)`
                      ),
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'top' },
                    title: {
                      display: true,
                      text: `Wykres kołowy - ${customStat} - Sezon: ${customSeason || "wszystkie"}`,
                      font: {
                        size: 18,
                        weight: 'bold',
                      },
                      padding: {
                        top: 10,
                        bottom: 30,
                      },
                    },
                    datalabels: {
                      color: '#fff',
                      formatter: (value, context) => {
                        const total = context.chart.data.datasets[0].data.reduce(
                          (acc, val) => acc + val,
                          0
                        );
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${value}\n(${percentage}%)`;
                      },
                      font: {
                        weight: 'bold',
                        size: 12,
                      },
                    },
                  },
                }}
                plugins={[ChartDataLabels]}
              />
            )}
          </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Stats;
