import suspenseMusic from './leberch-suspense.mp3';

let audio = null;
let muted = true;

function getAudio() {
  if (!audio) {
    audio = new Audio(suspenseMusic);
    audio.loop = true;
  }
  return audio;
}

export function isBackgroundMusicMuted() {
  return muted;
}

export function setBackgroundMusicMuted(nextMuted) {
  try {
    const sound = getAudio();
    if (nextMuted) {
      sound.pause();
    } else {
      sound.play().catch((err) => {
        console.warn("Audio play blocked or failed:", err);
      });
    }
    muted = nextMuted;
    return true;
  } catch (error) {
    console.warn("Background music unavailable:", error);
    return false;
  }
}

export function teardownBackgroundMusic() {
  if (audio) {
    audio.pause();
    audio = null;
  }
  muted = true;
}

if (import.meta.hot) {
  import.meta.hot.dispose(teardownBackgroundMusic);
}