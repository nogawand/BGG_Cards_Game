import { useCallback, useRef, useState } from "react";
import { createGameState } from "../game/gameState";
import { takeTurnAction, chooseComputerCard } from "../game/gameActions";
import { HUMAN_ID, COMPUTER_ID, COMPUTER_DELAY_MS, UI_TEXT } from "../game/config";

// The engine keeps one mutable gameState object (same shape/functions as the
// original vanilla prototype). React only needs a "version" counter to know
// when to re-render; consumers always read the latest gameStateRef.current.
export function useGameEngine() {
  const gameStateRef = useRef(null);
  if (gameStateRef.current === null) {
    gameStateRef.current = createGameState();
  }
  const [, setVersion] = useState(0);
  const rerender = useCallback(() => setVersion((v) => v + 1), []);

  const runComputerTurn = useCallback(() => {
    const state = gameStateRef.current;
    if (state.winnerId || state.currentPlayerId !== COMPUTER_ID) return;
    const card = chooseComputerCard(state);
    if (card) {
      takeTurnAction(state, COMPUTER_ID, card.instanceId);
    } else {
      state.currentPlayerId = HUMAN_ID; // empty hand: pass
      state.lastActionText = UI_TEXT.log.computerNoCards;
    }
    rerender();
  }, [rerender]);

  const playHumanCard = useCallback(
    (cardInstanceId) => {
      const state = gameStateRef.current;
      const played = takeTurnAction(state, HUMAN_ID, cardInstanceId);
      if (!played) return;
      rerender();
      if (!state.winnerId) {
        setTimeout(runComputerTurn, COMPUTER_DELAY_MS);
      }
    },
    [rerender, runComputerTurn]
  );

  const startNewGame = useCallback(() => {
    gameStateRef.current = createGameState();
    rerender();
  }, [rerender]);

  return { gameState: gameStateRef.current, playHumanCard, startNewGame };
}
