import { Position, HAND_SIZE, CARD_COPIES, HUMAN_ID, COMPUTER_ID } from "./config.js";
import { UI_TEXT } from "./config.js";
import { CARD_DEFINITIONS } from "./cardDefinitions.js";

let nextCardInstanceId = 1;

export function createCard(definitionId) {
  return { instanceId: nextCardInstanceId++, definitionId };
}

export function createDeck() {
  const deck = [];
  for (const definitionId of Object.keys(CARD_DEFINITIONS)) {
    const copies = CARD_COPIES[definitionId] || 8; 
    for (let i = 0; i < copies; i++) {
      deck.push(createCard(definitionId));
    }
  }
  return deck;
}

// Fisher-Yates, returns a new array
export function shuffle(cards) {
  const result = [...cards];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function drawCards(gameState, player, count) {
  for (let i = 0; i < count; i++) {
    if (gameState.drawPile.length === 0) {
      // Draw pile exhausted: recycle the discard pile
      gameState.drawPile = shuffle(gameState.discardPile);
      gameState.discardPile = [];
    }
    if (gameState.drawPile.length === 0) return; // nothing left anywhere
    player.hand.push(gameState.drawPile.pop());
  }
}

export function createPlayer(id, name) {
  return {
    id,
    name,
    hand: [],
    position: Position.STANDING,
    score: 0,
    mountControlRoundsHeld: 0,
    scrambleCount: 0,
  };
}

export function createGameState() {
  const gameState = {
    drawPile: shuffle(createDeck()),
    discardPile: [],
    currentPlayerId: HUMAN_ID,
    lastActionText: "",
    winnerId: null,
    players: [
      createPlayer(HUMAN_ID, UI_TEXT.humanName),
      createPlayer(COMPUTER_ID, UI_TEXT.computerName),
    ],
  };
  gameState.players.forEach((player) => drawCards(gameState, player, HAND_SIZE));
  return gameState;
}
