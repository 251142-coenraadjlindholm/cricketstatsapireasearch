import React, { useState } from 'react';
import './Comparison.css';

const RAPIDAPI_KEY = '0d125b03b2msh63978c0b24b8a01p1a5f47jsnb33b4e2e589c';
const RAPIDAPI_HOST = 'cricbuzz-cricket.p.rapidapi.com';

function Comparison() {
  const [firstPlayer, setFirstPlayer] = useState('');
  const [secondPlayer, setSecondPlayer] = useState('');
  const [player1Data, setPlayer1Data] = useState(null);
  const [player2Data, setPlayer2Data] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function searchPlayers(playerName) {
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST
      }
    };

    try {
      const response = await fetch(`https://cricbuzz-cricket.p.rapidapi.com/player/v1/search/${playerName}`, options);
      const data = await response.json();
      
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
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST
      }
    };

    try {
      const response = await fetch(`https://cricbuzz-cricket.p.rapidapi.com/player/v1/stats/${playerId}`, options);
      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Stats error:', err);
      return null;
    }
  }

  async function handleCompare(event) {
    event.preventDefault();

    if (!firstPlayer || !secondPlayer) {
      setError('Please enter two player names to compare.');
      return;
    }

    setLoading(true);
    setError('');
    setPlayer1Data(null);
    setPlayer2Data(null);

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

      const stats1 = await getPlayerStats(p1.id);
      const stats2 = await getPlayerStats(p2.id);

      setPlayer1Data({ ...p1, ...stats1 });
      setPlayer2Data({ ...p2, ...stats2 });
    } catch (err) {
      setError('Failed to fetch player data. Please try again.');
    }

    setLoading(false);
  }

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
                <span>Matches: {player1Data.batting?.matches || 'N/A'}</span>
                <span>Runs: {player1Data.batting?.runs || 'N/A'}</span>
                <span>Avg: {player1Data.batting?.avg || 'N/A'}</span>
                <span>SR: {player1Data.batting?.strikeRate || 'N/A'}</span>
              </div>
            </div>
            <div className="player-card player-2">
              <h3>{player2Data.name}</h3>
              <p className="player-role">{player2Data.role || 'Batsman'}</p>
              <div className="player-stats">
                <span>Matches: {player2Data.batting?.matches || 'N/A'}</span>
                <span>Runs: {player2Data.batting?.runs || 'N/A'}</span>
                <span>Avg: {player2Data.batting?.avg || 'N/A'}</span>
                <span>SR: {player2Data.batting?.strikeRate || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Comparison;

