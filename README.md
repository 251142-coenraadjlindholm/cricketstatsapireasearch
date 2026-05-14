# Cricket Stats API Search (Cricket Hub)

A React web app for exploring and comparing cricket player batting statistics using the **Cricbuzz (RapidAPI) stats endpoints**.

It provides 3 main pages:
- **Home** – quick introduction
- **Comparison** – compare two players (runs, strike rate, centuries, etc.) with charts
- **Timeline** – show a player’s career progression over time (visualized via a line chart)

## Demo / Screenshots
- Use case diagram: `src/Use Case Diagram.png`

## Features
- Player search by name (RapidAPI)
- Fetch batting career stats (RapidAPI)
- Side-by-side comparison charts (Bar, Pie, Radar)
- Timeline visualization with selectable stat type

## Tech Stack
- React (create-react-app)
- React Router (client-side routing)
- Axios (HTTP requests)
- Chart.js + react-chartjs-2 (charts)
- CSS styling (App + page-specific CSS)

## Project Setup
### 1) Install dependencies
```bash
npm install
```

### 2) Configure RapidAPI key
Create a `.env` file in the project root:

```env
REACT_APP_RAPIDAPI_KEY=your_rapidapi_key_here
```

> Note: the app expects the key to be available as `process.env.REACT_APP_RAPIDAPI_KEY`.

### 3) Run locally
```bash
npm start
```
Open the shown URL (usually `http://localhost:3000`).

### 4) Build for production
```bash
npm run build
```

## API Endpoints Used
The frontend calls RapidAPI at:
- Player search:
  - `GET https://cricbuzz-cricket.p.rapidapi.com/stats/v1/player/search`
  - Query param: `plrN`
- Player batting stats:
  - `GET https://cricbuzz-cricket.p.rapidapi.com/stats/v1/player/{playerId}/batting`

## Where the Code Lives
- `src/App.js` – routing and overall layout (Home / Comparison / Timeline)
- `src/Home.js` – landing page
- `src/Comparison.js` – compare two players and render charts
- `src/Timeline.js` – player search + timeline chart
- `src/Footer.js` – site footer
- `src/*.css` – styling

## Important Notes / Limitations
- This is a **frontend-only** app. API calls are made directly from the browser.
- API responses are parsed defensively (missing values fall back to `0` / `N/A`).
- The **Timeline** currently generates a visual progression from career totals (distributed across a range of years). This is meant for visualization rather than exact year-by-year cricket data.

## Licensing / Credits
- Data source: **Cricbuzz API via RapidAPI**
- Charts: Chart.js

## Author
- [Coenraad Lindholm 251142]

