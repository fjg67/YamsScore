import { AIPersonality, getAIPersonalityConfig } from '../types/aiPersonality';

export interface DiceRoll {
  dice: number[];
  rollNumber: 1 | 2 | 3;
}

export interface GameState {
  scores: Record<string, any>;
  availableCategories: string[];
}

export interface AIDecision {
  diceToKeep: number[];
  categoryToScore?: string;
  reasoning?: string;
}

/**
 * AI Strategy Service
 * Implements 4 distinct AI personalities with different playing styles
 */
export class AIStrategyService {
  private personality: AIPersonality;
  private config: ReturnType<typeof getAIPersonalityConfig>;

  constructor(personality: AIPersonality) {
    this.personality = personality;
    this.config = getAIPersonalityConfig(personality);
  }

  /**
   * Main decision function - decides which dice to keep
   */
  public async decideKeepDice(
    currentRoll: DiceRoll,
    gameState: GameState,
    playerId: string
  ): Promise<AIDecision> {
    // Simulate thinking time for realism
    await this.simulateThinking();

    // Choose strategy based on personality
    switch (this.personality) {
      case 'aggressive':
        return this.aggressiveStrategy(currentRoll, gameState, playerId);
      case 'prudent':
        return this.prudentStrategy(currentRoll, gameState, playerId);
      case 'unpredictable':
        return this.unpredictableStrategy(currentRoll, gameState, playerId);
      case 'perfect':
        return this.perfectStrategy(currentRoll, gameState, playerId);
      default:
        return this.prudentStrategy(currentRoll, gameState, playerId);
    }
  }

  /**
   * Decide which category to score in
   */
  public async decideCategory(
    finalRoll: number[],
    gameState: GameState,
    playerId: string
  ): Promise<string> {
    await this.simulateThinking();

    switch (this.personality) {
      case 'aggressive':
        return this.aggressiveCategoryChoice(finalRoll, gameState, playerId);
      case 'prudent':
        return this.prudentCategoryChoice(finalRoll, gameState, playerId);
      case 'unpredictable':
        return this.unpredictableCategoryChoice(finalRoll, gameState, playerId);
      case 'perfect':
        return this.perfectCategoryChoice(finalRoll, gameState, playerId);
      default:
        return this.prudentCategoryChoice(finalRoll, gameState, playerId);
    }
  }

  /**
   * AGGRESSIVE STRATEGY: Takes risks for high scores
   * - Always goes for Yams if possible
   * - Risks zeros for big combinations
   * - Ignores upper section bonus
   */
  private aggressiveStrategy(
    currentRoll: DiceRoll,
    gameState: GameState,
    playerId: string
  ): AIDecision {
    const { dice, rollNumber } = currentRoll;

    // Check for Yams (5 of a kind)
    const yamsCheck = this.checkForYams(dice);
    if (yamsCheck.count >= 3) {
      // Go for Yams aggressively
      return {
        diceToKeep: yamsCheck.dice,
        reasoning: '🔥 Going for YAMS!',
      };
    }

    // Check for 4 of a kind
    const fourKindCheck = this.checkForNOfAKind(dice, 4);
    if (fourKindCheck.count >= 3) {
      return {
        diceToKeep: fourKindCheck.dice,
        reasoning: '🔥 Going for 4 of a kind!',
      };
    }

    // Check for Full House
    const fullHouseCheck = this.checkForFullHouse(dice);
    if (fullHouseCheck.possible && rollNumber <= 2) {
      return {
        diceToKeep: fullHouseCheck.dice,
        reasoning: '🔥 Going for Full House!',
      };
    }

    // Check for Straight
    const straightCheck = this.checkForStraight(dice);
    if (straightCheck.count >= 4 && rollNumber <= 2) {
      return {
        diceToKeep: straightCheck.dice,
        reasoning: '🔥 Going for Straight!',
      };
    }

    // Otherwise, keep highest value dice
    const sorted = [...dice].sort((a, b) => b - a);
    return {
      diceToKeep: sorted.slice(0, 2),
      reasoning: '🔥 Keeping high values',
    };
  }

  /**
   * PRUDENT STRATEGY: Conservative, focuses on securing points
   * - Prioritizes upper section bonus
   * - Avoids zeros
   * - Takes safe combinations
   */
  private prudentStrategy(
    currentRoll: DiceRoll,
    gameState: GameState,
    playerId: string
  ): AIDecision {
    const { dice, rollNumber } = currentRoll;

    // Check upper section needs for bonus
    const upperNeed = this.calculateUpperSectionNeeds(gameState, playerId);
    if (upperNeed.length > 0) {
      // Focus on completing upper section
      const mostNeeded = upperNeed[0];
      const matchingDice = dice.filter(d => d === mostNeeded);
      if (matchingDice.length >= 2) {
        return {
          diceToKeep: matchingDice,
          reasoning: `🛡️ Building ${mostNeeded}s for bonus`,
        };
      }
    }

    // Look for safe combinations
    const threeKind = this.checkForNOfAKind(dice, 3);
    if (threeKind.count >= 3) {
      return {
        diceToKeep: threeKind.dice,
        reasoning: '🛡️ Securing 3 of a kind',
      };
    }

    // Keep pairs
    const pairs = this.findPairs(dice);
    if (pairs.length > 0) {
      return {
        diceToKeep: pairs,
        reasoning: '🛡️ Keeping pairs',
      };
    }

    // Keep highest values
    const sorted = [...dice].sort((a, b) => b - a);
    return {
      diceToKeep: sorted.slice(0, 3),
      reasoning: '🛡️ Playing safe',
    };
  }

  /**
   * UNPREDICTABLE STRATEGY: Erratic and surprising
   * - Random decision making with some logic
   * - Sometimes makes suboptimal moves
   * - High variance
   */
  private unpredictableStrategy(
    currentRoll: DiceRoll,
    gameState: GameState,
    playerId: string
  ): AIDecision {
    const { dice } = currentRoll;

    // 40% chance to make a "weird" decision
    if (Math.random() < 0.4) {
      // Keep random dice
      const numToKeep = Math.floor(Math.random() * 3) + 1;
      const shuffled = [...dice].sort(() => Math.random() - 0.5);
      return {
        diceToKeep: shuffled.slice(0, numToKeep),
        reasoning: '🎲 Feeling lucky!',
      };
    }

    // 30% aggressive
    if (Math.random() < 0.5) {
      return this.aggressiveStrategy(currentRoll, gameState, playerId);
    }

    // 30% prudent
    return this.prudentStrategy(currentRoll, gameState, playerId);
  }

  /**
   * PERFECT STRATEGY: Optimal mathematical play
   * - Calculates expected values
   * - Makes statistically best decisions
   * - Balanced approach
   */
  private perfectStrategy(
    currentRoll: DiceRoll,
    gameState: GameState,
    playerId: string
  ): AIDecision {
    const { dice, rollNumber } = currentRoll;

    // Calculate expected value for each possible keep combination
    const bestKeep = this.calculateOptimalKeep(dice, rollNumber, gameState, playerId);

    return {
      diceToKeep: bestKeep.dice,
      reasoning: `🤖 EV: ${bestKeep.expectedValue.toFixed(1)}`,
    };
  }

  /**
   * Category selection strategies
   */
  private aggressiveCategoryChoice(
    dice: number[],
    gameState: GameState,
    playerId: string
  ): string {
    const available = gameState.availableCategories;

    // Always score Yams if possible
    if (this.isYams(dice) && available.includes('yams')) {
      return 'yams';
    }

    // Prefer high-scoring categories
    const scores = this.calculateAllPossibleScores(dice);
    const highScoring = ['carre', 'full', 'grandeSuite', 'petiteSuite', 'yams'];

    for (const cat of highScoring) {
      if (available.includes(cat) && scores[cat] > 0) {
        return cat;
      }
    }

    // Otherwise take chance
    if (available.includes('chance')) {
      return 'chance';
    }

    // Dump in upper section
    return available[0];
  }

  private prudentCategoryChoice(
    dice: number[],
    gameState: GameState,
    playerId: string
  ): string {
    const available = gameState.availableCategories;
    const scores = this.calculateAllPossibleScores(dice);

    // Prioritize completing upper section
    const upperCats = ['un', 'deux', 'trois', 'quatre', 'cinq', 'six'];
    for (const cat of upperCats) {
      if (available.includes(cat) && scores[cat] >= 3) {
        return cat;
      }
    }

    // Then take any good combination
    const combos = ['yams', 'carre', 'full', 'grandeSuite', 'petiteSuite'];
    for (const cat of combos) {
      if (available.includes(cat) && scores[cat] > 0) {
        return cat;
      }
    }

    // Use chance if score is decent
    if (available.includes('chance') && this.sumDice(dice) >= 20) {
      return 'chance';
    }

    // Otherwise find lowest impact zero
    return available[0];
  }

  private unpredictableCategoryChoice(
    dice: number[],
    gameState: GameState,
    playerId: string
  ): string {
    const available = gameState.availableCategories;

    // 30% random choice
    if (Math.random() < 0.3) {
      return available[Math.floor(Math.random() * available.length)];
    }

    // Otherwise mix of strategies
    if (Math.random() < 0.5) {
      return this.aggressiveCategoryChoice(dice, gameState, playerId);
    }
    return this.prudentCategoryChoice(dice, gameState, playerId);
  }

  private perfectCategoryChoice(
    dice: number[],
    gameState: GameState,
    playerId: string
  ): string {
    const available = gameState.availableCategories;
    const scores = this.calculateAllPossibleScores(dice);

    // Calculate value of each category including future potential
    let bestCategory = available[0];
    let bestValue = -1;

    for (const cat of available) {
      const immediateValue = scores[cat] || 0;
      const futureValue = this.estimateFutureValue(cat, gameState, playerId);
      const totalValue = immediateValue + futureValue * 0.3;

      if (totalValue > bestValue) {
        bestValue = totalValue;
        bestCategory = cat;
      }
    }

    return bestCategory;
  }

  /**
   * Helper functions
   */
  private simulateThinking(): Promise<void> {
    const time = this.config.strategy.thinkingTime + (Math.random() * 500 - 250);
    return new Promise(resolve => setTimeout(resolve, time));
  }

  private checkForYams(dice: number[]): { count: number; dice: number[] } {
    const counts = this.countDice(dice);
    for (const [value, count] of Object.entries(counts)) {
      if (count >= 3) {
        return {
          count,
          dice: dice.filter(d => d === parseInt(value)),
        };
      }
    }
    return { count: 0, dice: [] };
  }

  private checkForNOfAKind(dice: number[], n: number): { count: number; dice: number[] } {
    const counts = this.countDice(dice);
    for (const [value, count] of Object.entries(counts)) {
      if (count >= n - 1) {
        return {
          count,
          dice: dice.filter(d => d === parseInt(value)),
        };
      }
    }
    return { count: 0, dice: [] };
  }

  private checkForFullHouse(dice: number[]): { possible: boolean; dice: number[] } {
    const counts = this.countDice(dice);
    const values = Object.values(counts).sort((a, b) => b - a);

    if (values[0] >= 3 && values[1] >= 2) {
      return { possible: true, dice };
    }
    if (values[0] >= 2 && values[1] >= 2) {
      return { possible: true, dice };
    }
    return { possible: false, dice: [] };
  }

  private checkForStraight(dice: number[]): { count: number; dice: number[] } {
    const unique = [...new Set(dice)].sort();
    let maxSequence = 1;
    let currentSequence = 1;

    for (let i = 1; i < unique.length; i++) {
      if (unique[i] === unique[i - 1] + 1) {
        currentSequence++;
        maxSequence = Math.max(maxSequence, currentSequence);
      } else {
        currentSequence = 1;
      }
    }

    return { count: maxSequence, dice: unique };
  }

  private findPairs(dice: number[]): number[] {
    const counts = this.countDice(dice);
    const pairs: number[] = [];

    for (const [value, count] of Object.entries(counts)) {
      if (count >= 2) {
        const val = parseInt(value);
        pairs.push(val, val);
      }
    }

    return pairs;
  }

  private countDice(dice: number[]): Record<number, number> {
    const counts: Record<number, number> = {};
    for (const die of dice) {
      counts[die] = (counts[die] || 0) + 1;
    }
    return counts;
  }

  private sumDice(dice: number[]): number {
    return dice.reduce((sum, die) => sum + die, 0);
  }

  private isYams(dice: number[]): boolean {
    return new Set(dice).size === 1;
  }

  private calculateUpperSectionNeeds(gameState: GameState, playerId: string): number[] {
    // Returns which upper section numbers are most needed for bonus
    const upperCats = [1, 2, 3, 4, 5, 6];
    const needs: Array<{ value: number; priority: number }> = [];

    for (const val of upperCats) {
      const catName = ['un', 'deux', 'trois', 'quatre', 'cinq', 'six'][val - 1];
      if (gameState.availableCategories.includes(catName)) {
        needs.push({
          value: val,
          priority: val * 3, // Higher numbers = higher priority
        });
      }
    }

    return needs.sort((a, b) => b.priority - a.priority).map(n => n.value);
  }

  private calculateOptimalKeep(
    dice: number[],
    rollNumber: number,
    gameState: GameState,
    playerId: string
  ): { dice: number[]; expectedValue: number } {
    // Simplified optimal calculation
    // In a real implementation, this would use dynamic programming

    // For now, use a heuristic
    const yams = this.checkForYams(dice);
    if (yams.count >= 4) {
      return { dice: yams.dice, expectedValue: 40 };
    }

    const fourKind = this.checkForNOfAKind(dice, 4);
    if (fourKind.count >= 3) {
      return { dice: fourKind.dice, expectedValue: 30 };
    }

    const threeKind = this.checkForNOfAKind(dice, 3);
    if (threeKind.count >= 3) {
      return { dice: threeKind.dice, expectedValue: 20 };
    }

    const pairs = this.findPairs(dice);
    if (pairs.length > 0) {
      return { dice: pairs, expectedValue: 15 };
    }

    const sorted = [...dice].sort((a, b) => b - a);
    return { dice: sorted.slice(0, 2), expectedValue: 10 };
  }

  private calculateAllPossibleScores(dice: number[]): Record<string, number> {
    const scores: Record<string, number> = {};
    const counts = this.countDice(dice);

    // Upper section
    for (let i = 1; i <= 6; i++) {
      const catName = ['un', 'deux', 'trois', 'quatre', 'cinq', 'six'][i - 1];
      scores[catName] = (counts[i] || 0) * i;
    }

    // Combinations
    scores.brelan = Object.values(counts).some(c => c >= 3) ? this.sumDice(dice) : 0;
    scores.carre = Object.values(counts).some(c => c >= 4) ? this.sumDice(dice) : 0;

    // Full house
    const sortedCounts = Object.values(counts).sort((a, b) => b - a);
    scores.full = (sortedCounts[0] >= 3 && sortedCounts[1] >= 2) ? 25 : 0;

    // Straights
    const unique = [...new Set(dice)].sort();
    const hasSmallStraight =
      unique.includes(1) && unique.includes(2) && unique.includes(3) && unique.includes(4) ||
      unique.includes(2) && unique.includes(3) && unique.includes(4) && unique.includes(5) ||
      unique.includes(3) && unique.includes(4) && unique.includes(5) && unique.includes(6);
    scores.petiteSuite = hasSmallStraight ? 30 : 0;

    const hasLargeStraight =
      unique.includes(1) && unique.includes(2) && unique.includes(3) && unique.includes(4) && unique.includes(5) ||
      unique.includes(2) && unique.includes(3) && unique.includes(4) && unique.includes(5) && unique.includes(6);
    scores.grandeSuite = hasLargeStraight ? 40 : 0;

    scores.yams = this.isYams(dice) ? 50 : 0;
    scores.chance = this.sumDice(dice);

    return scores;
  }

  private estimateFutureValue(category: string, gameState: GameState, playerId: string): number {
    // Estimate the future value/impact of using this category
    // Higher values = more important to save for later

    const importanceMap: Record<string, number> = {
      yams: 50,
      carre: 30,
      full: 25,
      grandeSuite: 40,
      petiteSuite: 30,
      brelan: 15,
      chance: 20,
      six: 18,
      cinq: 15,
      quatre: 12,
      trois: 9,
      deux: 6,
      un: 3,
    };

    return importanceMap[category] || 10;
  }
}

export default AIStrategyService;
