import "./App.css";
import GameBoard from "./components/GameBoard";
import MusicToggle from "./components/MusicToggle";
import { useGameEngine } from "./hooks/useGameEngine";
import { useBackgroundMusic } from "./hooks/useBackgroundMusic";
import { UI_TEXT } from "./game/config";

export default function App() {
  const { gameState, playHumanCard, startNewGame } = useGameEngine();
  const { muted, toggle } = useBackgroundMusic();

  return (
    <div className="app">
      <MusicToggle muted={muted} onToggle={toggle} />
      <h1>{UI_TEXT.gameTitle}</h1>
      <GameBoard gameState={gameState} onPlayCard={playHumanCard} onNewGame={startNewGame} />
    </div>
  );
}
