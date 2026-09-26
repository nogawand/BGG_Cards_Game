import "./App.css";
import GameBoard from "./components/GameBoard";
import { useGameEngine } from "./hooks/useGameEngine";
import { UI_TEXT } from "./game/config";

export default function App() {
  const { gameState, playHumanCard, startNewGame } = useGameEngine();

  return (
    <div className="app">
      <h1>{UI_TEXT.gameTitle}</h1>
      <GameBoard gameState={gameState} onPlayCard={playHumanCard} onNewGame={startNewGame} />
    </div>
  );
}
