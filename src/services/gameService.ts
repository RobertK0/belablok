import { type Player } from "./playerService";

export interface Round {
  id: string;
  team1Score: number;
  team2Score: number;
  timestamp: string;
}

export interface Game {
  id: string;
  team1Players: [Player | null, Player | null];
  team2Players: [Player | null, Player | null];
  dealerIndex: number;
  rounds: Round[];
  currentDealerIndex: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

// Create a new game
export function createGame(
  players: (Player | null)[],
  dealerIndex: number
): Game {
  const game: Game = {
    id: `game-${Date.now()}`,
    team1Players: [players[0], players[2]] as [
      Player | null,
      Player | null
    ],
    team2Players: [players[1], players[3]] as [
      Player | null,
      Player | null
    ],
    dealerIndex,
    currentDealerIndex: dealerIndex,
    rounds: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
  };

  // Save the game
  saveGame(game);

  return game;
}

// Get the active game
export function getActiveGame(): Game | null {
  try {
    const gamesData = localStorage.getItem("games");
    if (!gamesData) return null;

    const games: Game[] = JSON.parse(gamesData);
    return games.find((game) => game.isActive) || null;
  } catch (e) {
    console.error("Error loading active game from localStorage", e);
    return null;
  }
}

// Save a game
export function saveGame(game: Game): void {
  try {
    let games: Game[] = [];
    const gamesData = localStorage.getItem("games");

    if (gamesData) {
      games = JSON.parse(gamesData);
    }

    // Update or add the game
    const existingIndex = games.findIndex((g) => g.id === game.id);

    if (existingIndex >= 0) {
      games[existingIndex] = {
        ...game,
        updatedAt: new Date().toISOString(),
      };
    } else {
      games.push(game);
    }

    localStorage.setItem("games", JSON.stringify(games));
  } catch (e) {
    console.error("Error saving game to localStorage", e);
  }
}

// Add a round to the active game
export function addRound(
  team1Score: number,
  team2Score: number
): Round | null {
  try {
    const game = getActiveGame();
    if (!game) return null;

    // Create a new round
    const round: Round = {
      id: `round-${Date.now()}`,
      team1Score,
      team2Score,
      timestamp: new Date().toISOString(),
    };

    // Add to the rounds array
    game.rounds.push(round);

    // Move dealer to the next player (clockwise)
    game.currentDealerIndex = (game.currentDealerIndex + 1) % 4;

    // Update the game
    game.updatedAt = new Date().toISOString();
    saveGame(game);

    return round;
  } catch (e) {
    console.error("Error adding round to localStorage", e);
    return null;
  }
}

// Get the total score for the game
export function getTotalScore(): { team1: number; team2: number } {
  const game = getActiveGame();
  if (!game) return { team1: 0, team2: 0 };

  return game.rounds.reduce(
    (total, round) => {
      return {
        team1: total.team1 + round.team1Score,
        team2: total.team2 + round.team2Score,
      };
    },
    { team1: 0, team2: 0 }
  );
}

// End the active game
export function endGame(): void {
  const game = getActiveGame();
  if (!game) return;

  game.isActive = false;
  game.updatedAt = new Date().toISOString();
  saveGame(game);

  // Update player stats
  updatePlayerStats(game);
}

// Update player stats based on game results
function updatePlayerStats(game: Game): void {
  try {
    const totalScore = game.rounds.reduce(
      (total, round) => {
        return {
          team1: total.team1 + round.team1Score,
          team2: total.team2 + round.team2Score,
        };
      },
      { team1: 0, team2: 0 }
    );

    // Determine winning team
    const team1Won = totalScore.team1 > totalScore.team2;

    // Get players from localStorage
    const playersData = localStorage.getItem("players");
    if (!playersData) return;

    const players: Player[] = JSON.parse(playersData);

    // Update stats for each player
    const allGamePlayers = [
      ...game.team1Players,
      ...game.team2Players,
    ].filter((p): p is Player => p !== null);

    for (const player of allGamePlayers) {
      const existingPlayer = players.find(
        (p) => p.id === player.id
      );
      if (existingPlayer) {
        existingPlayer.gamesPlayed += 1;

        // Check if player was on winning team
        const isTeam1Player = game.team1Players.some(
          (p) => p && p.id === player.id
        );

        if (
          (isTeam1Player && team1Won) ||
          (!isTeam1Player && !team1Won)
        ) {
          existingPlayer.gamesWon += 1;
        }
      }
    }

    // Save updated players
    localStorage.setItem("players", JSON.stringify(players));
  } catch (e) {
    console.error("Error updating player stats", e);
  }
}
