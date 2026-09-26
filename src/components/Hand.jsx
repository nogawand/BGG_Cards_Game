import Card from "./Card";
import CardBack from "./CardBack";
import { CARD_DEFINITIONS } from "../game/cardDefinitions";
import { hasLegalCard } from "../game/gameActions";

export default function Hand({ player, opponent, hidden, isPlayersTurn, onPlayCard }) {
  const mustDiscard = !hasLegalCard(player, opponent);

  return (
    <div className="hand">
      {player.hand.map((card) => {
        if (hidden) return <CardBack key={card.instanceId} />;

        const definition = CARD_DEFINITIONS[card.definitionId];
        const playable = definition.canPlay(player.position, opponent.position);
        const selectable = playable || mustDiscard;

        return (
          <Card
            key={card.instanceId}
            definition={definition}
            dimmed={!selectable}
            interactive={isPlayersTurn && selectable}
            onClick={() => onPlayCard(card.instanceId)}
          />
        );
      })}
    </div>
  );
}
