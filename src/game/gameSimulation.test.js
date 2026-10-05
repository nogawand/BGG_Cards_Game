import { createGameState } from "./gameState.js";
import { takeTurnAction, getLegalCards, scrambleHand } from "./gameActions.js";
import { WINNING_SCORE, HUMAN_ID } from "./config.js";

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
      // Selecting a random legal card
      const chosenCard = legalCards[Math.floor(Math.random() * legalCards.length)];
      
      cardPlayCounts[chosenCard.definitionId] = (cardPlayCounts[chosenCard.definitionId] || 0) + 1;

      takeTurnAction(gameState, currentPlayerId, chosenCard.instanceId);
    } else {
      // There are no legal card, check option to scrumble 
      if (player.scrambleCount < 3) {
        scrambleHand(gameState, player.id);
      } else {
        // If no scrumbles remain, discard a card
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
      
      // Pass the turn to the opponent
      gameState.currentPlayerId = opponent.id;
    }

    // Win check
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