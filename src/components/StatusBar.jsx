import { UI_TEXT, HUMAN_ID, COMPUTER_ID } from "../game/config";
import { hasLegalCard } from "../game/gameActions";

export default function StatusBar({ gameState, onNewGame }) {
  const human = gameState.players.find((p) => p.id === HUMAN_ID);
  const computer = gameState.players.find((p) => p.id === COMPUTER_ID);

  let turnText;
  if (gameState.winnerId) {
    turnText = gameState.winnerId === HUMAN_ID ? UI_TEXT.gameOver.human : UI_TEXT.gameOver.computer;
  } else if (gameState.currentPlayerId === COMPUTER_ID) {
    turnText = UI_TEXT.turn.computer;
  } else if (hasLegalCard(human, computer)) {
    turnText = UI_TEXT.turn.humanPlay;
  } else {
    turnText = UI_TEXT.turn.humanDiscard;
  }

  return (
    <section className="status">
      <div className="status-turn">{turnText}</div>
      <div className="status-log">{gameState.lastActionText}</div>
      {gameState.winnerId && (
        <button className="new-game" onClick={onNewGame}>
          {UI_TEXT.newGame}
        </button>
      )}
    </section>
  );
}
