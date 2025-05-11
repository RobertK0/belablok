export interface Player {
  id: string;
  name: string;
  createdAt: string;
  gamesPlayed: number;
  gamesWon: number;
}

export function getStoredPlayers(): Player[] {
  try {
    const playersData = localStorage.getItem("players");
    if (playersData) {
      return JSON.parse(playersData);
    }
  } catch (e) {
    console.error("Error loading players from localStorage", e);
  }
  return [];
}

export function savePlayer(player: Player): void {
  try {
    const players = getStoredPlayers();
    const existingIndex = players.findIndex(
      (p) => p.id === player.id
    );

    if (existingIndex >= 0) {
      players[existingIndex] = player;
    } else {
      players.push(player);
    }

    localStorage.setItem("players", JSON.stringify(players));
  } catch (e) {
    console.error("Error saving player to localStorage", e);
  }
}

export function saveMultiplePlayers(newPlayers: Player[]): void {
  try {
    const existingPlayers = getStoredPlayers();

    // Add or update players
    const updatedPlayers = [...existingPlayers];

    for (const newPlayer of newPlayers) {
      const existingIndex = updatedPlayers.findIndex(
        (p) => p.id === newPlayer.id
      );
      if (existingIndex >= 0) {
        updatedPlayers[existingIndex] = newPlayer;
      } else {
        updatedPlayers.push(newPlayer);
      }
    }

    localStorage.setItem("players", JSON.stringify(updatedPlayers));
  } catch (e) {
    console.error(
      "Error saving multiple players to localStorage",
      e
    );
  }
}

export function saveGameSetup(
  players: (Player | null)[],
  dealerIndex: number | null
): void {
  try {
    localStorage.setItem(
      "lastGameSetup",
      JSON.stringify({
        players,
        dealer: dealerIndex,
      })
    );
  } catch (e) {
    console.error("Error saving game setup to localStorage", e);
  }
}

export function getLastGameSetup(): {
  players: (Player | null)[];
  dealer: number | null;
} | null {
  try {
    const setupData = localStorage.getItem("lastGameSetup");
    if (setupData) {
      return JSON.parse(setupData);
    }
  } catch (e) {
    console.error(
      "Error loading last game setup from localStorage",
      e
    );
  }
  return null;
}
