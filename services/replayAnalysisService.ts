/**
 * Replay Analysis Service - Analyse de parties avec commentaires IA
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GameReplay,
  TurnAnalysis,
  ReplayFilters,
} from '../src/types/learning';
import { GameState } from '../src/types/game';

const REPLAYS_KEY = '@yams_game_replays';

// ============================================================================
// REPLAY ANALYSIS SERVICE
// ============================================================================

export class ReplayAnalysisService {
  /**
   * Créer une analyse de partie
   */
  static async createReplay(gameState: GameState): Promise<GameReplay> {
    const replay: GameReplay = {
      gameId: gameState.gameId,
      gameName: gameState.gameName,
      playedAt: gameState.startedAt,
      duration: gameState.completedAt
        ? (gameState.completedAt - gameState.startedAt) / 1000
        : 0,
      players: gameState.players.map((player, index) => ({
        id: player.id,
        name: player.name,
        finalScore: gameState.scores[player.id].grandTotal,
        rank: index + 1, // TODO: calculer le vrai rang
      })),
      turnAnalyses: [],
      overallAnalysis: {
        strengths: [],
        weaknesses: [],
        keyMoments: [],
        improvementAreas: [],
      },
      averageOptimalityRate: 0,
      aiAnalysisGenerated: false,
      analysisVersion: '1.0',
    };

    // Sauvegarder
    await this.saveReplay(replay);
    return replay;
  }

  /**
   * Analyser un tour spécifique
   */
  static analyzeTurn(
    playerId: string,
    playerName: string,
    turnNumber: number,
    diceRolled: number[],
    categoryChosen: any,
    scoreObtained: number,
    gameContext: any
  ): TurnAnalysis {
    // Analyse de base (sans IA pour l'instant)
    const analysis: TurnAnalysis = {
      turnNumber,
      playerId,
      playerName,
      diceRolled,
      categoryChosen,
      scoreObtained,
      wasOptimal: this.isOptimalChoice(diceRolled, categoryChosen, scoreObtained),
      aiComment: this.generateBasicComment(diceRolled, categoryChosen, scoreObtained),
      aiRating: this.ratePlay(diceRolled, categoryChosen, scoreObtained),
    };

    // Ajouter des alternatives si non optimal
    if (!analysis.wasOptimal) {
      analysis.alternativeChoices = this.suggestAlternatives(
        diceRolled,
        categoryChosen,
        gameContext
      );
    }

    return analysis;
  }

  /**
   * Vérifier si un choix est optimal (simplifié)
   */
  private static isOptimalChoice(
    dice: number[],
    category: any,
    score: number
  ): boolean {
    // Logique simplifiée - à améliorer avec l'IA
    const pattern = this.detectPattern(dice);

    // Si on a un Yams et qu'on le joue en Yams = optimal
    if (pattern === 'yams' && category === 'yams') return true;

    // Si on a une grande suite et qu'on la joue en grande suite = optimal
    if (pattern === 'large_straight' && category === 'largeStraight') return true;

    // Full house joué correctement
    if (pattern === 'full_house' && category === 'fullHouse') return true;

    // Pour les autres cas, considérer comme "acceptable"
    return score >= 15; // Score minimum acceptable
  }

  /**
   * Détecter le pattern dans les dés
   */
  private static detectPattern(dice: number[]): string {
    const counts = new Map<number, number>();
    dice.forEach((d) => counts.set(d, (counts.get(d) || 0) + 1));

    const values = Array.from(counts.values()).sort((a, b) => b - a);
    const sortedDice = [...dice].sort((a, b) => a - b);

    if (values[0] === 5) return 'yams';
    if (values[0] === 4) return 'four_of_kind';
    if (values[0] === 3 && values[1] === 2) return 'full_house';

    const str = sortedDice.join('');
    if (str === '12345' || str === '23456') return 'large_straight';

    if (values[0] === 3) return 'three_of_kind';

    return 'other';
  }

  /**
   * Générer un commentaire basique
   */
  private static generateBasicComment(
    dice: number[],
    category: any,
    score: number
  ): string {
    if (score >= 40) {
      return 'Excellent coup ! Vous avez maximisé vos points ! 🌟';
    }
    if (score >= 25) {
      return 'Bon choix ! Un score solide. 👍';
    }
    if (score >= 15) {
      return 'Correct. Il y avait peut-être mieux, mais c\'est acceptable.';
    }
    return 'Ce coup aurait pu être optimisé. Voyez les alternatives ci-dessous.';
  }

  /**
   * Noter la qualité du coup
   */
  private static ratePlay(dice: number[], category: any, score: number): 1 | 2 | 3 | 4 | 5 {
    if (score >= 40) return 5;
    if (score >= 30) return 4;
    if (score >= 20) return 3;
    if (score >= 10) return 2;
    return 1;
  }

  /**
   * Suggérer des alternatives
   */
  private static suggestAlternatives(
    dice: number[],
    chosenCategory: any,
    gameContext: any
  ): any[] {
    // Simplification - à améliorer
    const alternatives = [];
    const pattern = this.detectPattern(dice);

    if (pattern === 'full_house' && chosenCategory !== 'fullHouse') {
      alternatives.push({
        category: 'fullHouse',
        expectedScore: 25,
        pros: ['25 points garantis', 'Combinaison rare'],
        cons: ['Aucun'],
      });
    }

    if (pattern === 'large_straight' && chosenCategory !== 'largeStraight') {
      alternatives.push({
        category: 'largeStraight',
        expectedScore: 40,
        pros: ['40 points garantis', 'Meilleur score possible pour cette combo'],
        cons: ['Aucun'],
      });
    }

    return alternatives;
  }

  /**
   * Générer l'analyse globale de la partie
   */
  static generateOverallAnalysis(replay: GameReplay): void {
    const optimalCount = replay.turnAnalyses.filter((t) => t.wasOptimal).length;
    const totalTurns = replay.turnAnalyses.length;

    replay.averageOptimalityRate =
      totalTurns > 0 ? Math.round((optimalCount / totalTurns) * 100) : 0;

    // Identifier les forces
    if (replay.averageOptimalityRate >= 80) {
      replay.overallAnalysis.strengths.push('Excellente prise de décision générale');
    }
    if (replay.averageOptimalityRate >= 60) {
      replay.overallAnalysis.strengths.push('Bonne compréhension des combinaisons');
    }

    // Identifier les faiblesses
    if (replay.averageOptimalityRate < 50) {
      replay.overallAnalysis.weaknesses.push(
        'Optimisation des choix de catégories à améliorer'
      );
      replay.overallAnalysis.improvementAreas.push(
        'Pratiquez le mode Tutoriel pour améliorer vos décisions'
      );
    }

    // Identifier les moments clés
    replay.turnAnalyses.forEach((turn) => {
      if (turn.scoreObtained >= 40) {
        replay.overallAnalysis.keyMoments.push({
          turn: turn.turnNumber,
          description: `Tour ${turn.turnNumber}: Excellent score de ${turn.scoreObtained} points`,
          impact: 'positive',
        });
      }
      if (turn.aiRating === 1) {
        replay.overallAnalysis.keyMoments.push({
          turn: turn.turnNumber,
          description: `Tour ${turn.turnNumber}: Coup sous-optimal`,
          impact: 'negative',
        });
      }
    });

    // Meilleur et pire tour
    if (replay.turnAnalyses.length > 0) {
      const best = replay.turnAnalyses.reduce((max, turn) =>
        turn.scoreObtained > max.scoreObtained ? turn : max
      );
      const worst = replay.turnAnalyses.reduce((min, turn) =>
        turn.scoreObtained < min.scoreObtained ? turn : min
      );

      replay.bestTurn = best.turnNumber;
      replay.worstTurn = worst.turnNumber;
    }

    replay.aiAnalysisGenerated = true;
  }

  /**
   * Sauvegarder un replay
   */
  static async saveReplay(replay: GameReplay): Promise<void> {
    try {
      const replays = await this.getAllReplays();
      const index = replays.findIndex((r) => r.gameId === replay.gameId);

      if (index >= 0) {
        replays[index] = replay;
      } else {
        replays.push(replay);
      }

      // Limiter à 100 replays max
      if (replays.length > 100) {
        replays.sort((a, b) => b.playedAt - a.playedAt);
        replays.splice(100);
      }

      await AsyncStorage.setItem(REPLAYS_KEY, JSON.stringify(replays));
    } catch (error) {
      console.error('Error saving replay:', error);
    }
  }

  /**
   * Obtenir tous les replays
   */
  static async getAllReplays(): Promise<GameReplay[]> {
    try {
      const data = await AsyncStorage.getItem(REPLAYS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading replays:', error);
      return [];
    }
  }

  /**
   * Obtenir un replay spécifique
   */
  static async getReplay(gameId: string): Promise<GameReplay | null> {
    const replays = await this.getAllReplays();
    return replays.find((r) => r.gameId === gameId) || null;
  }

  /**
   * Filtrer les replays
   */
  static async filterReplays(filters: ReplayFilters): Promise<GameReplay[]> {
    let replays = await this.getAllReplays();

    if (filters.dateRange) {
      replays = replays.filter(
        (r) =>
          r.playedAt >= filters.dateRange!.start && r.playedAt <= filters.dateRange!.end
      );
    }

    if (filters.players && filters.players.length > 0) {
      replays = replays.filter((r) =>
        r.players.some((p) => filters.players!.includes(p.id))
      );
    }

    if (filters.minScore !== undefined) {
      replays = replays.filter((r) =>
        r.players.some((p) => p.finalScore >= filters.minScore!)
      );
    }

    if (filters.maxScore !== undefined) {
      replays = replays.filter((r) =>
        r.players.every((p) => p.finalScore <= filters.maxScore!)
      );
    }

    if (filters.hasAIAnalysis !== undefined) {
      replays = replays.filter((r) => r.aiAnalysisGenerated === filters.hasAIAnalysis);
    }

    return replays;
  }

  /**
   * Supprimer un replay
   */
  static async deleteReplay(gameId: string): Promise<void> {
    const replays = await this.getAllReplays();
    const filtered = replays.filter((r) => r.gameId !== gameId);
    await AsyncStorage.setItem(REPLAYS_KEY, JSON.stringify(filtered));
  }

  /**
   * Supprimer tous les replays
   */
  static async deleteAllReplays(): Promise<void> {
    await AsyncStorage.removeItem(REPLAYS_KEY);
  }

  /**
   * Obtenir les statistiques globales
   */
  static async getGlobalStats(): Promise<{
    totalGames: number;
    averageScore: number;
    averageOptimality: number;
    bestGame: GameReplay | null;
  }> {
    const replays = await this.getAllReplays();

    if (replays.length === 0) {
      return {
        totalGames: 0,
        averageScore: 0,
        averageOptimality: 0,
        bestGame: null,
      };
    }

    const totalScore = replays.reduce((sum, r) => {
      const maxScore = Math.max(...r.players.map((p) => p.finalScore));
      return sum + maxScore;
    }, 0);

    const totalOptimality = replays.reduce(
      (sum, r) => sum + r.averageOptimalityRate,
      0
    );

    const bestGame = replays.reduce((best, r) => {
      const maxScore = Math.max(...r.players.map((p) => p.finalScore));
      const bestMaxScore = best ? Math.max(...best.players.map((p) => p.finalScore)) : 0;
      return maxScore > bestMaxScore ? r : best;
    }, replays[0]);

    return {
      totalGames: replays.length,
      averageScore: Math.round(totalScore / replays.length),
      averageOptimality: Math.round(totalOptimality / replays.length),
      bestGame,
    };
  }
}
