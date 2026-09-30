// Ambient background pad built with the Web Audio API - no audio file to
// bundle or license. A soft bass note plus a gentle A-minor triad, each
// slowly "breathing" in volume, looping forever.
//
// This module is the single source of truth for the audio state (context,
// master volume, muted flag). React only reads it through the hook.

let audioContext = null;
let masterGain = null;
let muted = true; // browsers block audio until a click, so we start muted

// Master level when unmuted. Tuned so it sits quietly under the game but is
// still clearly audible on laptop and phone speakers.
const SUBTLE_VOLUME = 0.6;

// Kept above ~100 Hz on purpose: small speakers can't reproduce deep bass,
// which made an earlier, lower version effectively inaudible. `gain` is each
// voice's average level; the slow LFO swings it +/-50% around that.
const VOICES = [
  { frequency: 110.0, type: "sine", gain: 0.16 }, // A2 (bass)
  { frequency: 220.0, type: "triangle", gain: 0.1 }, // A3
  { frequency: 261.63, type: "triangle", gain: 0.08 }, // C4
  { frequency: 329.63, type: "triangle", gain: 0.08 }, // E4
];

function createVoice(context, destination, { frequency, type, gain }, detuneCents) {
  const oscillator = context.createOscillator();
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  oscillator.detune.value = detuneCents;

  // Rounds off the triangle waves' sharper harmonics so the pad stays soft.
  const filter = context.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 1200;

  const voiceGain = context.createGain();
  voiceGain.gain.value = gain;

  // Very slow LFO makes the voice gently swell in and out instead of
  // droning at a flat volume.
  const lfo = context.createOscillator();
  lfo.frequency.value = 0.04 + Math.random() * 0.03;
  const lfoDepth = context.createGain();
  lfoDepth.gain.value = gain * 0.5;
  lfo.connect(lfoDepth);
  lfoDepth.connect(voiceGain.gain);

  oscillator.connect(filter);
  filter.connect(voiceGain);
  voiceGain.connect(destination);

  oscillator.start();
  lfo.start();
}

// Exported separately from the context handling so it can be tested with an
// OfflineAudioContext.
export function buildAmbientPad(context, destination) {
  VOICES.forEach((voice, index) => createVoice(context, destination, voice, (index - 1.5) * 4));
}

function ensureContext() {
  if (audioContext) return audioContext;

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null; // browser has no Web Audio support

  const context = new AudioContextClass();
  const master = context.createGain();
  master.gain.value = 0; // fades in when unmuted
  master.connect(context.destination);
  buildAmbientPad(context, master);

  audioContext = context;
  masterGain = master;
  return context;
}

export function isBackgroundMusicMuted() {
  return muted;
}

// IMPORTANT: call this synchronously from inside a click/tap handler.
// Browsers (Safari especially) only let an AudioContext start or resume
// during a user gesture, so it must not be deferred - not inside a React
// state updater, a setTimeout, a promise callback, or an effect.
// Returns true if the change was applied, false if audio isn't available.
export function setBackgroundMusicMuted(nextMuted) {
  try {
    const context = ensureContext();
    if (!context) return false;

    if (context.state !== "running" && context.state !== "closed") {
      context.resume().catch(() => {});
    }

    const now = context.currentTime;
    masterGain.gain.cancelScheduledValues(now);
    masterGain.gain.setTargetAtTime(nextMuted ? 0 : SUBTLE_VOLUME, now, 0.4);
    muted = nextMuted;
    return true;
  } catch (error) {
    console.warn("Background music unavailable:", error);
    return false;
  }
}

export function teardownBackgroundMusic() {
  if (audioContext) audioContext.close().catch(() => {});
  audioContext = null;
  masterGain = null;
  muted = true;
}

// Vite hot reload swaps this module for a fresh copy but would leave the old
// AudioContext playing in the background, with no way to reach it from the
// new copy - which looks like a mute button that doesn't work. Close it.
if (import.meta.hot) {
  import.meta.hot.dispose(teardownBackgroundMusic);
}
