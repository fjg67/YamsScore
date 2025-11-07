import { useEffect, useCallback, useState, useRef } from 'react';
import { Animated } from 'react-native';
import type { Player, CategoryType, GameState } from '../../../types/game';

/**
 * Hook pour gérer les tours automatiques de l'IA
 */
export const useAIPlayer = (
  currentPlayer: Player,
  gameState: GameState,
  onAIMove: (category: CategoryType, score: number, isCrossed: boolean) => void
) => {
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const thinkingOpacity = useRef(new Animated.Value(0)).current;
  const messageScale = useRef(new Animated.Value(0)).current;
  const isExecutingRef = useRef(false); // ✨ Protection contre double exécution
  const lastPlayerIdRef = useRef<string | null>(null); // ✨ Suivi du dernier joueur

  const isAITurn = currentPlayer?.isAI === true;

  /**
   * Simule la réflexion de l'IA et choisit une catégorie
   */
  const executeAITurn = useCallback(async () => {
    if (!isAITurn || !currentPlayer.aiDifficulty) return;
    
    // Protection: Si déjà en cours d'exécution, ne pas relancer
    if (isExecutingRef.current) {
      return;
    }

    isExecutingRef.current = true;
    setIsAIThinking(true);

    const difficulty: 'easy' | 'normal' | 'hard' = currentPlayer.aiDifficulty || 'normal';

    // Animation: Montrer l'indicateur de réflexion
    Animated.timing(thinkingOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Temps de réflexion selon la difficulté
    const thinkingTimes: Record<'easy' | 'normal' | 'hard', number> = {
      easy: 800,
      normal: 1200,
      hard: 1800,
    };
    const thinkingTime = thinkingTimes[difficulty];

    await new Promise<void>((resolve) => setTimeout(resolve, thinkingTime));

    // Obtenir les catégories disponibles
    const playerScores = gameState.scores[currentPlayer.id];
    const allCategories: CategoryType[] = [
      'ones',
      'twos',
      'threes',
      'fours',
      'fives',
      'sixes',
      'threeOfKind',
      'fourOfKind',
      'fullHouse',
      'smallStraight',
      'largeStraight',
      'yams',
      'chance',
    ];
    const availableCategories = allCategories.filter(
      (cat) => playerScores[cat]?.value === null
    );

    if (availableCategories.length === 0) {
      setIsAIThinking(false);
      return;
    }

    // Choisir une catégorie selon la difficulté
    let selectedCategory: CategoryType;
    let score: number;
    let isCrossed = false;

    if (currentPlayer.aiDifficulty === 'easy') {
      // Facile: Choix aléatoire
      selectedCategory =
        availableCategories[Math.floor(Math.random() * availableCategories.length)];
      score = getRandomScore(selectedCategory);
    } else if (currentPlayer.aiDifficulty === 'normal') {
      // Normal: Choix stratégique basique
      const choice = chooseNormalStrategy(availableCategories, playerScores);
      selectedCategory = choice.category;
      score = choice.score;
      isCrossed = choice.isCrossed;
    } else {
      // Difficile: Choix optimal
      const choice = chooseHardStrategy(availableCategories, playerScores, gameState);
      selectedCategory = choice.category;
      score = choice.score;
      isCrossed = choice.isCrossed;
    }

    // Message de l'IA
    const aiDifficulty: 'easy' | 'normal' | 'hard' = difficulty;
    const messages: Record<'easy' | 'normal' | 'hard', string[]> = {
      easy: [
        "Hmm, je choisis au hasard ! 🌱",
        "Voyons voir... celui-ci ! 🤔",
        "Je tente ma chance ! 🎲",
      ],
      normal: [
        "Pas mal, je prends ça ! ⚡",
        "Une bonne stratégie s'impose ! 🎯",
        "Calculons un peu... ⚡",
      ],
      hard: [
        "Coup optimal identifié ! 🔥",
        "Ma stratégie est parfaite ! 🧠",
        "Analyse complète terminée ! 🔥",
      ],
    };

    const messageList = messages[aiDifficulty];
    setAiMessage(messageList[Math.floor(Math.random() * messageList.length)]);

    // Animation: Montrer le message
    Animated.spring(messageScale, {
      toValue: 1,
      tension: 100,
      friction: 7,
      useNativeDriver: true,
    }).start();

    // Attendre avant de jouer
    await new Promise<void>((resolve) => setTimeout(resolve, 1500));

    // Masquer animations
    Animated.parallel([
      Animated.timing(thinkingOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(messageScale, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    setIsAIThinking(false);
    setAiMessage('');

    // Jouer le coup
    onAIMove(selectedCategory, score, isCrossed);
    
    // Réinitialiser le flag après un délai pour permettre le prochain tour IA
    setTimeout(() => {
      isExecutingRef.current = false;
    }, 100);
  }, [isAITurn, currentPlayer, gameState, onAIMove, thinkingOpacity, messageScale]);

  // Déclencher automatiquement le tour IA
  useEffect(() => {
    // Réinitialiser le flag si le joueur a changé
    if (lastPlayerIdRef.current !== currentPlayer?.id) {
      lastPlayerIdRef.current = currentPlayer?.id || null;
      isExecutingRef.current = false;
    }

    if (isAITurn && !isExecutingRef.current && !isAIThinking) {
      const timer = setTimeout(() => {
        executeAITurn();
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [isAITurn, executeAITurn, isAIThinking, currentPlayer?.id]);

  return {
    isAIThinking,
    aiMessage,
    thinkingOpacity,
    messageScale,
    isAITurn,
  };
};

/**
 * Génère un score aléatoire pour une catégorie (mode Facile)
 */
function getRandomScore(category: CategoryType): number {
  const upperCategories = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'];
  
  if (upperCategories.includes(category)) {
    // Score de 0 à 30 (5 dés max)
    return Math.floor(Math.random() * 6) * getCategoryValue(category);
  }

  // Combinaisons
  const scores = {
    threeOfKind: [0, 15, 20, 25],
    fourOfKind: [0, 20, 25, 30],
    fullHouse: [0, 25],
    smallStraight: [0, 30],
    largeStraight: [0, 40],
    yams: [0, 50],
    chance: [5, 10, 15, 20, 25, 30],
  };

  const possibleScores = scores[category as keyof typeof scores] || [10];
  return possibleScores[Math.floor(Math.random() * possibleScores.length)];
}

/**
 * Stratégie normale: Privilégier sections hautes pour bonus
 */
function chooseNormalStrategy(
  availableCategories: CategoryType[],
  playerScores: any
): { category: CategoryType; score: number; isCrossed: boolean } {
  const upperCategories: CategoryType[] = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'];
  const upperTotal = playerScores.upperTotal || 0;

  // Si on peut encore avoir le bonus (63 points), privilégier les hautes
  if (upperTotal < 63) {
    const availableUpper = availableCategories.filter((c) => upperCategories.includes(c));
    if (availableUpper.length > 0) {
      // Choisir les plus hautes valeurs (6, 5, 4)
      const priority = availableUpper.sort((a, b) => {
        return getCategoryValue(b) - getCategoryValue(a);
      });
      const category = priority[0];
      const score = Math.floor(Math.random() * 4 + 2) * getCategoryValue(category);
      return { category, score, isCrossed: false };
    }
  }

  // Sinon, choisir une combinaison au hasard
  const category = availableCategories[Math.floor(Math.random() * availableCategories.length)];
  const score = getRandomScore(category);
  return { category, score, isCrossed: score === 0 };
}

/**
 * Stratégie difficile: Maximiser les points
 */
function chooseHardStrategy(
  availableCategories: CategoryType[],
  playerScores: any,
  _gameState: GameState
): { category: CategoryType; score: number; isCrossed: boolean } {
  const upperCategories: CategoryType[] = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'];
  const upperTotal = playerScores.upperTotal || 0;

  // Prioriser le bonus si atteignable
  if (upperTotal < 63 && upperTotal >= 40) {
    const availableUpper = availableCategories.filter((c) => upperCategories.includes(c));
    if (availableUpper.length > 0) {
      const best = availableUpper.sort((a, b) => getCategoryValue(b) - getCategoryValue(a))[0];
      const score = 5 * getCategoryValue(best); // Score max
      return { category: best, score, isCrossed: false };
    }
  }

  // Sinon, choisir la meilleure combinaison
  const priorities: Record<CategoryType, number> = {
    yams: 50,
    largeStraight: 40,
    fullHouse: 25,
    smallStraight: 30,
    fourOfKind: 28,
    threeOfKind: 25,
    sixes: 30,
    fives: 25,
    fours: 20,
    threes: 15,
    twos: 10,
    ones: 5,
    chance: 20,
  };

  const sorted = availableCategories.sort((a, b) => {
    return (priorities[b as CategoryType] || 0) - (priorities[a as CategoryType] || 0);
  });

  const category = sorted[0];
  const score = getOptimalScore(category);
  return { category, score, isCrossed: score === 0 };
}

/**
 * Obtenir la valeur numérique d'une catégorie haute (1-6)
 */
function getCategoryValue(category: string): number {
  const values: Record<string, number> = {
    ones: 1,
    twos: 2,
    threes: 3,
    fours: 4,
    fives: 5,
    sixes: 6,
  };
  return values[category] || 1;
}

/**
 * Obtenir le score optimal pour une catégorie (mode Difficile)
 */
function getOptimalScore(category: CategoryType): number {
  const upperCategories = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'];
  
  if (upperCategories.includes(category)) {
    // Score maximum (4 ou 5 dés)
    const numDice = Math.random() > 0.3 ? 5 : 4;
    return numDice * getCategoryValue(category);
  }

  // Scores optimaux pour combinaisons
  const optimalScores: Record<string, number> = {
    threeOfKind: 25,
    fourOfKind: 28,
    fullHouse: 25,
    smallStraight: 30,
    largeStraight: 40,
    yams: 50,
    chance: 25,
  };

  return optimalScores[category] || 20;
}
