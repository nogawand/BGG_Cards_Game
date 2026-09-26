import { HUMAN_ID, COMPUTER_ID, WINNING_SCORE, MOUNT_CONTROL_BONUS, Position, UI_TEXT } from "./config";
import { CARD_DEFINITIONS } from "./cardDefinitions";
import { drawCards } from "./gameState";
import { HAND_SIZE } from "./config";

// Plays a card from a player's hand. Returns true if the card was played.
export function playCard(gameState, playerId, cardInstanceId) {
  const player = gameState.players.find((p) => p.id === playerId);
  const opponent = gameState.players.find((p) => p.id !== playerId);
  if (!player || !opponent) return false;

  const cardIndex = player.hand.findIndex((c) => c.instanceId === cardInstanceId);
  if (cardIndex === -1) return false;

  const card = player.hand[cardIndex];
  const definition = CARD_DEFINITIONS[card.definitionId];
  if (!definition.canPlay(player.position, opponent.position)) return false;

  // 1. Apply state transition
  const result = definition.getResult(player.position, opponent.position);
  player.position = result.myState;
  opponent.position = result.opponentState;

  // 2. Score
  player.score += definition.points;

  // 3. Move card to discard pile and refill hand back to HAND_SIZE
  player.hand.splice(cardIndex, 1);
  gameState.discardPile.push(card);
  drawCards(gameState, player, HAND_SIZE - player.hand.length);

  return true;
}

export function getLegalCards(player, opponent) {
  return player.hand.filter((card) =>
    CARD_DEFINITIONS[card.definitionId].canPlay(player.position, opponent.position)
  );
}

export function hasLegalCard(player, opponent) {
  return getLegalCards(player, opponent).length > 0;
}

// Throws a card away and draws a replacement. Only allowed by takeTurnAction when no legal card exists.
export function discardCard(gameState, player, cardInstanceId) {
  const cardIndex = player.hand.findIndex((c) => c.instanceId === cardInstanceId);
  if (cardIndex === -1) return false;
  const [card] = player.hand.splice(cardIndex, 1);
  drawCards(gameState, player, 1); // draw first so the thrown card can't come straight back
  gameState.discardPile.push(card);
  return true;
}

// One action per turn: play a legal card, or (only if no legal card) throw a card away.
// Ends the turn on success. Returns true if the action was taken.
export function takeTurnAction(gameState, playerId, cardInstanceId) {
  if (gameState.winnerId || gameState.currentPlayerId !== playerId) return false;
  const player = gameState.players.find((p) => p.id === playerId);
  const opponent = gameState.players.find((p) => p.id !== playerId);
  const card = player.hand.find((c) => c.instanceId === cardInstanceId);
  if (!card) return false;

  const definition = CARD_DEFINITIONS[card.definitionId];
  const isHuman = playerId === HUMAN_ID;

  if (playCard(gameState, playerId, cardInstanceId)) {
    const playedText = isHuman ? UI_TEXT.log.humanPlayed : UI_TEXT.log.computerPlayed;
    gameState.lastActionText = playedText(definition.displayName, definition.points);
  } else if (!hasLegalCard(player, opponent) && discardCard(gameState, player, cardInstanceId)) {
    gameState.lastActionText = isHuman ? UI_TEXT.log.humanDiscarded : UI_TEXT.log.computerDiscarded;
  } else {
    return false;
  }

  // Bonus: the opponent (relative to this actor) keeps their mount through this whole turn
  if (opponent.position === Position.MOUNT_CONTROL) {
    opponent.score += MOUNT_CONTROL_BONUS;
    gameState.lastActionText += " | " + UI_TEXT.log.mountBonus(opponent.name, MOUNT_CONTROL_BONUS);
  }

  // Win check: first player to reach WINNING_SCORE ends the game (no next turn)
  const winner = gameState.players.find((p) => p.score >= WINNING_SCORE);
  if (winner) {
    gameState.winnerId = winner.id;
    return true;
  }

  gameState.currentPlayerId = opponent.id;
  return true;
}

function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

// Computer sees its own hand: plays the most valuable legal card, otherwise throws a random one.
export function chooseComputerCard(gameState) {
  const player = gameState.players.find((p) => p.id === COMPUTER_ID);
  const opponent = gameState.players.find((p) => p.id === HUMAN_ID);
  const legalCards = getLegalCards(player, opponent);
  if (legalCards.length > 0) {
    const pointsOf = (card) => CARD_DEFINITIONS[card.definitionId].points;
    const bestPoints = Math.max(...legalCards.map(pointsOf));
    return pickRandom(legalCards.filter((card) => pointsOf(card) === bestPoints));
  }
  return pickRandom(player.hand) ?? null;
}
