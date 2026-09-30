import { useEffect } from "react";
import "./App.css";
import GameBoard from "./components/GameBoard";
import MusicToggle from "./components/MusicToggle";
import { useGameEngine } from "./hooks/useGameEngine";
import { useBackgroundMusic } from "./hooks/useBackgroundMusic";
import { UI_TEXT } from "./game/config";
import { runGameSimulations } from "./game/gameSimulation.test.js";

export default function App() {
  const { gameState, playHumanCard, startNewGame, scrambleHumanHand } = useGameEngine();
  const { muted, toggle } = useBackgroundMusic();

  useEffect(() => {
    window.runSim = runGameSimulations;
  }, []);

  return (
    <div className="app">
      <MusicToggle muted={muted} onToggle={toggle} />
      <h1>{UI_TEXT.gameTitle}</h1>
      <GameBoard 
        gameState={gameState} 
        onPlayCard={playHumanCard} 
        onNewGame={startNewGame}
        onScramble={scrambleHumanHand}
      />
    </div>
  );
}