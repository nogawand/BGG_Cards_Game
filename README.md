# BJJ Card Game (React + Vite)

## Setup

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

## Project layout

- `src/game/` - pure game logic, no React: `config.js` (constants + all Hebrew
  UI text), `cardDefinitions.js` (the 8 cards' rules and images),
  `gameState.js` (deck/board setup), `gameActions.js` (turns, scoring, the
  computer's card choice).
- `src/hooks/useGameEngine.js` - wraps the game logic in a React hook.
- `src/components/` - `GameBoard`, `PlayerArea`, `Hand`, `Card`, `CardBack`,
  `TableArea`, `PileCard`, `StatusBar`.
- `src/assets/cards/` - the 8 card face images.
