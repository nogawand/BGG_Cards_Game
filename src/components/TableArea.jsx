import PileCard from "./PileCard";
import { UI_TEXT, WINNING_SCORE } from "../game/config";

// The draw pile grows/shrinks from the end of the array (push/pop), so its
// "top" card - the next one to be drawn - is the last element. Likewise the
// top of the discard pile is the last card pushed onto it.
export default function TableArea({ gameState }) {
  const drawTopCard = gameState.drawPile[gameState.drawPile.length - 1] ?? null;
  const playedDiscardPile = gameState.discardPile.filter((card) => !card.thrownAway);
  const discardTopCard = playedDiscardPile[playedDiscardPile.length - 1] ?? null;

  return (
    <section className="table">
      <div className="pile">
        <div className="pile-card">
          <PileCard topCard={drawTopCard} hidden />
        </div>
        <div className="pile-count">{gameState.drawPile.length}</div>
        <div className="pile-label">{UI_TEXT.drawPileLabel}</div>
      </div>

      <div className="pile">
        <div className="pile-card">
          {/* Always a legitimately played card now (thrown-away discards are
              filtered out above), so it always shows its face. */}
          <PileCard topCard={discardTopCard} hidden={false} />
          
        </div> 
        <div className="pile-count">{playedDiscardPile.length}</div>
        <div className="pile-label">{UI_TEXT.discardPileLabel}</div>
      </div>

      <div className="pile">
        <div className="pile-count">{WINNING_SCORE}</div>
        <div className="pile-label">{UI_TEXT.pointsToWinLabel}</div>
      </div>
    </section>
  );
}