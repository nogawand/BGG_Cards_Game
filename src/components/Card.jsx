// dimmed: visually greyed out (cannot be selected at all).
// interactive: clickable/focusable (either it's a legal play, or the player
// has no legal card and must throw one away).
export default function Card({ definition, dimmed, interactive, onClick }) {
  const className = `card${dimmed ? " unplayable" : ""}${interactive ? " interactive" : ""}`;

  const handleKeyDown = (event) => {
    if (!interactive) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className={className}
      title={definition.ruleText}
      tabIndex={interactive ? 0 : undefined}
      role={interactive ? "button" : undefined}
      onClick={interactive ? onClick : undefined}
      onKeyDown={handleKeyDown}
    >
      <img src={definition.faceImage} alt={definition.displayName} draggable="false" />
      <span className="card-points">{definition.points}</span>
    </div>
  );
}
