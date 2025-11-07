import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameState } from '../src/types/game';

const GAME_HISTORY_KEY = '@yams_game_history';
const MAX_HISTORY_ITEMS = 50; // Limite le nombre de parties sauvegardées

export interface SavedGame {
  id: string;
  gameName: string;
  players: {
    id: string;
    name: string;
    avatar: string;
    color: string;
    score: number;
    isAI?: boolean;
  }[];
  winner: {
    id: string;
    name: string;
    score: number;
  };
  startedAt: number;
  completedAt: number;
  duration: number; // en minutes
  totalTurns: number;
  gameState: GameState;
}

/**
 * Sauvegarde une partie terminée dans l'historique
 */
export const saveGameToHistory = async (gameState: GameState): Promise<void> => {
  try {
    // Calculer le gagnant
    const winner = gameState.players.reduce((prev, current) => {
      const prevScore = gameState.scores[prev.id]?.grandTotal || 0;
      const currentScore = gameState.scores[current.id]?.grandTotal || 0;
      return currentScore > prevScore ? current : prev;
    });

    // Calculer la durée en minutes
    const duration = Math.round((gameState.completedAt! - gameState.startedAt) / 60000);

    // Créer l'objet de partie sauvegardée
    const savedGame: SavedGame = {
      id: gameState.gameId,
      gameName: gameState.gameName,
      players: gameState.players.map((player) => ({
        id: player.id,
        name: player.name,
        avatar: player.avatar,
        color: player.color,
        score: gameState.scores[player.id]?.grandTotal || 0,
        isAI: player.isAI,
      })),
      winner: {
        id: winner.id,
        name: winner.name,
        score: gameState.scores[winner.id]?.grandTotal || 0,
      },
      startedAt: gameState.startedAt,
      completedAt: gameState.completedAt!,
      duration,
      totalTurns: gameState.totalTurns,
      gameState,
    };

    // Récupérer l'historique existant
    const existingHistory = await getGameHistory();

    // Ajouter la nouvelle partie au début
    const updatedHistory = [savedGame, ...existingHistory];

    // Limiter le nombre de parties sauvegardées
    const trimmedHistory = updatedHistory.slice(0, MAX_HISTORY_ITEMS);

    // Sauvegarder dans AsyncStorage
    await AsyncStorage.setItem(GAME_HISTORY_KEY, JSON.stringify(trimmedHistory));

    console.log('✅ Partie sauvegardée dans l\'historique:', savedGame.id);
  } catch (error) {
    console.error('❌ Erreur lors de la sauvegarde de la partie:', error);
    throw error;
  }
};

/**
 * Récupère tout l'historique des parties
 */
export const getGameHistory = async (): Promise<SavedGame[]> => {
  try {
    const historyJson = await AsyncStorage.getItem(GAME_HISTORY_KEY);
    if (!historyJson) {
      return [];
    }
    return JSON.parse(historyJson);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération de l\'historique:', error);
    return [];
  }
};

/**
 * Récupère une partie spécifique par son ID
 */
export const getGameById = async (gameId: string): Promise<SavedGame | null> => {
  try {
    const history = await getGameHistory();
    return history.find((game) => game.id === gameId) || null;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération de la partie:', error);
    return null;
  }
};

/**
 * Supprime une partie de l'historique
 */
export const deleteGameFromHistory = async (gameId: string): Promise<void> => {
  try {
    const history = await getGameHistory();
    const updatedHistory = history.filter((game) => game.id !== gameId);
    await AsyncStorage.setItem(GAME_HISTORY_KEY, JSON.stringify(updatedHistory));
    console.log('✅ Partie supprimée de l\'historique:', gameId);
  } catch (error) {
    console.error('❌ Erreur lors de la suppression de la partie:', error);
    throw error;
  }
};

/**
 * Efface tout l'historique
 */
export const clearGameHistory = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(GAME_HISTORY_KEY);
    console.log('✅ Historique effacé');
  } catch (error) {
    console.error('❌ Erreur lors de l\'effacement de l\'historique:', error);
    throw error;
  }
};

/**
 * Récupère les statistiques globales
 */
export const getGameStats = async () => {
  try {
    const history = await getGameHistory();

    if (history.length === 0) {
      return {
        totalGames: 0,
        totalDuration: 0,
        averageDuration: 0,
        playerStats: {},
      };
    }

    const totalGames = history.length;
    const totalDuration = history.reduce((sum, game) => sum + game.duration, 0);
    const averageDuration = Math.round(totalDuration / totalGames);

    // Statistiques par joueur
    const playerStats: Record<string, {
      gamesPlayed: number;
      wins: number;
      totalScore: number;
      averageScore: number;
      bestScore: number;
    }> = {};

    history.forEach((game) => {
      game.players.forEach((player) => {
        if (!playerStats[player.id]) {
          playerStats[player.id] = {
            gamesPlayed: 0,
            wins: 0,
            totalScore: 0,
            averageScore: 0,
            bestScore: 0,
          };
        }

        playerStats[player.id].gamesPlayed++;
        playerStats[player.id].totalScore += player.score;

        if (player.score > playerStats[player.id].bestScore) {
          playerStats[player.id].bestScore = player.score;
        }

        if (player.id === game.winner.id) {
          playerStats[player.id].wins++;
        }
      });
    });

    // Calculer les moyennes
    Object.keys(playerStats).forEach((playerId) => {
      const stats = playerStats[playerId];
      stats.averageScore = Math.round(stats.totalScore / stats.gamesPlayed);
    });

    return {
      totalGames,
      totalDuration,
      averageDuration,
      playerStats,
    };
  } catch (error) {
    console.error('❌ Erreur lors du calcul des statistiques:', error);
    return {
      totalGames: 0,
      totalDuration: 0,
      averageDuration: 0,
      playerStats: {},
    };
  }
};
