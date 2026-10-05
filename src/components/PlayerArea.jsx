import Hand from "./Hand";
import { POSITION_LABELS, UI_TEXT, HUMAN_ID } from "../game/config";

export default function PlayerArea({ player, opponent, gameState, onPlayCard, onScramble }) {
  const hidden = player.id !== HUMAN_ID;
  const isPlayersTurn = !gameState.winnerId && gameState.currentPlayerId === player.id;

  const playerHead = (
    <div className="player-head">
      <span className="player-name">{player.name}</span>
      <span className="position">{POSITION_LABELS[player.position]}</span>
      <span className="score">{UI_TEXT.score(player.score)}</span>
    </div>
  );

  const playerHand = (
    <Hand
      player={player}
      opponent={opponent}
      hidden={hidden}
      isPlayersTurn={isPlayersTurn}
      onPlayCard={onPlayCard}
    />
  );

  return (
    <section>
      {hidden ? (
        <>
          {playerHand}
          <div style={{ marginTop: '8px' }}>{playerHead}</div>
        </>
      ) : (
        <>
          {playerHead}
          <div className="you-hand-container">
            {playerHand}
          </div>
          <button 
  onClick={onScramble}
  disabled={player.scrambleCount >= 3 || !isPlayersTurn}
  style={{ marginTop: '8px' }}
>
  {player.scrambleCount >= 3 
    ? UI_TEXT.scrambleButton.noMore 
    : UI_TEXT.scrambleButton.active(player.scrambleCount, 3)}
</button>
        </>
      )}
    </section>
  );
}