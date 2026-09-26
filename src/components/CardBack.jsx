import { UI_TEXT } from "../game/config";

export default function CardBack() {
  return (
    <div className="card-back" aria-label={UI_TEXT.hiddenCard}>
      <span>{UI_TEXT.hiddenCard}</span>
    </div>
  );
}
