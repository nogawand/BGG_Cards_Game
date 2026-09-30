import { useCallback, useState } from "react";
import { isBackgroundMusicMuted, setBackgroundMusicMuted } from "../audio/backgroundMusic";

// The audio module owns the real state; this hook just mirrors it into React
// so the button icon re-renders.
export function useBackgroundMusic() {
  const [muted, setMuted] = useState(isBackgroundMusicMuted);

  const toggle = useCallback(() => {
    const nextMuted = !isBackgroundMusicMuted();
    // Runs synchronously inside the click handler on purpose - browsers only
    // allow audio to start during a user gesture. (Doing this inside a
    // setMuted(updater) callback was fragile: React may run updaters later,
    // outside the gesture, and StrictMode runs them twice.)
    if (setBackgroundMusicMuted(nextMuted)) {
      setMuted(nextMuted);
    }
  }, []);

  return { muted, toggle };
}
