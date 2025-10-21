/**
 * Contenu détaillé des règles du Yams
 * Architecture de données pour l'écran Rules Premium
 */

export interface CategoryRule {
  id: string;
  name: string;
  emoji: string;
  difficulty: 'Facile' | 'Moyen' | 'Difficile' | 'Très Difficile' | 'Légendaire';
  section: 'upper' | 'lower';
  rule: string;
  scoring: {
    method: 'sum' | 'fixed';
    value?: number;
    formula?: string;
  };
  example: {
    dice: number[];
    highlight?: number[];
    calculation: string;
    result: number;
  };
  tips?: string[];
}

export interface TipItem {
  icon: string;
  category: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

export interface GamePhase {
  phase: number;
  title: string;
  icon: string;
  recommendations: string[];
  color: string;
}

// ============================================
// CATÉGORIES - SECTION SUPÉRIEURE
// ============================================

export const upperSectionCategories: CategoryRule[] = [
  {
    id: 'ones',
    name: '1 (As)',
    emoji: '🎲',
    difficulty: 'Facile',
    section: 'upper',
    rule: 'Additionne tous les dés montrant un 1',
    scoring: {
      method: 'sum',
      formula: 'Somme des 1',
    },
    example: {
      dice: [1, 1, 3, 1, 5],
      highlight: [1, 1, 1],
      calculation: '1 + 1 + 1',
      result: 3,
    },
    tips: ['Vise au moins 3 points pour le bonus'],
  },
  {
    id: 'twos',
    name: '2 (Deux)',
    emoji: '🎲',
    difficulty: 'Facile',
    section: 'upper',
    rule: 'Additionne tous les dés montrant un 2',
    scoring: {
      method: 'sum',
      formula: 'Somme des 2',
    },
    example: {
      dice: [2, 2, 4, 2, 6],
      highlight: [2, 2, 2],
      calculation: '2 + 2 + 2',
      result: 6,
    },
    tips: ['Vise au moins 6 points pour le bonus'],
  },
  {
    id: 'threes',
    name: '3 (Trois)',
    emoji: '🎲',
    difficulty: 'Facile',
    section: 'upper',
    rule: 'Additionne tous les dés montrant un 3',
    scoring: {
      method: 'sum',
      formula: 'Somme des 3',
    },
    example: {
      dice: [3, 3, 3, 5, 6],
      highlight: [3, 3, 3],
      calculation: '3 + 3 + 3',
      result: 9,
    },
    tips: ['Vise au moins 9 points pour le bonus'],
  },
  {
    id: 'fours',
    name: '4 (Quatre)',
    emoji: '🎲',
    difficulty: 'Facile',
    section: 'upper',
    rule: 'Additionne tous les dés montrant un 4',
    scoring: {
      method: 'sum',
      formula: 'Somme des 4',
    },
    example: {
      dice: [4, 4, 4, 4, 2],
      highlight: [4, 4, 4, 4],
      calculation: '4 + 4 + 4 + 4',
      result: 16,
    },
    tips: ['Vise au moins 12 points pour le bonus'],
  },
  {
    id: 'fives',
    name: '5 (Cinq)',
    emoji: '🎲',
    difficulty: 'Facile',
    section: 'upper',
    rule: 'Additionne tous les dés montrant un 5',
    scoring: {
      method: 'sum',
      formula: 'Somme des 5',
    },
    example: {
      dice: [5, 5, 5, 1, 2],
      highlight: [5, 5, 5],
      calculation: '5 + 5 + 5',
      result: 15,
    },
    tips: ['Vise au moins 15 points pour le bonus'],
  },
  {
    id: 'sixes',
    name: '6 (Six)',
    emoji: '🎲',
    difficulty: 'Facile',
    section: 'upper',
    rule: 'Additionne tous les dés montrant un 6',
    scoring: {
      method: 'sum',
      formula: 'Somme des 6',
    },
    example: {
      dice: [6, 6, 6, 3, 4],
      highlight: [6, 6, 6],
      calculation: '6 + 6 + 6',
      result: 18,
    },
    tips: ['Vise au moins 18 points pour le bonus'],
  },
];

// ============================================
// CATÉGORIES - SECTION INFÉRIEURE
// ============================================

export const lowerSectionCategories: CategoryRule[] = [
  {
    id: 'threeOfKind',
    name: 'Brelan',
    emoji: '🎯',
    difficulty: 'Moyen',
    section: 'lower',
    rule: '3 dés identiques',
    scoring: {
      method: 'sum',
      formula: 'Total des 5 dés',
    },
    example: {
      dice: [5, 5, 5, 2, 3],
      highlight: [5, 5, 5],
      calculation: '5 + 5 + 5 + 2 + 3',
      result: 20,
    },
    tips: [
      'Vise les brelans de 5 ou 6 pour maximiser les points',
      'Utilise-le en fin de partie si nécessaire',
    ],
  },
  {
    id: 'fourOfKind',
    name: 'Carré',
    emoji: '💎',
    difficulty: 'Difficile',
    section: 'lower',
    rule: '4 dés identiques',
    scoring: {
      method: 'sum',
      formula: 'Total des 5 dés',
    },
    example: {
      dice: [4, 4, 4, 4, 2],
      highlight: [4, 4, 4, 4],
      calculation: '4 + 4 + 4 + 4 + 2',
      result: 18,
    },
    tips: [
      'Plus rare que le brelan',
      'Garde cette catégorie pour un vrai carré de 5 ou 6',
    ],
  },
  {
    id: 'fullHouse',
    name: 'Full',
    emoji: '🏠',
    difficulty: 'Moyen',
    section: 'lower',
    rule: 'Brelan + Paire (3 identiques + 2 identiques)',
    scoring: {
      method: 'fixed',
      value: 25,
    },
    example: {
      dice: [3, 3, 3, 6, 6],
      highlight: [3, 3, 3, 6, 6],
      calculation: 'Full réussi',
      result: 25,
    },
    tips: [
      'Toujours 25 points si réussi',
      'Ne dépend pas de la valeur des dés',
    ],
  },
  {
    id: 'smallStraight',
    name: 'Petite Suite',
    emoji: '📊',
    difficulty: 'Moyen',
    section: 'lower',
    rule: '4 dés consécutifs',
    scoring: {
      method: 'fixed',
      value: 30,
    },
    example: {
      dice: [1, 2, 3, 4, 6],
      highlight: [1, 2, 3, 4],
      calculation: 'Petite Suite réussie',
      result: 30,
    },
    tips: [
      'Exemples valides : 1-2-3-4, 2-3-4-5, 3-4-5-6',
      'Le 5ème dé peut être n\'importe quelle valeur',
    ],
  },
  {
    id: 'largeStraight',
    name: 'Grande Suite',
    emoji: '🚀',
    difficulty: 'Très Difficile',
    section: 'lower',
    rule: '5 dés consécutifs',
    scoring: {
      method: 'fixed',
      value: 40,
    },
    example: {
      dice: [1, 2, 3, 4, 5],
      highlight: [1, 2, 3, 4, 5],
      calculation: 'Grande Suite réussie',
      result: 40,
    },
    tips: [
      'Seulement 2 combinaisons possibles : 1-2-3-4-5 ou 2-3-4-5-6',
      'Très difficile à obtenir',
    ],
  },
  {
    id: 'yams',
    name: 'Yams',
    emoji: '👑',
    difficulty: 'Légendaire',
    section: 'lower',
    rule: '5 dés identiques',
    scoring: {
      method: 'fixed',
      value: 50,
    },
    example: {
      dice: [6, 6, 6, 6, 6],
      highlight: [6, 6, 6, 6, 6],
      calculation: 'YAMS !',
      result: 50,
    },
    tips: [
      'Le score maximum pour une seule catégorie',
      'Probabilité : ~0.08% par lancer',
      'Peut être fait avec n\'importe quel chiffre',
    ],
  },
  {
    id: 'chance',
    name: 'Chance',
    emoji: '🍀',
    difficulty: 'Facile',
    section: 'lower',
    rule: 'N\'importe quelle combinaison',
    scoring: {
      method: 'sum',
      formula: 'Total des 5 dés',
    },
    example: {
      dice: [6, 5, 4, 3, 2],
      highlight: [6, 5, 4, 3, 2],
      calculation: '6 + 5 + 4 + 3 + 2',
      result: 20,
    },
    tips: [
      'Ton filet de sécurité',
      'Utilise-le pour un mauvais lancer',
      'Vise au moins 20 points',
    ],
  },
];

// ============================================
// ASTUCES & STRATÉGIES
// ============================================

export const gameTips: TipItem[] = [
  {
    icon: '🎯',
    category: 'Bonus',
    title: 'Priorise le bonus +35',
    description: 'Vise au moins 3 par catégorie dans la section supérieure pour atteindre 63 points et débloquer le bonus de 35 points.',
    priority: 'high',
  },
  {
    icon: '⏰',
    category: 'Timing',
    title: 'Garde les gros scores pour la fin',
    description: 'Yams, Grande Suite : à utiliser stratégiquement quand tu en as vraiment besoin.',
    priority: 'medium',
  },
  {
    icon: '🍀',
    category: 'Sécurité',
    title: 'La Chance est ton filet de sécurité',
    description: 'Utilise-la quand tu as un mauvais lancer et plus d\'options viables.',
    priority: 'low',
  },
  {
    icon: '❌',
    category: 'Sacrifice',
    title: 'N\'hésite pas à barrer (mettre 0)',
    description: 'Mieux vaut sacrifier une petite catégorie (comme les 1) que gâcher une grosse comme le Yams.',
    priority: 'medium',
  },
  {
    icon: '🎲',
    category: 'Lancers',
    title: 'Utilise tes 3 lancers intelligemment',
    description: 'Ne te précipite pas. Analyse chaque lancer et garde les dés utiles.',
    priority: 'high',
  },
  {
    icon: '🧮',
    category: 'Calcul',
    title: 'Compte tes points avant de jouer',
    description: 'Vérifie toujours combien de points tu peux obtenir avant de choisir une catégorie.',
    priority: 'medium',
  },
];

// ============================================
// PHASES DU JEU
// ============================================

export const gamePhases: GamePhase[] = [
  {
    phase: 1,
    title: 'Début (Tours 1-4)',
    icon: '🌱',
    recommendations: [
      'Remplis la section supérieure',
      'Vise le bonus de 35 points',
      'Évite les grosses combinaisons pour l\'instant',
    ],
    color: '#50C878',
  },
  {
    phase: 2,
    title: 'Milieu (Tours 5-9)',
    icon: '⚡',
    recommendations: [
      'Tente les suites si possible',
      'Sécurise les brelans et carrés',
      'Adapte-toi à tes lancers',
    ],
    color: '#4A90E2',
  },
  {
    phase: 3,
    title: 'Fin (Tours 10-13)',
    icon: '🏆',
    recommendations: [
      'Utilise la Chance si besoin',
      'Prends des risques calculés pour le Yams',
      'Barre une catégorie si nécessaire',
    ],
    color: '#9B59B6',
  },
];

// ============================================
// INFORMATIONS GÉNÉRALES
// ============================================

export const gameBasics = {
  objective: {
    title: 'Objectif du Jeu',
    icon: '🎯',
    description: 'Obtenir le meilleur score en remplissant les 13 catégories',
    highlight: 'Le joueur avec le plus de points gagne',
  },

  turn: {
    title: 'Déroulement d\'un Tour',
    steps: [
      {
        number: 1,
        icon: '🎲',
        title: 'Lance les 5 dés',
        description: 'Tous les dés sont lancés ensemble',
        color: '#4A90E2',
      },
      {
        number: 2,
        icon: '🤔',
        title: 'Garde ou relance',
        description: 'Tu peux garder certains dés et relancer les autres',
        color: '#50C878',
      },
      {
        number: 3,
        icon: '🔁',
        title: 'Jusqu\'à 3 lancers',
        description: 'Tu as 3 lancers maximum par tour',
        color: '#F39C12',
      },
      {
        number: 4,
        icon: '✅',
        title: 'Choisis une catégorie',
        description: 'Inscris ton score dans UNE catégorie',
        color: '#9B59B6',
      },
    ],
  },

  duration: {
    title: 'Durée d\'une Partie',
    stats: [
      { icon: '🎲', label: 'Tours par joueur', value: '13', color: '#4A90E2' },
      { icon: '👥', label: 'Joueurs', value: '2-6', color: '#50C878' },
      { icon: '⏰', label: 'Durée moyenne', value: '20-30 min', color: '#F39C12' },
    ],
  },

  bonus: {
    title: 'Bonus : +35 points',
    icon: '⭐',
    condition: 'Si total section supérieure ≥ 63 points',
    tip: 'Moyenne de ~3 par catégorie',
    target: 63,
    reward: 35,
  },
};

// ============================================
// EXEMPLES DE SCORES
// ============================================

export const scoreExamples = [
  {
    name: 'Débutant',
    avatar: '🌱',
    score: 120,
    breakdown: {
      upper: 45,
      bonus: 0,
      lower: 75,
    },
    color: '#50C878',
  },
  {
    name: 'Intermédiaire',
    avatar: '⭐',
    score: 220,
    breakdown: {
      upper: 68,
      bonus: 35,
      lower: 117,
    },
    color: '#4A90E2',
  },
  {
    name: 'Expert',
    avatar: '👑',
    score: 320,
    breakdown: {
      upper: 85,
      bonus: 35,
      lower: 200,
    },
    color: '#FFD700',
  },
];

// ============================================
// STATISTIQUES & FAITS AMUSANTS
// ============================================

export const funFacts = [
  {
    icon: '🎲',
    title: 'Probabilité d\'un Yams',
    value: '0.08%',
    description: 'Environ 1 chance sur 1 296 par lancer',
  },
  {
    icon: '🏆',
    title: 'Score parfait théorique',
    value: '375',
    description: 'Avec tous les meilleurs scores possibles',
  },
  {
    icon: '⭐',
    title: 'Importance du bonus',
    value: '+35',
    description: 'Représente ~15% du score total moyen',
  },
  {
    icon: '🎯',
    title: 'Catégorie la plus difficile',
    value: 'Grande Suite',
    description: 'Seulement 2 combinaisons possibles',
  },
];
