/**
 * Questions du Quiz Interactif sur les règles du Yams
 */

export type QuestionType = 'multiple-choice' | 'true-false' | 'interactive-dice';

export interface QuizQuestion {
  id: number;
  type: QuestionType;
  question: string;
  dice?: number[];
  options?: Array<{
    value: string | number;
    correct: boolean;
  }>;
  answer?: boolean; // Pour true-false
  correctAnswer?: number[]; // Pour interactive-dice
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'upper' | 'lower' | 'general';
}

export const quizQuestions: QuizQuestion[] = [
  // ============================================
  // QUESTIONS FACILES
  // ============================================
  {
    id: 1,
    type: 'multiple-choice',
    question: 'Combien de points vaut un Full ?',
    dice: [3, 3, 3, 5, 5],
    options: [
      { value: 20, correct: false },
      { value: 25, correct: true },
      { value: 30, correct: false },
      { value: 'Total des dés', correct: false },
    ],
    explanation: 'Le Full vaut toujours 25 points fixes, peu importe la valeur des dés !',
    difficulty: 'easy',
    category: 'lower',
  },
  {
    id: 2,
    type: 'true-false',
    question: 'Tu peux faire un Yams avec n\'importe quel chiffre',
    dice: [4, 4, 4, 4, 4],
    answer: true,
    explanation: 'Oui ! Un Yams c\'est 5 dés identiques, peu importe le chiffre (1 à 6).',
    difficulty: 'easy',
    category: 'lower',
  },
  {
    id: 3,
    type: 'multiple-choice',
    question: 'Combien de lancers maximum par tour ?',
    options: [
      { value: 2, correct: false },
      { value: 3, correct: true },
      { value: 4, correct: false },
      { value: 5, correct: false },
    ],
    explanation: 'Tu as droit à 3 lancers maximum par tour. Utilise-les intelligemment !',
    difficulty: 'easy',
    category: 'general',
  },
  {
    id: 4,
    type: 'multiple-choice',
    question: 'Combien de points pour le bonus de la section supérieure ?',
    options: [
      { value: 25, correct: false },
      { value: 30, correct: false },
      { value: 35, correct: true },
      { value: 50, correct: false },
    ],
    explanation: 'Le bonus est de +35 points si tu atteins au moins 63 points dans la section supérieure.',
    difficulty: 'easy',
    category: 'upper',
  },

  // ============================================
  // QUESTIONS MOYENNES
  // ============================================
  {
    id: 5,
    type: 'multiple-choice',
    question: 'Combien de points minimum pour obtenir le bonus ?',
    options: [
      { value: 60, correct: false },
      { value: 63, correct: true },
      { value: 65, correct: false },
      { value: 70, correct: false },
    ],
    explanation: '63 points minimum dans la section supérieure (moyenne de ~3 par catégorie).',
    difficulty: 'medium',
    category: 'upper',
  },
  {
    id: 6,
    type: 'multiple-choice',
    question: 'Quelle est la différence entre Brelan et Carré ?',
    options: [
      { value: 'Le nombre de dés identiques', correct: true },
      { value: 'Les points obtenus', correct: false },
      { value: 'La section où ils sont', correct: false },
      { value: 'Il n\'y a pas de différence', correct: false },
    ],
    explanation: 'Brelan = 3 dés identiques, Carré = 4 dés identiques. Les deux comptent le total des 5 dés.',
    difficulty: 'medium',
    category: 'lower',
  },
  {
    id: 7,
    type: 'multiple-choice',
    question: 'Quelle combinaison rapporte le plus de points ?',
    dice: [6, 6, 6, 6, 6],
    options: [
      { value: 'Full', correct: false },
      { value: 'Grande Suite', correct: false },
      { value: 'Yams', correct: true },
      { value: 'Carré de 6', correct: false },
    ],
    explanation: 'Le Yams rapporte 50 points, c\'est le score maximum pour une seule catégorie !',
    difficulty: 'medium',
    category: 'lower',
  },
  {
    id: 8,
    type: 'true-false',
    question: 'Une Petite Suite peut contenir 5 dés',
    dice: [1, 2, 3, 4, 6],
    answer: true,
    explanation: 'Oui ! La Petite Suite nécessite 4 dés consécutifs, le 5ème peut être n\'importe quoi.',
    difficulty: 'medium',
    category: 'lower',
  },

  // ============================================
  // QUESTIONS DIFFICILES
  // ============================================
  {
    id: 9,
    type: 'multiple-choice',
    question: 'Combien de combinaisons possibles pour une Grande Suite ?',
    options: [
      { value: 1, correct: false },
      { value: 2, correct: true },
      { value: 3, correct: false },
      { value: 4, correct: false },
    ],
    explanation: 'Seulement 2 combinaisons : 1-2-3-4-5 ou 2-3-4-5-6. C\'est très difficile !',
    difficulty: 'hard',
    category: 'lower',
  },
  {
    id: 10,
    type: 'interactive-dice',
    question: 'Sélectionne les dés qui forment une Petite Suite',
    dice: [1, 2, 3, 4, 6],
    correctAnswer: [1, 2, 3, 4],
    explanation: '1-2-3-4 forment une suite de 4 dés consécutifs. Le 6 ne compte pas.',
    difficulty: 'hard',
    category: 'lower',
  },
  {
    id: 11,
    type: 'multiple-choice',
    question: 'Avec [5,5,5,2,3], quelle catégorie rapporte le PLUS de points ?',
    dice: [5, 5, 5, 2, 3],
    options: [
      { value: 'Brelan (20 pts)', correct: true },
      { value: 'Cinq (15 pts)', correct: false },
      { value: 'Chance (20 pts)', correct: false },
      { value: 'Full (impossible)', correct: false },
    ],
    explanation: 'Le Brelan compte le total des 5 dés = 20 points. "Cinq" ne compte que les 5 = 15 points.',
    difficulty: 'hard',
    category: 'lower',
  },
  {
    id: 12,
    type: 'true-false',
    question: 'Si tu as déjà 70 points dans la section supérieure, tu as le bonus',
    answer: true,
    explanation: 'Oui ! Le bonus s\'obtient dès que tu atteins 63 points ou plus.',
    difficulty: 'hard',
    category: 'upper',
  },
];

// ============================================
// BADGES & RÉCOMPENSES
// ============================================

export interface Badge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  requirement: number; // Score minimum requis
  color: string;
}

export const quizBadges: Badge[] = [
  {
    id: 'beginner',
    name: 'Débutant',
    emoji: '🌱',
    description: 'Premières questions réussies',
    requirement: 3,
    color: '#50C878',
  },
  {
    id: 'learner',
    name: 'Apprenti',
    emoji: '📚',
    description: 'Tu progresses bien !',
    requirement: 6,
    color: '#4A90E2',
  },
  {
    id: 'expert',
    name: 'Expert',
    emoji: '⭐',
    description: 'Tu maîtrises les règles',
    requirement: 9,
    color: '#F39C12',
  },
  {
    id: 'master',
    name: 'Maître du Yams',
    emoji: '👑',
    description: 'Score parfait !',
    requirement: 12,
    color: '#9B59B6',
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export const getBadgeForScore = (score: number): Badge | null => {
  const earnedBadges = quizBadges.filter(badge => score >= badge.requirement);
  return earnedBadges.length > 0 ? earnedBadges[earnedBadges.length - 1] : null;
};

export const getScorePercentage = (score: number): number => {
  return Math.round((score / quizQuestions.length) * 100);
};

export const getScoreMessage = (percentage: number): string => {
  if (percentage === 100) return 'Parfait ! Tu es un vrai maître du Yams ! 👑';
  if (percentage >= 80) return 'Excellent ! Tu maîtrises les règles ! ⭐';
  if (percentage >= 60) return 'Bien joué ! Continue comme ça ! 📚';
  if (percentage >= 40) return 'Pas mal ! Encore un petit effort ! 🌱';
  return 'N\'hésite pas à relire les règles ! 💪';
};
