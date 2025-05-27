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
import teamsInfo from '../teamsInfo';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Title, BarElement, ArcElement, ChartDataLabels);
ChartJS.register(ChartDataLabels);

const DEFAULT_STATS = [
  "pozycja",
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
  const [sortOption, setSortOption] = useState(null); 
  const [teamLogos, setTeamLogos] = useState({});
  const [allTeams, setAllTeams] = useState([]);
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
      // tłumaczenie statystyk
    const statTranslations = {
      klub: "Klub",
      pozycja: "Pozycja",
      mecze: "Mecze",
      punkty: "Punkty",
      zwyciestwa: "Zwycięstwa",
      remisy: "Remisy",
      porazki: "Porażki",
      bramki_zdobyte: "Bramki zdobyte",
      bramki_stracone: "Bramki stracone",
      bilans_bramkowy: "Bilans bramkowy",
      srednia_pkt: "Średnia punktów",
      srednia_bramki_zdobyte: "Średnia bramek zdobytych",
      srednia_bramki_stracone: "Średnia bramek straconych",
      skrot: "Skrót",
      srednie_posiadanie_pilki: "Średnie posiadanie piłki",
      srednia_strzaly: "Średnia strzałów",
      srednia_strzaly_celne: "Średnia strzałów celnych",
      srednia_strzaly_niecelne: "Średnia strzałów niecelnych",
      srednia_strzaly_zablokowane: "Średnia strzałów zablokowanych",
      procent_strzaly_celne: "Procent strzałów celnych",
      procent_bramki_strzaly: "Procent goli ze strzałów",
      srednia_rzuty_rozne: "Średnia rzutów rożnych",
      srednia_spalone: "Średnia spalonych",
      srednia_interwencje_bramkarza: "Średnia interwencji bramkarza",
      srednia_fauli: "Średnia fauli",
      srednia_zolte_kartki: "Średnia żółtych kartek",
      srednia_czerwone_kartki: "Średnia czerwonych kartek",
      zolte_kartki: "Żółte kartki",
      czerwone_kartki: "Czerwone kartki",
      czerwone_kartki_bezposrednie: "Bezpośrednie czerwone kartki",
      slupki_i_poprzeczki: "Słupki i poprzeczki",
      slupki_i_poprzeczki_przeciw: "Słupki i poprzeczki (przeciw)",
      procent_goli_polakow: "Procent goli Polaków",
      faule: "Faule",
      faulowani: "Faulowani",
      spalone: "Spalone",
      spalone_przeciw: "Spalone (przeciw)",
      liczba_minut_mlodziezowcy: "Liczba minut młodzieżowców",
      procent_liczby_minut_mlodziezowcy: "Procent minut młodzieżowców",
      zawodnicy: "Liczba zawodników",
      zawodnicy_mlodziezowcy: "Liczba młodzieżowców",
      liczba_goli_mlodziezowcy: "Gole młodzieżowców",
      procent_liczby_goli_mlodziezowcy: "Procent goli młodzieżowców",
      liczba_minut_obcokrajowcy: "Minuty obcokrajowców",
      procent_liczby_minut_obcokrajowcy: "Procent minut obcokrajowców",
      zawodnicy_obcokrajowcy: "Liczba obcokrajowców",
      liczba_goli_obcokrajowcy: "Gole obcokrajowców",
      procent_liczby_goli_obcokrajowcy: "Procent goli obcokrajowców",
      srednia_goli_w_meczach_z_udzialem_druzyny: "Średnia goli w meczach z udziałem drużyny",
      laczna_frekwencja_mecze_domowe: "Łączna frekwencja (dom)",
      srednia_frekwencja_mecze_domowe: "Średnia frekwencja (dom)",
      laczna_frekwencja_mecze_wyjazdowe: "Łączna frekwencja (wyjazd)",
      srednia_frekwencja_mecze_wyjazdowe: "Średnia frekwencja (wyjazd)",
      dla_xG: "xG zdobyte",
      przeciw_xG: "xG stracone",
      bilans_przewidywanych_goli_xG: "Bilans xG",
      przewidywane_punkty_xG: "xP (przewidywane punkty)",
      bilans_przewidywanych_punktow_xG: "Bilans xP",
      gole_karny: "Gole z karnych",
      gole_rozny: "Gole z rzutów rożnych",
      gole_wolny: "Gole z rzutów wolnych",
      gole_po_sfg: "Gole po stałych fragmentach",
      procent_goli_po_sfg: "Procent goli po SFG",
      gole_z_gry: "Gole z gry",
      procent_goli_z_gry: "Procent goli z gry",
      gole_lewa_noga: "Gole lewą nogą",
      gole_prawa_noga: "Gole prawą nogą",
      gole_glowka: "Gole głową",
      gole_inna_czesc_ciala: "Gole inną częścią ciała",
      liczba_stworzonych_okazji: "Stworzone okazje",
      liczba_stworzonych_okazji_przeciw: "Okazje stworzone (przeciw)",
      procent_wykorzystanych_stworzonych_okazji: "Skuteczność okazji",
      procent_wykorzystanych_stworzonych_okazji_przeciw: "Skuteczność okazji (przeciw)",
      srednia_wieku_wyjsciowych_jedenastek: "Średnia wieku jedenastki",
      srednia_wzrostu_wyjsciowych_jedenastek: "Średni wzrost jedenastki",
      sezon: "Sezon"
    };

  // opcja statystyk na podstawie danych
  const allStatKeys = new Set();
  data.forEach((teamStats) => {
    Object.entries(teamStats).forEach(([key, value]) => {
      if (typeof value === "number" || key.includes("procent")) {
        allStatKeys.add(key);
      }
    });
  });
  const statOptions = Array.from(allStatKeys).map((stat) => ({
    value: stat,
    label: statTranslations[stat] || stat
  }));

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

  // ustawienie logo drużyny
  useEffect(() => {
    const images = {};
    Object.entries(teamsInfo).forEach(([team, info]) => {
      const img = new Image();
      img.src = info.logo;
      images[team] = img;
    });
    setTeamLogos(images);
  }, []);

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
    if (!scatterSeason) return;
    fetch(`/teams/?season=${encodeURIComponent(scatterSeason)}`)
      .then((res) => res.json())
      .then(setTeams)
      .catch(console.error);
  }, [scatterSeason]);

  useEffect(() => {
    if (!customSeason) return;
    fetch(`/teams/?season=${encodeURIComponent(customSeason)}`)
      .then((res) => res.json())
      .then(setTeams)
      .catch(console.error);
  }, [customSeason]);

  // pobieranie danych dany sezon - H2H, scatter, custom
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
    if (mode !== "scatter") return;
    if (!scatterSeason || scatterTeams.length === 0 || !scatterStatX || !scatterStatY) {
      setScatterData({});
      return;
    }

    const fetchAll = async () => {
      const newData = {};
      for (const team of scatterTeams) {
        try {
          const res = await fetch(`/team-stats/?season=${encodeURIComponent(scatterSeason)}&team=${encodeURIComponent(team)}`);
          if (res.ok) {
            const data = await res.json();
            newData[team] = {
              x: data?.[scatterStatX] ?? null,
              y: data?.[scatterStatY] ?? null,
            };
          } else {
            newData[team] = { x: null, y: null };
          }
        } catch {
          newData[team] = { x: null, y: null };
        }
      }
      setScatterData(newData);
    };

    fetchAll();
  }, [mode, scatterTeams, scatterSeason, scatterStatX, scatterStatY]);

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

  // sortowanie
  const sortedTeams = React.useMemo(() => {
  if (!sortOption) return selectedTeams;

    const teamsCopy = [...selectedTeams];
    switch (sortOption.value) {
      case "alpha-asc":
        return teamsCopy.sort((a, b) => a.localeCompare(b));
      case "alpha-desc":
        return teamsCopy.sort((a, b) => b.localeCompare(a));
      case "value-asc":
        return teamsCopy.sort((a, b) => {
          const aVal = getTeamData(a)?.[selectedStats[0]] ?? 0;
          const bVal = getTeamData(b)?.[selectedStats[0]] ?? 0;
          return aVal - bVal;
        });
      case "value-desc":
        return teamsCopy.sort((a, b) => {
          const aVal = getTeamData(a)?.[selectedStats[0]] ?? 0;
          const bVal = getTeamData(b)?.[selectedStats[0]] ?? 0;
          return bVal - aVal;
        });
      case "table-pos-asc":
        return teamsCopy.sort((a, b) => {
          const aPos = getTeamData(a)?.pozycja ?? Infinity;
          const bPos = getTeamData(b)?.pozycja ?? Infinity;
          return aPos - bPos;
        });
      case "table-pos-desc":
        return teamsCopy.sort((a, b) => {
          const aPos = getTeamData(a)?.pozycja ?? -Infinity;
          const bPos = getTeamData(b)?.pozycja ?? -Infinity;
          return bPos - aPos;
        });
      default:
        return teamsCopy;
    }
  }, [sortOption, selectedTeams, selectedStats, data]);

  const sortedCustomData = React.useMemo(() => {
    if (!sortOption) return customData;

    const entries = Object.entries(customData);
    switch (sortOption.value) {
      case "alpha-asc":
        return Object.fromEntries(entries.sort((a, b) => a[0].localeCompare(b[0])));
      case "alpha-desc":
        return Object.fromEntries(entries.sort((a, b) => b[0].localeCompare(a[0])));
      case "value-asc":
        return Object.fromEntries(entries.sort((a, b) => a[1] - b[1]));
      case "value-desc":
        return Object.fromEntries(entries.sort((a, b) => b[1] - a[1]));
      default:
        return customData;
    }
  }, [sortOption, customData]);

  // pobieranie danych sezon po sezonie
  useEffect(() => {
    if (mode !== "season-trend") return;
    if (seasons.length === 0 || teams.length === 0) return;

    const firstSeason = seasons[0];
    const firstTeam = teams[0];

    if (!firstTeam) {
       setTrendStatOptions(
        DEFAULT_STATS.map(stat => ({
          value: stat,
          label: statTranslations[stat] || stat
        }))
      );
      return;
    }

    fetch(`/team-stats/?season=${encodeURIComponent(firstSeason)}&team=${encodeURIComponent(firstTeam)}`)
      .then(res => res.json())
      .then(data => {
        if (data && typeof data === "object") {
          const stats = Object.keys(data).filter(key => typeof data[key] === "number" || key.includes("procent"));
          setTrendStatOptions(
            stats.map(stat => ({
              value: stat,
              label: statTranslations[stat] || stat
            }))
          );
          if (!stats.includes(trendStat)) {
            setTrendStat(stats[0] || DEFAULT_STATS[0]);
          }
        } else {
          setTrendStatOptions(
            DEFAULT_STATS.map(stat => ({
              value: stat,
              label: statTranslations[stat] || stat
            }))
          );
        }
      })
      .catch(() => {
        setTrendStatOptions(
          DEFAULT_STATS.map(stat => ({
            value: stat,
            label: statTranslations[stat] || stat
          }))
        );
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
        const options = keys.map((stat) => ({
          value: stat,
          label: statTranslations[stat] || stat
        }));
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

  // generowanie wszystkich zespołów
  useEffect(() => {
    if (mode !== "season-trend" && mode !== "scatter") return;

    fetch("/all-teams/")
      .then((res) => res.json())
      .then(setAllTeams)
      .catch(console.error);
  }, [mode]);

  const allTeamOptions = allTeams.map((team) => ({ label: team, value: team }));

  // wybór drużyn
  const getSelectedOptions = (allOptions, selectedValues) => {
    const existing = allOptions.filter((o) => selectedValues.includes(o.value));
    const missing = selectedValues
      .filter((val) => !allOptions.find((o) => o.value === val))
      .map((val) => ({ label: val, value: val }));
    return [...existing, ...missing];
  };

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
        const options = keys.map((stat) => ({
          value: stat,
          label: statTranslations[stat] || stat
        }));
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

    const getSortedTeamOptions = (teams) =>
      [...teams].sort((a, b) =>
        a.label.localeCompare(b.label, "pl", { sensitivity: "base" })
      );

    // logo w liście drużyn
    const customOption = (props) => {
      const { data, innerRef, innerProps } = props;
      return (
        <div
          ref={innerRef}
          {...innerProps}
          style={{ display: 'flex', alignItems: 'center', padding: 8 }}
        >
          <img
            src={teamsInfo[data.value]?.logo}
            alt={data.label}
            style={{ width: 24, height: 24, marginRight: 10, borderRadius: 4 }}
          />
          {data.label}
        </div>
      );
    };

    const customSingleValue = ({ data }) => (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img
          src={teamsInfo[data.value]?.logo}
          alt={data.label}
          style={{ width: 20, height: 20, marginRight: 8, borderRadius: 4 }}
        />
        {data.label}
      </div>
    );

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
              options={getSortedTeamOptions(options)}
              value={options.filter((o) => selectedTeams.includes(o.value))}
              onChange={(selected) => {
                const values = selected ? selected.map((s) => s.value) : [];
                setSelectedTeams(values);
              }}
              isDisabled={!selectedSeason}
              placeholder="Wybierz drużyny..."
              components={{ Option: customOption, MultiValueLabel: customSingleValue }}
            />
          </div>

          {/* lista statystyk */}
          <div>
            <label className="block mb-1 font-semibold">Wybierz statystyki:</label>
            <Select
              isMulti
              options={getSortedTeamOptions(statOptions)}
              value={statOptions.filter((o) => selectedStats.includes(o.value))}
              onChange={(selected) => {
                const values = selected ? selected.map((s) => s.value) : [];
                setSelectedStats(values);
              }}
              placeholder="Wybierz statystyki..."
              isDisabled={statOptions.length === 0}
            />
          </div>

          {/* sortowanie */}
          <div className="flex justify-end mb-2">
            <label className="block mb-1 font-semibold">Wybierz sortowanie:</label>
            <Select
              options={[
                { value: 'alpha-asc', label: 'Alfabetycznie A-Z' },
                { value: 'alpha-desc', label: 'Alfabetycznie Z-A' },
                { value: 'table-pos-asc', label: 'Pozycja w tabeli rosnąco' },
                { value: 'table-pos-desc', label: 'Pozycja w tabeli malejąco' },
              ]}
              value={sortOption}
              onChange={setSortOption}
              className="w-60"
              placeholder="Sortowanie..."
            />
          </div>

            {/* Tabela H2H */}
          {data.length > 0 && (
            <div className="overflow-auto mt-4">
              <h2 className="text-lg font-bold mb-2">TABELA H2H - Sezon: {selectedSeason}</h2>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr>
                    <th className="border p-2 text-center">Statystyka</th>
                    {sortedTeams.map((team, idx) => (
                      <th key={idx} className="border p-2 text-center">
                        <div className="text-sm font-semibold">{team}</div>
                        <img
                          src={teamsInfo[team]?.logo}
                          alt={team}
                          className="w-8 h-8 mx-auto mb-1"
                        />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {selectedStats.map((stat) => (
                    <tr key={stat}>
                      <td className="border p-2 font-bold">{statTranslations[stat] || stat}</td>
                      {sortedTeams.map((team, idx) => {
                        const record = getTeamData(team);
                        return (
                          <td key={idx} className="border p-2 text-center">
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
      )}

    {/* panel trybu - sezon po sezonie */}
      {mode === "season-trend" && (
        <div className="space-y-4">
          {/* Wybór drużyn */}
          <div>
            <label className="block mb-1 font-semibold">Wybierz drużyny:</label>
            <Select
              isMulti
              options={getSortedTeamOptions(allTeamOptions)}
              value={getSelectedOptions(allTeamOptions, trendTeams)}
              onChange={(selected) => {
                const values = selected ? selected.map((s) => s.value) : [];
                setTrendTeams(values);
              }}
              placeholder="Wybierz drużyny..."
              components={{ Option: customOption, MultiValueLabel: customSingleValue }}
            />
          </div>

          {/* wybór statystyki */}
          <div>
            <label className="block mb-1 font-semibold">Statystyka:</label>
            <Select
              options={getSortedTeamOptions(trendStatOptions)} 
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
                    borderColor: teamsInfo[team]?.color || 'hsl(0,0%,50%)',
                    backgroundColor: teamsInfo[team]?.color || 'hsl(0,0%,50%)',
                    pointStyle: values.map(() => teamLogos[team] || 'circle'),
                    pointRadius: 10,
                    pointHoverRadius: 14,
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
                      text: `Wykres liniowy - ${statTranslations[trendStat]} - Sezon po sezonie`,
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
                        text: statTranslations[trendStat],
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
              options={getSortedTeamOptions(options)}
              value={options.filter((o) => scatterTeams.includes(o.value))}
              onChange={(selected) => {
                const values = selected ? selected.map((s) => s.value) : [];
                setScatterTeams(values);
              }}
              placeholder="Wybierz drużyny..."
              components={{ Option: customOption, MultiValueLabel: customSingleValue }}
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Wybierz statystykę na oś X:</label>
            <Select
              options={getSortedTeamOptions(scatterStatOptions)}
              value={scatterStatOptions.find((o) => o.value === scatterStatX)}
              onChange={(selected) => setScatterStatX(selected ? selected.value : "")}
              placeholder="Statystyka X..."
              isClearable={false}
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Wybierz statystykę na oś Y:</label>
            <Select
              options={getSortedTeamOptions(scatterStatOptions)}
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
                      backgroundColor: scatterData.map(point => teamsInfo[point.label]?.color || 'rgba(27, 32, 177, 0.6)'),
                      pointRadius: 14,
                      pointHoverRadius: 18,
                      pointStyle: scatterData.map(point => teamLogos[point.label] || 'circle'),
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: { display: false },
                    title: {
                      display: true,
                      text: `Wykres zależności - ${statTranslations[scatterStatY]} od ${statTranslations[scatterStatX]} - Sezon: ${scatterSeason || "wszystkie"}`,
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
                          return `${point.label}: (${statTranslations[scatterStatX]}: ${point.x}, ${statTranslations[scatterStatY]}: ${point.y})`;
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
                    x: { title: { display: true, text: statTranslations[scatterStatX] }, beginAtZero: true },
                    y: { title: { display: true, text: statTranslations[scatterStatY] }, beginAtZero: true },
                  },
                }}
              />
            ) : (
              <p></p>
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
              options={getSortedTeamOptions(options)}
              value={options.filter((o) => customTeams.includes(o.value))}
              onChange={(selected) => {
                const values = selected ? selected.map((s) => s.value) : [];
                setCustomTeams(values);
              }}
              placeholder="Wybierz drużyny..."
              components={{ Option: customOption, MultiValueLabel: customSingleValue }}
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Wybierz statystykę:</label>
            <Select
              options={getSortedTeamOptions(customStatOptions)}
              value={customStatOptions.find((o) => o.value === customStat)}
              onChange={(selected) => setCustomStat(selected ? selected.value : "")}
              isClearable={false}
              placeholder="Wybierz statystykę..."
            />
          </div>

          {/* sortowanie */}
          <div className="flex justify-end mb-2">
            <label className="block mb-1 font-semibold">Wybierz sortowanie:</label>
            <Select
              options={[
                { value: 'alpha-asc', label: 'Alfabetycznie A-Z' },
                { value: 'alpha-desc', label: 'Alfabetycznie Z-A' },
                { value: 'value-asc', label: 'Wartość rosnąco' },
                { value: 'value-desc', label: 'Wartość malejąco' },
                { value: 'table-pos-asc', label: 'Pozycja w tabeli rosnąco' },
                { value: 'table-pos-desc', label: 'Pozycja w tabeli malejąco' },
              ]}
              value={sortOption}
              onChange={setSortOption}
              className="w-60"
              placeholder="Sortowanie..."
            />
          </div>

          {Object.keys(customData).length > 0 && (
            <div className="mt-6">
              
            {customChartType === "bar" && (
              <Bar
                data={{
                  labels: Object.keys(sortedCustomData),
                  datasets: [
                    {
                      label: statTranslations[customStat],
                      data: Object.values(sortedCustomData),
                      backgroundColor: Object.keys(sortedCustomData).map(
                        (team) => teamsInfo[team]?.color || '#888'
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
                      text: `Wykres słupkowy - ${statTranslations[customStat]} - Sezon: ${customSeason || "wszystkie"}`,
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
                  labels: Object.keys(sortedCustomData),
                  datasets: [
                    {
                      label: statTranslations[customStat],
                      data: Object.values(sortedCustomData),
                      backgroundColor: Object.keys(sortedCustomData).map(
                        (team) => teamsInfo[team]?.color || '#888'
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
                      text: `Wykres kolumnowy - ${statTranslations[customStat]} - Sezon: ${customSeason || "wszystkie"}`,
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
                  labels: Object.keys(sortedCustomData),
                  datasets: [
                    {
                      data: Object.values(sortedCustomData),
                      backgroundColor: Object.keys(sortedCustomData).map(
                        (team) => teamsInfo[team]?.color || '#888'
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
                      text: `Wykres kołowy - ${statTranslations[customStat]} - Sezon: ${customSeason || "wszystkie"}`,
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
