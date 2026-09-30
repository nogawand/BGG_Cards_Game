import { UI_TEXT } from "../game/config";

export default function MusicToggle({ muted, onToggle }) {
  const label = muted ? UI_TEXT.music.play : UI_TEXT.music.mute;

  return (
    <button
      type="button"
      className="music-toggle"
      onClick={onToggle}
      aria-pressed={!muted}
      aria-label={label}
      title={label}
    >
      {muted ? "🔇" : "🔊"}
    </button>
  );
}
