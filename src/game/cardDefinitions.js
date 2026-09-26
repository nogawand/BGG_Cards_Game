import { Position, CARD_TEXT, CARD_POINTS } from "./config";

import takedownImg from "../assets/cards/takedown.jpg";
import mountImg from "../assets/cards/mount.jpg";
import sideControlImg from "../assets/cards/side_control.jpg";
import escapeSideImg from "../assets/cards/escape_side.jpg";
import escapeMountImg from "../assets/cards/escape_mount.jpg";
import guardImg from "../assets/cards/guard.jpg";
import guardEscapeImg from "../assets/cards/guard_escape.jpg";
import sweepImg from "../assets/cards/sweep.jpg";

// Each definition is data + two pure functions:
//   canPlay(myState, opponentState) -> boolean
//   getResult(myState, opponentState) -> { myState, opponentState }
export const CARD_DEFINITIONS = Object.freeze({
  TAKEDOWN: {
    id: "TAKEDOWN",
    displayName: CARD_TEXT.TAKEDOWN.displayName,
    ruleText: CARD_TEXT.TAKEDOWN.ruleText,
    points: CARD_POINTS.TAKEDOWN,
    faceImage: takedownImg,
    // Both players standing.
    canPlay: (myState, opponentState) =>
      myState === Position.STANDING && opponentState === Position.STANDING,
    getResult: () => ({
      myState: Position.STANDING,
      opponentState: Position.ON_BACK,
    }),
  },
  MOUNT: {
    id: "MOUNT",
    displayName: CARD_TEXT.MOUNT.displayName,
    ruleText: CARD_TEXT.MOUNT.ruleText,
    points: CARD_POINTS.MOUNT,
    faceImage: mountImg,
    // Opponent on their back, and you are standing, on your knees, or already in side control.
    canPlay: (myState, opponentState) =>
      opponentState === Position.ON_BACK &&
      (myState === Position.STANDING ||
        myState === Position.KNEES ||
        myState === Position.SIDE_CONTROL),
    getResult: () => ({
      myState: Position.MOUNT_CONTROL,
      opponentState: Position.ON_BACK,
    }),
  },
  SIDE_CONTROL: {
    id: "SIDE_CONTROL",
    displayName: CARD_TEXT.SIDE_CONTROL.displayName,
    ruleText: CARD_TEXT.SIDE_CONTROL.ruleText,
    points: CARD_POINTS.SIDE_CONTROL,
    faceImage: sideControlImg,
    // Opponent on their back, and you are standing, on your knees, already mounted, or already in guard control.
    canPlay: (myState, opponentState) =>
      opponentState === Position.ON_BACK &&
      (myState === Position.STANDING ||
        myState === Position.KNEES ||
        myState === Position.MOUNT_CONTROL ||
        myState === Position.GUARD_CONTROL),
    getResult: () => ({
      myState: Position.SIDE_CONTROL,
      opponentState: Position.ON_BACK,
    }),
  },
  ESCAPE_SIDE: {
    id: "ESCAPE_SIDE",
    displayName: CARD_TEXT.ESCAPE_SIDE.displayName,
    ruleText: CARD_TEXT.ESCAPE_SIDE.ruleText,
    points: CARD_POINTS.ESCAPE_SIDE,
    faceImage: escapeSideImg,
    // You are on your back, pinned in the opponent's side control.
    canPlay: (myState, opponentState) =>
      myState === Position.ON_BACK && opponentState === Position.SIDE_CONTROL,
    getResult: () => ({
      myState: Position.KNEES,
      opponentState: Position.KNEES,
    }),
  },
  ESCAPE_MOUNT: {
    id: "ESCAPE_MOUNT",
    displayName: CARD_TEXT.ESCAPE_MOUNT.displayName,
    ruleText: CARD_TEXT.ESCAPE_MOUNT.ruleText,
    points: CARD_POINTS.ESCAPE_MOUNT,
    faceImage: escapeMountImg,
    // You are on your back, pinned under the opponent's mount.
    canPlay: (myState, opponentState) =>
      myState === Position.ON_BACK && opponentState === Position.MOUNT_CONTROL,
    getResult: () => ({
      myState: Position.KNEES,
      opponentState: Position.KNEES,
    }),
  },
  GUARD: {
    id: "GUARD",
    displayName: CARD_TEXT.GUARD.displayName,
    ruleText: CARD_TEXT.GUARD.ruleText,
    points: CARD_POINTS.GUARD,
    faceImage: guardImg,
    // Either you're on your back and the opponent is on their knees trying to
    // pass, or you're both on your knees and you close guard first.
    canPlay: (myState, opponentState) =>
      (myState === Position.ON_BACK && opponentState === Position.KNEES) ||
      (myState === Position.KNEES && opponentState === Position.KNEES),
    getResult: () => ({
      myState: Position.GUARD_CONTROL,
      opponentState: Position.IN_GUARD,
    }),
  },
  GUARD_ESCAPE: {
    id: "GUARD_ESCAPE",
    displayName: CARD_TEXT.GUARD_ESCAPE.displayName,
    ruleText: CARD_TEXT.GUARD_ESCAPE.ruleText,
    points: CARD_POINTS.GUARD_ESCAPE,
    faceImage: guardEscapeImg,
    // You're stuck in the opponent's guard and posture up to break free.
    canPlay: (myState, opponentState) =>
      myState === Position.IN_GUARD && opponentState === Position.GUARD_CONTROL,
    getResult: () => ({
      myState: Position.KNEES,
      opponentState: Position.ON_BACK,
    }),
  },
  SWEEP: {
    id: "SWEEP",
    displayName: CARD_TEXT.SWEEP.displayName,
    ruleText: CARD_TEXT.SWEEP.ruleText,
    points: CARD_POINTS.SWEEP,
    faceImage: sweepImg,
    // From guard control, you reverse the opponent straight into mount.
    canPlay: (myState, opponentState) =>
      myState === Position.GUARD_CONTROL && opponentState === Position.IN_GUARD,
    getResult: () => ({
      myState: Position.MOUNT_CONTROL,
      opponentState: Position.ON_BACK,
    }),
  },
});
