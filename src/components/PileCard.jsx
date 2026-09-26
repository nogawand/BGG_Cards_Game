import CardBack from "./CardBack";
import { CARD_DEFINITIONS } from "../game/cardDefinitions";
import { UI_TEXT } from "../game/config";

export default function PileCard({ topCard, hidden }) {
  if (!topCard) {
    return (
      <div className="card-back pile-empty">
        <span>{UI_TEXT.emptyPile}</span>
      </div>
    );
  }

  if (hidden) return <CardBack />;

  const definition = CARD_DEFINITIONS[topCard.definitionId];
  return (
    <div className="card">
      <img src={definition.faceImage} alt={definition.displayName} draggable="false" />
      <span className="card-points">{definition.points}</span>
    </div>
  );
}
