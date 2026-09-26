import Hand from "./Hand";
import { POSITION_LABELS, UI_TEXT, HUMAN_ID } from "../game/config";

export default function PlayerArea({ player, opponent, gameState, onPlayCard }) {
  const hidden = player.id !== HUMAN_ID;
  const isPlayersTurn = !gameState.winnerId && gameState.currentPlayerId === player.id;

  return (
    <section className="player">
      <div className="player-head">
        <span className="player-name">{player.name}</span>
        <span className="position">{POSITION_LABELS[player.position]}</span>
        <span className="score">{UI_TEXT.score(player.score)}</span>
      </div>
      <Hand
        player={player}
        opponent={opponent}
        hidden={hidden}
        isPlayersTurn={isPlayersTurn}
        onPlayCard={onPlayCard}
      />
    </section>
  );
}
