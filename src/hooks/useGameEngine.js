import { useCallback, useRef, useState } from "react";
import { createGameState } from "../game/gameState.js";
import { takeTurnAction, chooseComputerCard, scrambleHand, getLegalCards } from "../game/gameActions.js";
import { HUMAN_ID, COMPUTER_ID, COMPUTER_DELAY_MS, UI_TEXT } from "../game/config.js";

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
    
    const computerPlayer = state.players.find((p) => p.id === COMPUTER_ID);
    const humanPlayer = state.players.find((p) => p.id === HUMAN_ID);
    
    const legalCards = getLegalCards(computerPlayer, humanPlayer);

    if (legalCards.length > 0) {
      const card = chooseComputerCard(state);
      takeTurnAction(state, COMPUTER_ID, card.instanceId);
    } else {
      if (computerPlayer.scrambleCount < 3) {
        scrambleHand(state, COMPUTER_ID);

        const newLegalCards = getLegalCards(computerPlayer, humanPlayer);
        if (newLegalCards.length > 0) {
          const card = chooseComputerCard(state);
          takeTurnAction(state, COMPUTER_ID, card.instanceId);
        } else {

          state.currentPlayerId = HUMAN_ID;
        }
      } else {
        state.currentPlayerId = HUMAN_ID; 
        state.lastActionText = UI_TEXT.log.computerNoCards;
      }
    }
    
    rerender();
  }, [rerender]);
  
  const playHumanCard = useCallback(
    (cardInstanceId) => {
      const state = gameStateRef.current;
      const played = takeTurnAction(state, HUMAN_ID, cardInstanceId);
      if (!played) return;
      rerender();
      
      if (!state.winnerId && state.currentPlayerId === COMPUTER_ID) {
        setTimeout(runComputerTurn, COMPUTER_DELAY_MS);
      }
    },
    [rerender, runComputerTurn]
  );

  const scrambleHumanHand = useCallback(() => {
    const state = gameStateRef.current;
    if (state.winnerId || state.currentPlayerId !== HUMAN_ID) return;
    
    const success = scrambleHand(state, HUMAN_ID);
    if (success) {
      rerender();
    }
  }, [rerender]);

  const startNewGame = useCallback(() => {
    gameStateRef.current = createGameState();
    rerender();
  }, [rerender]);

  return { 
    gameState: gameStateRef.current, 
    playHumanCard, 
    startNewGame, 
    scrambleHumanHand 
  };
}