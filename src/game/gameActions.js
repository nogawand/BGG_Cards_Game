import { HUMAN_ID, COMPUTER_ID, WINNING_SCORE, Position, UI_TEXT, HAND_SIZE } from "./config";
import { CARD_DEFINITIONS } from "./cardDefinitions";
import { drawCards } from "./gameState";

function applyMountControlEntry(entity, newPosition, priorPosition, pointsIfEntering) {
  if (newPosition === Position.MOUNT_CONTROL) {
    if (priorPosition !== Position.MOUNT_CONTROL) {
      entity.pendingMountPoints = pointsIfEntering;
    }
  } else {
    entity.pendingMountPoints = 0;
  }
}

export function playCard(gameState, playerId, cardInstanceId) {
  const player = gameState.players.find((p) => p.id === playerId);
  const opponent = gameState.players.find((p) => p.id !== playerId);
  if (!player || !opponent) return null;

  const cardIndex = player.hand.findIndex((c) => c.instanceId === cardInstanceId);
  if (cardIndex === -1) return null;

  const card = player.hand[cardIndex];
  const definition = CARD_DEFINITIONS[card.definitionId];
  const fromMyState = player.position;
  const fromOpponentState = opponent.position;
  if (!definition.canPlay(fromMyState, fromOpponentState)) return null;

  const pointsAwarded = definition.getPoints
    ? definition.getPoints(fromMyState, fromOpponentState)
    : definition.points;
  player.score += pointsAwarded;

  const result = definition.getResult(fromMyState, fromOpponentState);
  player.position = result.myState;
  opponent.position = result.opponentState;
  
  // כאן מועברים הניקוד הממתין והגדרת המאונט
  applyMountControlEntry(player, result.myState, fromMyState, definition.points);
  applyMountControlEntry(opponent, result.opponentState, fromOpponentState, definition.points);

  player.hand.splice(cardIndex, 1);
  drawCards(gameState, player, HAND_SIZE - player.hand.length);
  gameState.discardPile.push({ ...card, thrownAway: false });

  return pointsAwarded;
}

export function getLegalCards(player, opponent) {
  return player.hand.filter((card) =>
    CARD_DEFINITIONS[card.definitionId].canPlay(player.position, opponent.position)
  );
}

export function hasLegalCard(player, opponent) {
  return getLegalCards(player, opponent).length > 0;
}

export function discardCard(gameState, player, cardInstanceId) {
  const cardIndex = player.hand.findIndex((c) => c.instanceId === cardInstanceId);
  if (cardIndex === -1) return false;
  const [card] = player.hand.splice(cardIndex, 1);
  drawCards(gameState, player, 1);
  gameState.discardPile.push({ ...card, thrownAway: true });
  return true;
}

export function takeTurnAction(gameState, playerId, cardInstanceId) {
  if (gameState.winnerId || gameState.currentPlayerId !== playerId) return false;
  const player = gameState.players.find((p) => p.id === playerId);
  const opponent = gameState.players.find((p) => p.id !== playerId);
  const card = player.hand.find((c) => c.instanceId === cardInstanceId);
  if (!card) return false;

  const definition = CARD_DEFINITIONS[card.definitionId];
  const isHuman = playerId === HUMAN_ID;

  const pointsAwarded = playCard(gameState, playerId, cardInstanceId);
  if (pointsAwarded !== null) {
    const playedText = isHuman ? UI_TEXT.log.humanPlayed : UI_TEXT.log.computerPlayed;
    gameState.lastActionText = playedText(definition.displayName, pointsAwarded);
  } else if (!hasLegalCard(player, opponent) && discardCard(gameState, player, cardInstanceId)) {
    gameState.lastActionText = isHuman ? UI_TEXT.log.humanDiscarded : UI_TEXT.log.computerDiscarded;
  } else {
    return false;
  }

  // Win check אחרי הפעולה בתור
  const winner = gameState.players.find((p) => p.score >= WINNING_SCORE);
  if (winner) {
    gameState.winnerId = winner.id;
    return true;
  }

  // העברת התור ליריב
  gameState.currentPlayerId = opponent.id;

  // 🎯 בדיקה מיידית בתחילת התור הבא (כשהתור חוזר לשחקן המקורי או כשהיריב מתחיל את תורו):
  // אם השחקן הקודם מחזיק מאונט (שעכשיו הפך ליריב מבחינת התור) ויש לו נקודות ממתינות, 
  // סימן שהיריב סיים את התור שלו ולא ברח – ולכן נקודות המאונט משתחררות מיד!
  if (player.position === Position.MOUNT_CONTROL && player.pendingMountPoints > 0) {
    const mountPoints = player.pendingMountPoints;
    player.score += mountPoints;
    player.pendingMountPoints = 0;
    gameState.lastActionText += " | " + UI_TEXT.log.mountBonus(player.name, mountPoints);

    // בדיקת ניצחון נוספת אם הבונוס הביא אותך לניצחון
    const bonusWinner = gameState.players.find((p) => p.score >= WINNING_SCORE);
    if (bonusWinner) {
      gameState.winnerId = bonusWinner.id;
    }
  }

  return true;
}

function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function evaluateCardForComputer(card, myState, opponentState) {
  const definition = CARD_DEFINITIONS[card.definitionId];
  if (definition.id === "MOUNT" || definition.id === "SWEEP") return definition.points;
  return definition.getPoints ? definition.getPoints(myState, opponentState) : definition.points;
}

export function chooseComputerCard(gameState) {
  const player = gameState.players.find((p) => p.id === COMPUTER_ID);
  const opponent = gameState.players.find((p) => p.id === HUMAN_ID);
  const legalCards = getLegalCards(player, opponent);
  if (legalCards.length > 0) {
    const valueOf = (card) => evaluateCardForComputer(card, player.position, opponent.position);
    const bestValue = Math.max(...legalCards.map(valueOf));
    return pickRandom(legalCards.filter((card) => valueOf(card) === bestValue));
  }
  return pickRandom(player.hand) ?? null;
}
export function scrambleHand(gameState, playerId) {
  const player = gameState.players.find((p) => p.id === playerId);
  if (!player || player.scrambleCount >= 3) return false;

  gameState.discardPile.push(...player.hand);
  player.hand = [];

  drawCards(gameState, player, HAND_SIZE);
  
  player.scrambleCount += 1;
  gameState.lastActionText = `${player.name} ביצע סקראמבל והחליף את היד! (${player.scrambleCount}/3)`;
  
  return true;
}