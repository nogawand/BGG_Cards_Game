import PlayerArea from "./PlayerArea";
import TableArea from "./TableArea";
import StatusBar from "./StatusBar";
import { HUMAN_ID, COMPUTER_ID } from "../game/config";

export default function GameBoard({ gameState, onPlayCard, onNewGame }) {
  const human = gameState.players.find((p) => p.id === HUMAN_ID);
  const computer = gameState.players.find((p) => p.id === COMPUTER_ID);

  return (
    <main>
      <PlayerArea player={computer} opponent={human} gameState={gameState} onPlayCard={onPlayCard} />
      <TableArea gameState={gameState} />
      <StatusBar gameState={gameState} onNewGame={onNewGame} />
      <PlayerArea player={human} opponent={computer} gameState={gameState} onPlayCard={onPlayCard} />
    </main>
  );
}
