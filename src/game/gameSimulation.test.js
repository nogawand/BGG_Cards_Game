import { createGameState } from "./gameState.js";
import { takeTurnAction, getLegalCards, scrambleHand } from "./gameActions.js";
import { CARD_DEFINITIONS } from "./cardDefinitions.js";
import { WINNING_SCORE, COMPUTER_ID, HUMAN_ID } from "./config.js";

function simulateSingleGame() {
  const gameState = createGameState();
  let turns = 0;
  let totalDiscards = 0;
  let humanDiscards = 0;
  let computerDiscards = 0;
  
  const cardPlayCounts = {};

  while (!gameState.winnerId && turns < 200) {
    turns++;
    const currentPlayerId = gameState.currentPlayerId;
    const player = gameState.players.find((p) => p.id === currentPlayerId);
    const opponent = gameState.players.find((p) => p.id !== currentPlayerId);

    const legalCards = getLegalCards(player, opponent);

    if (legalCards.length > 0) {
      // בוחרים קלף חוקי רנדומלי (או לפי לוגיקה)
      const chosenCard = legalCards[Math.floor(Math.random() * legalCards.length)];
      
      // ספירת שימוש בקלף
      cardPlayCounts[chosenCard.definitionId] = (cardPlayCounts[chosenCard.definitionId] || 0) + 1;

      takeTurnAction(gameState, currentPlayerId, chosenCard.instanceId);
    } else {
      // אין קלפים חוקיים! בודקים אם אפשר לבצע סקראמבל (עד 3 פעמים)
      if (player.scrambleCount < 3) {
        scrambleHand(gameState, player.id);
      } else {
        // אם נגמרו הסקראמבלים, זורקים את הקלף הראשון ביד כמו קודם
        const cardToDiscard = player.hand[0];
        if (cardToDiscard) {
          const cardIndex = player.hand.findIndex((c) => c.instanceId === cardToDiscard.instanceId);
          player.hand.splice(cardIndex, 1);
          gameState.discardPile.push({ ...cardToDiscard, thrownAway: true });
          totalDiscards++;
          if (player.id === HUMAN_ID) humanDiscards++;
          else computerDiscards++;
        }
      }
      
      // מעבר תור ליריב אם נתקענו
      gameState.currentPlayerId = opponent.id;
    }

    // בדיקת ניצחון
    const winner = gameState.players.find((p) => p.score >= WINNING_SCORE);
    if (winner) {
      gameState.winnerId = winner.id;
    }
  }

  return { turns, totalDiscards, humanDiscards, computerDiscards, cardPlayCounts };
}

export function runGameSimulations(numGames = 50) {
  let totalTurns = 0;
  let totalDiscards = 0;
  let totalHumanDiscards = 0;
  let totalComputerDiscards = 0;
  const aggregateCardCounts = {};

  for (let i = 0; i < numGames; i++) {
    const result = simulateSingleGame();
    totalTurns += result.turns;
    totalDiscards += result.totalDiscards;
    totalHumanDiscards += result.humanDiscards;
    totalComputerDiscards += result.computerDiscards;

    for (const [cardId, count] of Object.entries(result.cardPlayCounts)) {
      aggregateCardCounts[cardId] = (aggregateCardCounts[cardId] || 0) + count;
    }
  }

  const results = {
    gamesPlayed: numGames,
    averageTurnsPerGame: (totalTurns / numGames).toFixed(2),
    averageDiscardsPerGame: (totalDiscards / numGames).toFixed(2),
    averageHumanDiscards: (totalHumanDiscards / numGames).toFixed(2),
    averageComputerDiscards: (totalComputerDiscards / numGames).toFixed(2),
    aggregateCardCounts,
  };

  console.log("=== BJJ SIMULATION RESULTS (WITH SCRAMBLE) ===", results);
  return results;
}