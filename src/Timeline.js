import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './Timeline.css';
import axios from 'axios';
// Register ChartJS components for use in the Line chart Lyne lyne
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
// RapidAPI host constant for easier maintenance and readability YEBoi
const RAPIDAPI_HOST = 'cricbuzz-cricket.p.rapidapi.com';
// Timeline component to display player's career progression over time, with search functionality and error handling Boitjie
function Timeline() {
  const [playerName, setPlayerName] = useState('');
  const [playerData, setPlayerData] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState('runs');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const properties = [
    { value: 'runs', label: 'Runs' },
    { value: 'matches', label: 'Matches' },
    { value: 'strikeRate', label: 'Strike Rate' },
    { value: 'centuries', label: 'Centuries (100s)' },
    { value: 'fifties', label: 'Fifties (50s)' },
    { value: 'average', label: 'Average' },
    { value: 'sixes', label: 'Sixes' },
    { value: 'fours', label: 'Fours' },
    { value: 'highest', label: 'Highest Score' }
  ];
//Extract stats from player data, with fallback to 0 if the path is invalid or the stat is missing, to ensure the timeline can be generated without errors YEBoi
  const getStat = (data, path) => {
    try {
      return path.split('.').reduce((obj, key) => obj?.[key], data) || 0;
    } catch {
      return 0;
    }
  };

  const extractCareerStats = (data) => {
    const values = data?.values || [];
    return {
      matches: parseInt(values[0]?.values[1] || 0),
      runs: parseInt(values[2]?.values[1] || 0),
      average: parseFloat(values[5]?.values[1] || 0),
      strikeRate: parseFloat(values[6]?.values[1] || 0),
      fours: parseInt(values[8]?.values[1] || 0),
      sixes: parseInt(values[9]?.values[1] || 0),
      fifties: parseInt(values[11]?.values[1] || 0),
      centuries: parseInt(values[12]?.values[1] || 0),
      highest: parseInt(values[4]?.values[1] || 0),
    };
  };

  async function searchPlayers(playerName) {
    const apiKey = process.env.REACT_APP_RAPIDAPI_KEY;
    if (!apiKey) {
      setError('RapidAPI key not configured (.env missing REACT_APP_RAPIDAPI_KEY)');
      return null;
    }
    
    const options = {
      method: 'GET',
      url: 'https://cricbuzz-cricket.p.rapidapi.com/stats/v1/player/search',
      params: { plrN: playerName.trim() },
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': RAPIDAPI_HOST,
      }
    };
    //Maak request om spelers te soek op basis van die ingevoerde naam, en hanteer die response om die eerste speler terug te gee 
    // of null as geen spelers gevind is, met fout hantering vir netwerk of API issues YEBoi
    try {
      const response = await axios.request(options);
      const data = response.data;
      if (data && data.player && data.player.length > 0) {
        return data.player[0];
      }
      return null;
    } catch (err) {
      console.error('Search error:', err);
      return null;
    }
  }

  async function getPlayerStats(playerId) {

    const options = {
      method: 'GET',
      url: `https://cricbuzz-cricket.p.rapidapi.com/stats/v1/player/${playerId}/batting`,
      headers: {
        'x-rapidapi-key': '0d125b03b2msh63978c0b24b8a01p1a5f47jsnb33b4e2e589c',
        'x-rapidapi-host': RAPIDAPI_HOST,
        'Content-Type': 'application/json'
      }
    };
    
    try {
      const response = await axios.request(options);
      return response.data;
    } catch (err) {
      console.error('Stats error:', err);
      return null;
    }
  }
//Handles the searchform submission :_:
  async function handleSearch(event) {
    event.preventDefault();
    if (!playerName.trim()) {
      setError('Please enter a player name.');
      return;
    }

    setLoading(true);
    setError('');
    setPlayerData(null);

    try {
      const player = await searchPlayers(playerName);
      if (!player) {
        setError(`Player "${playerName}" not found.`);
        setLoading(false);
        return;
      }

      const stats = await getPlayerStats(player.id) || player;
      setPlayerData(stats);
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
    }

    setLoading(false);
  }

  // Mock timeline data based on career totals (distributed over years)
  const generateTimelineData = (stats) => {
    const years = Array.from({ length: 20 }, (_, i) => 2004 + i); // 2004-2023
    const careerStats = extractCareerStats(stats);
    const statMap = {
      runs: careerStats.runs,
      matches: careerStats.matches,
      strikeRate: careerStats.strikeRate,
      centuries: careerStats.centuries,
      fifties: careerStats.fifties,
      average: careerStats.average,
      sixes: careerStats.sixes,
      fours: careerStats.fours,
      highest: careerStats.highest,
    };

    const total = statMap[selectedProperty];
    const yearlyData = years.map((year, idx) => {
      const progress = idx / years.length;
      return Math.round(total * progress * (Math.random() * 0.3 + 0.7)); // Smooth progression + noise
    });

    return {
      labels: years.map(y => `Y${y}`),
      datasets: [{
        label: `${playerData?.name || 'Player'} - ${properties.find(p => p.value === selectedProperty)?.label}`,
        data: yearlyData,
        borderColor: 'rgba(0, 255, 136, 1)',
        backgroundColor: 'rgba(0, 255, 136, 0.1)',
        tension: 0.4,
        fill: true,
      }]
    };
  };

  const chartData = playerData ? generateTimelineData(playerData) : { labels: [], datasets: [] };
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Career Timeline' }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  return (
    <section className="timeline-page">
      <h1>Player Timeline</h1>
      <p>Search a player and view their career progression over time.</p>

      <form className="search-form" onSubmit={handleSearch}>
        <label>
          Player Name
          <input
            type="text"
            placeholder="e.g. Virat Kohli"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}

      {playerData && (
        <div className="timeline-results">
          <div className="player-info">
            <h3>{playerData.name}</h3>
            <select 
              value={selectedProperty} 
              onChange={(e) => setSelectedProperty(e.target.value)}
              className="property-select"
            >
              {properties.map(prop => (
                <option key={prop.value} value={prop.value}>{prop.label}</option>
              ))}
            </select>
          </div>

          <div className="chart-container">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      )}
    </section>
  );
}

export default Timeline;

