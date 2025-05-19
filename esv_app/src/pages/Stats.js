import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line, Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
);

const Stats = () => {
  const [view, setView] = useState('h2h'); // 'h2h', 'season', 'scatter'
  const [teams, setTeams] = useState([]);
  const [season, setSeason] = useState('sezon-2023-24');
  const [team1, setTeam1] = useState('');
  const [team2, setTeam2] = useState('');
  const [stat, setStat] = useState('punkty');
  const [h2hData, setH2hData] = useState(null);
  const [seasonData, setSeasonData] = useState([]);
  const [scatterData, setScatterData] = useState([]);

  useEffect(() => {
    // Fetch all team names from current season
    axios.get(`/api/h2h?season=${season}&team1=&team2=`)
      .then(res => {
        if (res.data && res.data.klub1 && res.data.klub2) {
          setTeams([res.data.klub1, res.data.klub2]);
        }
      })
      .catch(() => setTeams(['Jagiellonia Białystok', 'Śląsk Wrocław']));
  }, []);

  const fetchH2H = () => {
    axios.get(`/api/h2h`, {
      params: {
        season,
        team1,
        team2
      }
    }).then(res => setH2hData(res.data));
  };

  const fetchSeasonStat = () => {
    axios.get(`/api/season_chart`, {
      params: {
        team: team1,
        stat
      }
    }).then(res => setSeasonData(res.data));
  };

  const fetchScatter = () => {
    axios.get(`/api/scatter_chart`, {
      params: {
        x: 'bramki_zdobyte',
        y: 'bramki_stracone'
      }
    }).then(res => setScatterData(res.data));
  };


return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Statystyki drużyn</h1>

      <div className="flex gap-4 mb-6">
        <button onClick={() => setView('h2h')} className="bg-blue-500 text-white px-4 py-2 rounded">Porównanie H2H</button>
        <button onClick={() => setView('season')} className="bg-green-500 text-white px-4 py-2 rounded">Sezon po sezonie</button>
        <button onClick={() => setView('scatter')} className="bg-purple-500 text-white px-4 py-2 rounded">Wykres punktowy</button>
      </div>

      {view === 'h2h' && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Porównanie H2H</h2>
          <div className="flex gap-4 mb-4">
            <select value={team1} onChange={e => setTeam1(e.target.value)} className="border p-2">
              {teams.map(team => <option key={team}>{team}</option>)}
            </select>
            <select value={team2} onChange={e => setTeam2(e.target.value)} className="border p-2">
              {teams.map(team => <option key={team}>{team}</option>)}
            </select>
            <button onClick={fetchH2H} className="bg-gray-700 text-white px-3 py-2 rounded">Porównaj</button>
          </div>
          {h2hData && (
            <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(h2hData, null, 2)}</pre>
          )}
        </div>
      )}

      {view === 'season' && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Statystyka sezon po sezonie</h2>
          <div className="flex gap-4 mb-4">
            <input type="text" value={team1} onChange={e => setTeam1(e.target.value)} placeholder="Nazwa drużyny" className="border p-2" />
            <input type="text" value={stat} onChange={e => setStat(e.target.value)} placeholder="Statystyka (np. punkty)" className="border p-2" />
            <button onClick={fetchSeasonStat} className="bg-green-600 text-white px-3 py-2 rounded">Wygeneruj wykres</button>
          </div>
          {seasonData.length > 0 && (
            <Line
              data={{
                labels: seasonData.map(d => d.season),
                datasets: [{
                  label: `${team1} - ${stat}`,
                  data: seasonData.map(d => d.value),
                  borderColor: 'rgb(75, 192, 192)',
                  tension: 0.3
                }]
              }}
            />
          )}
        </div>
      )}

      {view === 'scatter' && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Wykres punktowy (X: bramki_zdobyte, Y: bramki_stracone)</h2>
          <button onClick={fetchScatter} className="bg-purple-600 text-white px-3 py-2 mb-4 rounded">Wygeneruj wykres</button>
          {scatterData.length > 0 && (
            <Scatter
              data={{
                datasets: [{
                  label: 'Drużyny',
                  data: scatterData.map(d => ({
                    x: d.x,
                    y: d.y,
                    label: `${d.klub} (${d.season})`
                  })),
                  backgroundColor: 'rgba(153, 102, 255, 0.6)'
                }]
              }}
              options={{
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: ctx => ctx.raw.label
                    }
                  }
                },
                scales: {
                  x: { title: { display: true, text: 'Bramki zdobyte' }},
                  y: { title: { display: true, text: 'Bramki stracone' }}
                }
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Stats;