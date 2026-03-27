import React, { useState } from 'react';
import { Bar, Pie, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import './Comparison.css';
import axios from 'axios';
//API keys for RapidAPI Cricbuzz endpoints Yeboi
const RAPIDAPI_HOST = 'cricbuzz-cricket.p.rapidapi.com';

if (!process.env.REACT_APP_RAPIDAPI_KEY) {
  console.error('Missing REACT_APP_RAPIDAPI_KEY in .env file');
}
//Register ChartJS components YEBoi
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  RadialLinearScale
);
//Comparison page component where users can search for two players and compare their stats side by side YEBoi
function Comparison() {
  const [firstPlayer, setFirstPlayer] = useState('');
  const [secondPlayer, setSecondPlayer] = useState('');
  const [player1Data, setPlayer1Data] = useState(null);
  const [player2Data, setPlayer2Data] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const getStat = (data, path) => {
    try {
      return path.split('.').reduce((obj, key) => obj?.[key], data) || 0;
    } catch {
      return 0;
    }
  };
//Extract stats for both players, handling cases where certain stats may be missing by checking multiple possible paths YEBoi
  const p1Matches = getStat(player1Data, 'batting.bat.matNr') || getStat(player1Data, 'recentBatting.rows[0].values[0]');
  const p1Runs = getStat(player1Data, 'batting.bat.runs') || getStat(player1Data, 'recentBatting.rows[0].values[1]');
  const p1SR = getStat(player1Data, 'batting.bat.sr') || getStat(player1Data, 'recentBatting.rows[0].values[3]');
  const p1Centuries = getStat(player1Data, 'batting.bat._100') || 0;

  const p2Matches = getStat(player2Data, 'batting.bat.matNr') || getStat(player2Data, 'recentBatting.rows[0].values[0]');
  const p2Runs = getStat(player2Data, 'batting.bat.runs') || getStat(player2Data, 'recentBatting.rows[0].values[1]');
  const p2SR = getStat(player2Data, 'batting.bat.sr') || getStat(player2Data, 'recentBatting.rows[0].values[3]');
  const p2Centuries = getStat(player2Data, 'batting.bat._100') || 0;
//Prepare data for the charts, using the extracted stats AYE AYE  
  const barData = {
    labels: ['Matches', 'Runs'],
    datasets: [
      {
        label: player1Data?.name || 'P1',
        data: [p1Matches, p1Runs],
        backgroundColor: 'rgba(0, 255, 136, 0.6)',
      },
      {
        label: player2Data?.name || 'P2',
        data: [p2Matches, p2Runs],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  const pieData = {
    labels: ['P1 SR %', 'P2 SR %'],
    datasets: [{
      data: [p1SR || 0, p2SR || 0],
      backgroundColor: ['rgba(0, 255, 136, 0.6)', 'rgba(255, 99, 132, 0.6)'],
    }],
  };

  const radarData = {
    labels: ['Matches', 'Runs', 'SR', '100s'],
    datasets: [
      {
        label: player1Data?.name || 'P1',
        data: [p1Matches, p1Runs, p1SR, p1Centuries],
        backgroundColor: 'rgba(0, 255, 136, 0.2)',
        borderColor: 'rgba(0, 255, 136, 1)',
        borderWidth: 2,
      },
      {
        label: player2Data?.name || 'P2',
        data: [p2Matches, p2Runs, p2SR, p2Centuries],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
    },
  };

  const barOptions = { ...chartOptions, scales: { y: { beginAtZero: true } } };
  const pieOptions = chartOptions;
  const radarOptions = { ...chartOptions, scales: { r: { beginAtZero: true } } };

//Search for Player by Name using /stats/v1/player/search endpoint (axios) (COOOL) YEBoi
async function searchPlayers(playerName) {
    const apiKey = process.env.REACT_APP_RAPIDAPI_KEY;
    if (!apiKey) {
      console.error('RapidAPI key not configured');
      return null;
    }
    
    const options = {
      method: 'GET',
      url: 'https://cricbuzz-cricket.p.rapidapi.com/stats/v1/player/search',
      params: { plrN: playerName.trim() },
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': RAPIDAPI_HOST,
        'Content-Type': 'application/json'
      }
    };
    
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
//Soek vir die speler se stats deur die id (COOOL) YEBoi
  async function getPlayerStats(playerId) {
    const apiKey = process.env.REACT_APP_RAPIDAPI_KEY;
    if (!apiKey) {
      console.error('RapidAPI key not configured');
      return null;
    }

    const options = {
      method: 'GET',
      url: `https://cricbuzz-cricket.p.rapidapi.com/stats/v1/player/${playerId}`,
params: { type: 'batting' },
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': RAPIDAPI_HOST,
        'Content-Type': 'application/json'
      }
    };
    
    //hanteer errors as die api call misluk
    try {
      const response = await axios.request(options);
      return response.data;
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        console.error('Stats error for playerId', playerId, ': Invalid API key - update .env');
      } else if (err.response?.status === 404) {
        console.error('Stats error for playerId', playerId, ': Player stats endpoint not found');
      } else {
        console.error('Stats error for playerId', playerId, ':', err.message);
      }
      return null;
    }
  }
//Hanteer die vergelyking van die twee spelers wanneer die vorm ingedien word
  async function handleCompare(event) {
    event.preventDefault();
//Valideer dat beide spelers se name ingevoer is 
    if (!firstPlayer || !secondPlayer) {
      setError('Please enter two player names to compare.');
      return;
    }

    setLoading(true);
    setError('');
    setPlayer1Data(null);
    setPlayer2Data(null);
    //Search for both players and fetch their stats. 
    //Handle errors if players are not found or if the API call fails YEBoi
    try {
      const p1 = await searchPlayers(firstPlayer.trim());
      const p2 = await searchPlayers(secondPlayer.trim());

      if (!p1) {
        setError(`Player "${firstPlayer}" not found.`);
        setLoading(false);
        return;
      }

      if (!p2) {
        setError(`Player "${secondPlayer}" not found.`);
        setLoading(false);
        return;
      }
      // Fetch stats for both players using their IDs Yes YES YESSSS
      const stats1 = await getPlayerStats(p1.id) || p1;
      const stats2 = await getPlayerStats(p2.id) || p2;

      // DEBUG: Log data structure to console to diagnose N/A
      console.log('Player 1 full data:', stats1);
      console.log('Player 2 full data:', stats2);
      console.log('Player 1 has batting.bat?', !!stats1.batting?.bat);
      console.log('Player 2 has batting.bat?', !!stats2.batting?.bat);

      setPlayer1Data(stats1);
      setPlayer2Data(stats2);
    } catch (err) {
      setError('Failed to fetch player data. Please try again.');
    }

    setLoading(false);
  }

  //Basic Ui for Comparison page Yooooohhhhhh
  return (
    <section className="comparison-page">
      <h1>Player Comparison</h1>
<p>Type two player names to compare their runs, strike rate, centuries, and more.</p>

      <form className="comparison-form" onSubmit={handleCompare}>
        <label>
          Player One
          <input
            type="text"
            placeholder="e.g. Virat Kohli"
            value={firstPlayer}
            onChange={(event) => setFirstPlayer(event.target.value)}
          />
        </label>

        <label>
          Player Two
          <input
            type="text"
            placeholder="e.g. AB de Villiers"
            value={secondPlayer}
            onChange={(event) => setSecondPlayer(event.target.value)}
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Compare'}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}
{player1Data && player2Data && (
        <div className="comparison-results">
          <div className="player-cards">
            <div className="player-card player-1">
              <h3>{player1Data.name}</h3>
<p className="player-role">{player1Data.role || 'Batsman'}</p>

              <div className="player-stats">


<span>Matches: {player1Data.batting?.bat?.matNr || player1Data.batting?.matNr || player1Data.recentBatting?.rows[0]?.values[0] || 'N/A'}</span>
                <span>Runs: {player1Data.batting?.bat?.runs || player1Data.batting?.runs || player1Data.recentBatting?.rows[0]?.values[1] || 'N/A'}</span>
                <span>Strike Rate: {player1Data.batting?.bat?.sr || player1Data.batting?.sr || player1Data.recentBatting?.rows[0]?.values[3] || 'N/A'}</span>
                <span>Centuries: {player1Data.batting?.bat?.hundreds || player1Data.batting?.hundreds || player1Data.recentBatting?.rows[0]?.values[4] || 'N/A'}</span>
              </div>

            </div>
          {/* Display player 2 data in a similar card format YEBoi */}
            <div className="player-card player-2">
              <h3>{player2Data.name}</h3>
<p className="player-role">{player2Data.role || 'Batsman'}</p>
              <div className="player-stats">

{/* Handles the N/a pronbleem by checking multiple possible paths for the stats and falling back to 'N/A' if none are found YEBoi */}
<span>Matches: {player2Data.batting?.bat?.matNr || player2Data.batting?.matNr || player2Data.recentBatting?.rows[0]?.values[0] || 'N/A'}</span>
                <span>Runs: {player2Data.batting?.bat?.runs || player2Data.batting?.runs || player2Data.recentBatting?.rows[0]?.values[1] || 'N/A'}</span>
                <span>Strike Rate: {player2Data.batting?.bat?.sr || player2Data.batting?.sr || player2Data.recentBatting?.rows[0]?.values[3] || 'N/A'}</span>
                <span>Centuries: {player2Data.batting?.bat?.hundreds || player2Data.batting?.bat?.hundreds || player2Data.recentBatting?.rows[0]?.values[4] || 'N/A'}</span>

              </div>
            </div>
          </div>
          {/* Charts comparing the two players CHartConfusion cry */}
          <div className="charts-section">
            <h3>Comparison Charts</h3>
            <div className="chart-grid">
              <div>
                {/*Bar chart comparing matches and runs for both players YEBoi */}
                <h4>Bar Chart - Matches/Runs</h4>
                <Bar data={barData} options={barOptions} />
              </div>
              <div>
                {/*Pie chart comparing strike rates for both players YEBoi */}
                <h4>Pie Chart - SR Contribution</h4>
                <Pie data={pieData} options={pieOptions} />
              </div>
              <div>
                {/*Radar chart comparing overall stats for both players YEBoi */}
                <h4>Radar Chart - Overall Stats</h4>
                <Radar data={radarData} options={radarOptions} />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Comparison;

