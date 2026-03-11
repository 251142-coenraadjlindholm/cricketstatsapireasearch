import './Comparison.css';
import { useState } from "react";

function Comparison() {
  const [firstPlayer, setFirstPlayer] = useState('');
  const [secondPlayer, setSecondPlayer] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!firstPlayer.trim() || !secondPlayer.trim()) {
      setMessage('Enter two player names to compare.');
      return;
    }

    setMessage(`Comparing ${firstPlayer.trim()} vs ${secondPlayer.trim()}...`);
  };

  return (
    <section className="comparison-page">
      <h1>Player Comparison</h1>
      <p>
        Type two player names to compare their runs, strike rate, and
        boundaries.
      </p>

      <form className="comparison-form" onSubmit={handleSubmit}>
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

        <button type="submit">Compare</button>
      </form>

      {message && <p className="status-message">{message}</p>}
    </section>
  );
}

export default Comparison ;