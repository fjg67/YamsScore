/**
 * Tutorial Service - Gère le système de tutoriel progressif à 10 niveaux
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  TutorialLevel,
  TutorialLevelData,
  TutorialProgress,
  TutorialStep,
} from '../src/types/learning';

const TUTORIAL_PROGRESS_KEY = '@yams_tutorial_progress';

// ============================================================================
// TUTORIAL LEVELS DATA
// ============================================================================

export const TUTORIAL_LEVELS: Record<TutorialLevel, TutorialLevelData> = {
  1: {
    level: 1,
    title: 'Bienvenue au Yams !',
    description: 'Découvrez les bases du jeu et les règles fondamentales',
    icon: '👋',
    difficulty: 'débutant',
    estimatedDuration: 5,
    steps: [
      {
        id: 'level1_step1',
        type: 'explanation',
        title: 'Qu\'est-ce que le Yams ?',
        content: 'Le Yams est un jeu de dés où vous devez obtenir des combinaisons pour marquer des points. Vous avez 5 dés et 3 lancers par tour !',
        luckyDialogue: 'Salut champion ! 🎲 Je suis Lucky, ta mascotte ! Je vais t\'apprendre à devenir un pro du Yams !',
        luckyMood: 'excited',
      },
      {
        id: 'level1_step2',
        type: 'demonstration',
        title: 'Les dés et les lancers',
        content: 'À chaque tour, vous lancez 5 dés. Vous pouvez garder certains dés et relancer les autres, jusqu\'à 3 lancers maximum.',
        explanation: 'La stratégie consiste à décider quels dés garder pour obtenir la meilleure combinaison possible.',
        demoData: {
          dice: [1, 1, 3, 4, 6],
          explanation: 'Ici, vous pourriez garder les deux 1 et relancer le reste pour tenter d\'obtenir plus de 1.',
        },
        luckyDialogue: 'Regarde bien ces dés ! Tu peux choisir lesquels garder et relancer les autres. C\'est comme au poker, mais avec des dés ! 🎯',
        luckyMood: 'thinking',
      },
      {
        id: 'level1_step3',
        type: 'quiz',
        title: 'Test de compréhension',
        content: 'Voyons si tu as bien compris !',
        quizData: {
          question: 'Combien de lancers maximum avez-vous par tour ?',
          options: ['1 lancer', '2 lancers', '3 lancers', 'Illimité'],
          correctAnswer: 2,
          explanation: 'Exact ! Vous avez droit à 3 lancers maximum par tour. Utilisez-les stratégiquement !',
        },
        luckyDialogue: 'Voyons si tu as bien suivi ! 🤔',
        luckyMood: 'thinking',
      },
    ],
  },

  2: {
    level: 2,
    title: 'La section supérieure',
    description: 'Maîtrisez les catégories de la section supérieure (1 à 6)',
    icon: '🔢',
    difficulty: 'débutant',
    estimatedDuration: 8,
    requiredLevel: 1,
    steps: [
      {
        id: 'level2_step1',
        type: 'explanation',
        title: 'Les catégories 1 à 6',
        content: 'La section supérieure comprend 6 catégories : les As (1), les Deux (2), les Trois (3), etc. Vous additionnez tous les dés de la valeur choisie.',
        explanation: 'Par exemple, si vous avez trois dés montrant "5", vous marquez 15 points dans la catégorie "Cinq".',
        luckyDialogue: 'La section du haut, c\'est simple : tu comptes tes dés ! Plus tu en as, plus tu marques de points ! 🎲',
        luckyMood: 'happy',
      },
      {
        id: 'level2_step2',
        type: 'demonstration',
        title: 'Exemple de calcul',
        content: 'Regardez cet exemple pratique',
        demoData: {
          dice: [3, 3, 3, 5, 6],
          suggestedCategory: 'threes',
          explanation: 'Avec ces dés, vous avez trois "3". Si vous jouez la catégorie "Trois", vous marquez 9 points (3+3+3).',
        },
        luckyDialogue: 'Regarde ! Trois fois le 3, ça fait 9 points. Facile, non ? 😎',
        luckyMood: 'happy',
      },
      {
        id: 'level2_step3',
        type: 'explanation',
        title: 'Le bonus magique !',
        content: 'Si vous totalisez 63 points ou plus dans la section supérieure, vous gagnez un BONUS de 35 points !',
        explanation: 'Pour obtenir 63 points, il faut en moyenne 3 dés de chaque valeur. C\'est un objectif crucial !',
        luckyDialogue: 'Le bonus de 35 points, c\'est ÉNORME ! 🌟 C\'est presque comme avoir un tour gratuit ! Essaie toujours de l\'obtenir !',
        luckyMood: 'excited',
      },
      {
        id: 'level2_step4',
        type: 'challenge',
        title: 'À toi de jouer !',
        content: 'Obtiens le score maximum dans la catégorie indiquée',
        challengeData: {
          objective: 'Marquer au moins 15 points dans la catégorie "Cinq"',
          startDice: [5, 5, 2, 4, 6],
          targetCategory: 'fives',
          minScore: 15,
          hint: 'Tu as déjà deux 5. Garde-les et relance le reste pour en obtenir un troisième !',
        },
        luckyDialogue: 'C\'est ton tour ! Montre-moi ce que tu as appris ! 💪',
        luckyMood: 'excited',
      },
      {
        id: 'level2_step5',
        type: 'quiz',
        title: 'Question bonus',
        content: 'Testez vos connaissances sur le bonus',
        quizData: {
          question: 'Combien de points faut-il dans la section supérieure pour obtenir le bonus ?',
          options: ['50 points', '60 points', '63 points', '70 points'],
          correctAnswer: 2,
          explanation: 'C\'est bien 63 points ! Soit en moyenne 3 dés de chaque valeur (3×1 + 3×2 + 3×3 + 3×4 + 3×5 + 3×6 = 63).',
        },
        luckyDialogue: 'Si tu retiens ce chiffre magique, tu seras déjà meilleur que 50% des joueurs ! 🎯',
        luckyMood: 'happy',
      },
    ],
  },

  3: {
    level: 3,
    title: 'Brelan et Carré',
    description: 'Apprenez à jouer les Brelans et Carrés efficacement',
    icon: '🎲',
    difficulty: 'débutant',
    estimatedDuration: 10,
    requiredLevel: 2,
    steps: [
      {
        id: 'level3_step1',
        type: 'explanation',
        title: 'Qu\'est-ce qu\'un Brelan ?',
        content: 'Un Brelan, c\'est avoir au moins 3 dés identiques. Vous additionnez TOUS les dés (pas seulement le brelan).',
        explanation: 'Exemple : avec 4-4-4-6-6, vous avez un brelan de 4. Score = 4+4+4+6+6 = 24 points.',
        luckyDialogue: 'Le Brelan, c\'est cool : trois dés pareils et tu comptes tout ! Plus les autres dés sont élevés, mieux c\'est ! 🎲',
        luckyMood: 'happy',
      },
      {
        id: 'level3_step2',
        type: 'demonstration',
        title: 'Maximiser un Brelan',
        content: 'Stratégie pour obtenir le score maximum',
        demoData: {
          dice: [6, 6, 6, 2, 3],
          suggestedCategory: 'threeOfKind',
          explanation: 'Brelan de 6 ! Score : 6+6+6+2+3 = 23 points. Les dés élevés donnent de meilleurs scores au Brelan.',
        },
        luckyDialogue: 'Un brelan de 6, c\'est excellent ! Les gros chiffres donnent de gros scores ! 💪',
        luckyMood: 'excited',
      },
      {
        id: 'level3_step3',
        type: 'explanation',
        title: 'Le Carré, c\'est mieux !',
        content: 'Un Carré, c\'est 4 dés identiques. Même principe : vous additionnez tous les dés.',
        explanation: 'Exemple : avec 5-5-5-5-2, vous avez un carré de 5. Score = 5+5+5+5+2 = 22 points.',
        luckyDialogue: 'Le Carré, c\'est le grand frère du Brelan ! 4 dés identiques, ça en jette ! 🔥',
        luckyMood: 'excited',
      },
      {
        id: 'level3_step4',
        type: 'challenge',
        title: 'Défi Carré',
        content: 'Réalisez un Carré de score élevé',
        challengeData: {
          objective: 'Obtenir un Carré qui rapporte au moins 25 points',
          startDice: [6, 6, 6, 3, 2],
          targetCategory: 'fourOfKind',
          minScore: 25,
          hint: 'Tu as trois 6. Garde-les tous et relance le reste pour tenter un quatrième 6 !',
        },
        luckyDialogue: 'Allez, vise haut ! Un Carré de 6, ce serait royal ! 👑',
        luckyMood: 'excited',
      },
      {
        id: 'level3_step5',
        type: 'quiz',
        title: 'Brelan vs Carré',
        content: 'Quelle est la différence ?',
        quizData: {
          question: 'Avec 5-5-5-4-4, quelle catégorie pouvez-vous jouer ?',
          options: [
            'Seulement Brelan',
            'Seulement Carré',
            'Brelan ou Full',
            'Toutes les catégories',
          ],
          correctAnswer: 2,
          explanation: 'Vous avez un brelan de 5 ET deux paires, donc vous pouvez faire un Brelan OU un Full ! Le Full rapporte 25 points garantis.',
        },
        luckyDialogue: 'Parfois, plusieurs options s\'offrent à toi ! Choisis la meilleure ! 🧠',
        luckyMood: 'thinking',
      },
    ],
  },

  4: {
    level: 4,
    title: 'Le Full House',
    description: 'Maîtrisez l\'art du Full : brelan + paire',
    icon: '🏠',
    difficulty: 'intermédiaire',
    estimatedDuration: 8,
    requiredLevel: 3,
    steps: [
      {
        id: 'level4_step1',
        type: 'explanation',
        title: 'Qu\'est-ce qu\'un Full ?',
        content: 'Un Full, c\'est un Brelan (3 dés identiques) + une Paire (2 dés identiques). Le Full rapporte toujours 25 points.',
        explanation: 'Exemple : 4-4-4-2-2 est un Full. Peu importe les valeurs, c\'est 25 points garantis !',
        luckyDialogue: 'Le Full, c\'est une maison pleine ! 🏠 Un brelan et une paire, et hop, 25 points dans la poche !',
        luckyMood: 'happy',
      },
      {
        id: 'level4_step2',
        type: 'demonstration',
        title: 'Reconnaître un Full',
        content: 'Exemples de Full valides',
        demoData: {
          dice: [6, 6, 6, 1, 1],
          suggestedCategory: 'fullHouse',
          explanation: 'Full avec brelan de 6 et paire de 1. Toujours 25 points, quelle que soit la combinaison !',
        },
        luckyDialogue: 'Que tu aies 1-1-1-2-2 ou 6-6-6-5-5, c\'est pareil : 25 points ! 🎯',
        luckyMood: 'happy',
      },
      {
        id: 'level4_step3',
        type: 'explanation',
        title: 'Stratégie du Full',
        content: 'Quand viser un Full ?',
        explanation: 'Visez un Full quand vous avez déjà une paire et un brelan, ou deux paires. C\'est plus facile que le Yams et rapporte bien !',
        luckyDialogue: 'Si tu as deux paires, tente le Full ! C\'est plus facile qu\'un Yams et ça rapporte presque autant ! 🎲',
        luckyMood: 'thinking',
      },
      {
        id: 'level4_step4',
        type: 'challenge',
        title: 'Réalise un Full !',
        content: 'Transforme ces dés en Full',
        challengeData: {
          objective: 'Obtenir un Full (25 points)',
          startDice: [3, 3, 5, 5, 5],
          targetCategory: 'fullHouse',
          minScore: 25,
          hint: 'Tu as déjà un brelan de 5 et une paire de 3 ! C\'est déjà un Full !',
        },
        luckyDialogue: 'Regarde bien tes dés... tu as peut-être déjà gagné ! 😉',
        luckyMood: 'excited',
      },
      {
        id: 'level4_step5',
        type: 'quiz',
        title: 'Test Full',
        content: 'Vérifiez votre compréhension',
        quizData: {
          question: 'Quelle combinaison N\'EST PAS un Full ?',
          options: [
            '2-2-2-5-5',
            '6-6-4-4-4',
            '3-3-3-3-3',
            '1-1-6-6-6',
          ],
          correctAnswer: 2,
          explanation: 'Correct ! 3-3-3-3-3 n\'est pas un Full mais un Yams (5 dés identiques) ! Un Full nécessite exactement un brelan ET une paire.',
        },
        luckyDialogue: 'Attention aux pièges ! Un Yams n\'est pas un Full ! 🎯',
        luckyMood: 'thinking',
      },
    ],
  },

  5: {
    level: 5,
    title: 'Les Suites',
    description: 'Petite et Grande Suite : devenez un expert des séquences',
    icon: '⚀⚁⚂⚃⚄',
    difficulty: 'intermédiaire',
    estimatedDuration: 12,
    requiredLevel: 4,
    steps: [
      {
        id: 'level5_step1',
        type: 'explanation',
        title: 'Qu\'est-ce qu\'une Suite ?',
        content: 'Une Suite est une séquence de dés consécutifs. Petite Suite = 4 dés consécutifs (30 pts), Grande Suite = 5 dés consécutifs (40 pts).',
        explanation: 'Exemples : Petite = 1-2-3-4 ou 2-3-4-5 ou 3-4-5-6. Grande = 1-2-3-4-5 ou 2-3-4-5-6.',
        luckyDialogue: 'Les suites, c\'est comme un escalier ! 🪜 Plus l\'escalier est long, plus tu gagnes de points !',
        luckyMood: 'happy',
      },
      {
        id: 'level5_step2',
        type: 'demonstration',
        title: 'Petite Suite',
        content: 'Exemple de Petite Suite',
        demoData: {
          dice: [2, 3, 4, 5, 6],
          suggestedCategory: 'smallStraight',
          explanation: 'Vous avez 2-3-4-5-6, c\'est une Grande Suite (40 pts) ! Mais vous pourriez aussi la jouer en Petite Suite.',
        },
        luckyDialogue: 'Attention ! Si tu as une Grande Suite, joue-la en Grande Suite ! Ne gaspille pas 10 points ! 💡',
        luckyMood: 'thinking',
      },
      {
        id: 'level5_step3',
        type: 'explanation',
        title: 'Comment viser une Suite ?',
        content: 'Stratégie pour obtenir une Suite',
        explanation: 'Si vous avez 3 dés consécutifs, gardez-les et relancez le reste. Évitez les doublons (deux dés identiques) car ils empêchent les suites.',
        luckyDialogue: 'Pas de doublons pour les suites ! Si tu as 1-2-3, garde-les et relance le reste ! 🎯',
        luckyMood: 'thinking',
      },
      {
        id: 'level5_step4',
        type: 'challenge',
        title: 'Défi Grande Suite',
        content: 'Réalisez une Grande Suite',
        challengeData: {
          objective: 'Obtenir une Grande Suite (40 points)',
          startDice: [1, 2, 3, 4, 6],
          targetCategory: 'largeStraight',
          minScore: 40,
          hint: 'Tu as 1-2-3-4, il te manque juste le 5 ! Garde ces 4 dés et relance le 6.',
        },
        luckyDialogue: 'Allez, un petit 5 et c\'est dans la poche ! 🎲',
        luckyMood: 'excited',
      },
      {
        id: 'level5_step5',
        type: 'quiz',
        title: 'Quiz Suites',
        content: 'Testez vos connaissances',
        quizData: {
          question: 'Avec 1-2-3-4-4, quelle catégorie est possible ?',
          options: [
            'Petite Suite uniquement',
            'Grande Suite uniquement',
            'Petite ou Grande Suite',
            'Aucune suite possible',
          ],
          correctAnswer: 0,
          explanation: 'Avec 1-2-3-4-4, vous avez 4 dés consécutifs (1-2-3-4), donc une Petite Suite est possible (30 points). Le doublon empêche la Grande Suite.',
        },
        luckyDialogue: 'Les doublons bloquent les Grandes Suites, mais pas les Petites ! 📚',
        luckyMood: 'happy',
      },
    ],
  },

  6: {
    level: 6,
    title: 'Le YAMS !',
    description: 'Le graal : 5 dés identiques pour 50 points',
    icon: '🎯',
    difficulty: 'intermédiaire',
    estimatedDuration: 10,
    requiredLevel: 5,
    steps: [
      {
        id: 'level6_step1',
        type: 'explanation',
        title: 'Le Yams, le coup parfait',
        content: 'Un Yams, c\'est 5 dés identiques ! C\'est rare mais ça rapporte 50 points. C\'est le coup le plus prestigieux du jeu !',
        explanation: 'Probabilité d\'obtenir un Yams en 3 lancers : environ 4.6%. C\'est rare mais possible !',
        luckyDialogue: 'Le YAMS ! 🌟 Le coup de légende ! 5 dés identiques, 50 points, et la gloire éternelle !',
        luckyMood: 'celebrating',
      },
      {
        id: 'level6_step2',
        type: 'demonstration',
        title: 'Exemple de Yams',
        content: 'Le coup parfait',
        demoData: {
          dice: [6, 6, 6, 6, 6],
          suggestedCategory: 'yams',
          explanation: 'YAMS de 6 ! 50 points garantis. Peu importe la valeur (1 ou 6), c\'est toujours 50 points.',
        },
        luckyDialogue: 'Wouhou ! Un Yams de 6 ! 🎉 C\'est le coup de rêve !',
        luckyMood: 'celebrating',
      },
      {
        id: 'level6_step3',
        type: 'explanation',
        title: 'Quand viser un Yams ?',
        content: 'Stratégie pour tenter le Yams',
        explanation: 'Visez le Yams si vous avez 3 ou 4 dés identiques au premier lancer. Sinon, c\'est trop risqué.',
        luckyDialogue: 'Si tu as 3-4 dés identiques dès le début, fonce ! Sinon, choisis une autre catégorie. Sois malin ! 🧠',
        luckyMood: 'thinking',
      },
      {
        id: 'level6_step4',
        type: 'challenge',
        title: 'Tentez le Yams !',
        content: 'Réalisez votre premier Yams',
        challengeData: {
          objective: 'Obtenir un Yams (50 points)',
          startDice: [4, 4, 4, 4, 2],
          targetCategory: 'yams',
          minScore: 50,
          hint: 'Tu as déjà 4 dés identiques ! Garde-les tous et relance le dernier. Il y a 1 chance sur 6 !',
        },
        luckyDialogue: 'Allez, c\'est le moment ! Un dernier 4 et c\'est la gloire ! 🎯',
        luckyMood: 'excited',
      },
      {
        id: 'level6_step5',
        type: 'quiz',
        title: 'Maîtrise du Yams',
        content: 'Question stratégique',
        quizData: {
          question: 'Premier lancer : vous avez 2-2-4-5-6. Devriez-vous viser un Yams ?',
          options: [
            'Oui, gardez les 2 et relancez',
            'Non, c\'est trop risqué',
            'Gardez tout et espérez',
            'Relancez tout',
          ],
          correctAnswer: 1,
          explanation: 'Non ! Avec seulement deux dés identiques, les chances d\'obtenir un Yams sont très faibles (< 1%). Visez plutôt une autre catégorie.',
        },
        luckyDialogue: 'Sois ambitieux, mais pas fou ! Avec seulement 2 dés, c\'est trop risqué ! 🎲',
        luckyMood: 'thinking',
      },
    ],
  },

  7: {
    level: 7,
    title: 'La Chance',
    description: 'Quand et comment utiliser la catégorie Chance',
    icon: '🍀',
    difficulty: 'avancé',
    estimatedDuration: 8,
    requiredLevel: 6,
    steps: [
      {
        id: 'level7_step1',
        type: 'explanation',
        title: 'La catégorie Chance',
        content: 'Chance : additionnez simplement tous les dés, peu importe la combinaison. C\'est votre catégorie "joker".',
        explanation: 'Utilisez Chance stratégiquement ! C\'est parfait pour les gros totaux sans combinaison spécifique.',
        luckyDialogue: 'La Chance, c\'est ta roue de secours ! 🍀 Parfait pour les coups ratés... ou les très gros totaux !',
        luckyMood: 'happy',
      },
      {
        id: 'level7_step2',
        type: 'demonstration',
        title: 'Quand utiliser Chance ?',
        content: 'Exemples d\'utilisation intelligente',
        demoData: {
          dice: [6, 6, 5, 5, 4],
          suggestedCategory: 'chance',
          explanation: 'Total : 26 points ! Pas de combinaison spéciale, mais un excellent score pour la Chance.',
        },
        luckyDialogue: 'Regarde ! Aucune combo spéciale, mais 26 points en Chance, c\'est top ! 💪',
        luckyMood: 'happy',
      },
      {
        id: 'level7_step3',
        type: 'explanation',
        title: 'Chance : les bonnes pratiques',
        content: 'Règles d\'or pour la Chance',
        explanation: '1) Visez 25+ points. 2) Utilisez-la en fin de partie. 3) Gardez-la pour les coups ratés ou les très gros totaux.',
        luckyDialogue: 'La Chance, c\'est comme un joker au poker : ne la gaspille pas trop tôt ! 🎴',
        luckyMood: 'thinking',
      },
      {
        id: 'level7_step4',
        type: 'challenge',
        title: 'Maximisez votre Chance',
        content: 'Obtenez le meilleur score possible',
        challengeData: {
          objective: 'Marquer au moins 28 points en Chance',
          startDice: [6, 5, 5, 4, 3],
          targetCategory: 'chance',
          minScore: 28,
          hint: 'Garde les gros chiffres (6 et les 5) et relance les petits pour augmenter ton total !',
        },
        luckyDialogue: 'Allez, vise haut ! Plus de dés élevés = plus de points ! 🎯',
        luckyMood: 'excited',
      },
      {
        id: 'level7_step5',
        type: 'quiz',
        title: 'Stratégie Chance',
        content: 'Question tactique',
        quizData: {
          question: 'Vous avez 3-3-3-2-1 (total: 12). Que faire ?',
          options: [
            'Jouer en Chance',
            'Jouer en Brelan',
            'Relancer pour améliorer',
            'Barrer une case',
          ],
          correctAnswer: 1,
          explanation: 'Jouez le Brelan ! 3+3+3+2+1 = 12 points en Brelan, mais c\'est mieux que gaspiller votre Chance pour si peu. Gardez Chance pour plus tard.',
        },
        luckyDialogue: 'Ne gaspille pas ta Chance pour un petit score ! Garde-la précieusement ! 💎',
        luckyMood: 'thinking',
      },
    ],
  },

  8: {
    level: 8,
    title: 'Décisions tactiques',
    description: 'Apprenez à prendre les meilleures décisions stratégiques',
    icon: '🧠',
    difficulty: 'avancé',
    estimatedDuration: 15,
    requiredLevel: 7,
    steps: [
      {
        id: 'level8_step1',
        type: 'explanation',
        title: 'L\'ordre des catégories',
        content: 'L\'ordre dans lequel vous remplissez les catégories est crucial ! Ne vous précipitez pas.',
        explanation: 'Règle d\'or : remplissez les catégories difficiles (suites, Yams) quand l\'opportunité se présente. Les catégories simples peuvent attendre.',
        luckyDialogue: 'L\'ordre, c\'est la clé ! 🗝️ Ne remplis pas les cases faciles trop vite, tu vas le regretter !',
        luckyMood: 'thinking',
      },
      {
        id: 'level8_step2',
        type: 'demonstration',
        title: 'Exemple de mauvaise décision',
        content: 'Erreur courante à éviter',
        demoData: {
          dice: [1, 2, 3, 4, 5],
          suggestedCategory: 'largeStraight',
          explanation: 'Grande Suite ! 40 points. Ne la gaspillez pas en "Chance" ou "Brelan" ! Les suites sont rares.',
        },
        luckyDialogue: 'Ne fais JAMAIS ça ! Une Grande Suite, c\'est 40 points garantis. Ne la mets pas ailleurs ! 🚫',
        luckyMood: 'thinking',
      },
      {
        id: 'level8_step3',
        type: 'explanation',
        title: 'Sacrifier une case',
        content: 'Parfois, il faut barrer une case (= marquer 0) stratégiquement',
        explanation: 'Si vous avez un très mauvais lancer et que les catégories importantes sont remplies, sacrifiez une catégorie de la section supérieure.',
        luckyDialogue: 'Parfois, il faut savoir perdre une bataille pour gagner la guerre ! ⚔️ Barre une petite case pour garder les bonnes !',
        luckyMood: 'thinking',
      },
      {
        id: 'level8_step4',
        type: 'challenge',
        title: 'Choix difficile',
        content: 'Prenez la meilleure décision',
        challengeData: {
          objective: 'Choisissez la catégorie optimale',
          startDice: [4, 4, 4, 6, 6],
          targetCategory: 'fullHouse',
          minScore: 25,
          hint: 'Vous avez un Full (25 pts) OU un Brelan (24 pts). Le Full est plus rare et difficile à obtenir !',
        },
        luckyDialogue: 'Réfléchis bien ! Les deux options sont bonnes, mais laquelle est la plus stratégique ? 🤔',
        luckyMood: 'thinking',
      },
      {
        id: 'level8_step5',
        type: 'quiz',
        title: 'Maître tacticien',
        content: 'Test de stratégie avancée',
        quizData: {
          question: 'Tour 10/13 : vous avez 2-2-2-3-4 (Brelan = 13 pts). Votre section supérieure est à 55/63 pour le bonus. Que faire ?',
          options: [
            'Jouer le Brelan maintenant',
            'Jouer en section supérieure pour le bonus',
            'Jouer en Chance',
            'Barrer une case',
          ],
          correctAnswer: 1,
          explanation: 'Priorisez le bonus ! Vous êtes à 55/63, il vous faut encore 8 points. Jouez les "2" (= 6 pts) et visez le bonus dans les prochains tours. Le Brelan peut attendre.',
        },
        luckyDialogue: 'Le bonus de 35 points, c\'est énorme ! Parfois, il faut sacrifier un coup pour l\'obtenir ! 🎯',
        luckyMood: 'thinking',
      },
    ],
  },

  9: {
    level: 9,
    title: 'Gestion du risque',
    description: 'Risque vs Sécurité : trouvez le bon équilibre',
    icon: '⚖️',
    difficulty: 'avancé',
    estimatedDuration: 12,
    requiredLevel: 8,
    steps: [
      {
        id: 'level9_step1',
        type: 'explanation',
        title: 'Comprendre le risque',
        content: 'Chaque décision est un pari : relancer pour améliorer ou garder pour sécuriser ?',
        explanation: 'Le risque intelligent : évaluez vos chances d\'amélioration vs le risque de perdre ce que vous avez.',
        luckyDialogue: 'Le Yams, c\'est comme la vie : il faut savoir quand prendre des risques ! 🎲',
        luckyMood: 'thinking',
      },
      {
        id: 'level9_step2',
        type: 'demonstration',
        title: 'Exemple de risque calculé',
        content: 'Analyons ensemble',
        demoData: {
          dice: [5, 5, 5, 2, 3],
          explanation: 'Brelan de 5 (18 pts). Relancer pour tenter un Carré (risqué) ou garder le Brelan (sûr) ? Analysez le contexte !',
        },
        luckyDialogue: 'Tu as un bon Brelan. Si tu relances, tu peux obtenir un Carré... ou tout perdre ! Que décides-tu ? 🤔',
        luckyMood: 'thinking',
      },
      {
        id: 'level9_step3',
        type: 'explanation',
        title: 'Quand prendre des risques ?',
        content: 'Les situations où le risque est justifié',
        explanation: '1) Début de partie (vous avez du temps). 2) Catégories difficiles vides. 3) Vous avez 2 lancers restants. 4) Vous êtes en retard dans le score.',
        luckyDialogue: 'En début de partie, ose ! En fin de partie, sécurise ! ⚡',
        luckyMood: 'happy',
      },
      {
        id: 'level9_step4',
        type: 'challenge',
        title: 'Le choix du risque',
        content: 'Décidez de votre stratégie',
        challengeData: {
          objective: 'Tour 3/13 : décidez si vous prenez le risque',
          startDice: [2, 3, 4, 5, 1],
          targetCategory: 'largeStraight',
          minScore: 30,
          hint: 'Vous avez 1-2-3-4-5... mais le 1 peut devenir un 6 pour une Grande Suite ! 2 lancers restants, prenez le risque !',
        },
        luckyDialogue: 'C\'est le début de partie, tu as 2 relances... fonce ! Le risque vaut la récompense ! 💪',
        luckyMood: 'excited',
      },
      {
        id: 'level9_step5',
        type: 'quiz',
        title: 'Gestion du risque',
        content: 'Question stratégique',
        quizData: {
          question: 'Tour 12/13, dernier lancer : vous avez 4-4-4-4-2 (Carré = 18 pts). Relancer le 2 pour tenter un Yams ?',
          options: [
            'Oui, tentez le Yams !',
            'Non, gardez le Carré',
            'Relancez tout',
            'Barrez une case',
          ],
          correctAnswer: 1,
          explanation: 'NON ! C\'est le dernier lancer, fin de partie. 18 points garantis en Carré, c\'est excellent. Ne risquez pas tout pour 1/6 de chance d\'avoir 32 points de plus (Yams - Carré).',
        },
        luckyDialogue: 'En fin de partie, un tiens vaut mieux que deux tu l\'auras ! 🎯',
        luckyMood: 'thinking',
      },
    ],
  },

  10: {
    level: 10,
    title: 'Maître du Yams',
    description: 'Stratégies d\'expert et analyse de fin de partie',
    icon: '👑',
    difficulty: 'expert',
    estimatedDuration: 20,
    requiredLevel: 9,
    unlockMessage: 'Félicitations ! Vous avez atteint le niveau ultime ! 🎉',
    steps: [
      {
        id: 'level10_step1',
        type: 'explanation',
        title: 'Bienvenue au niveau Expert',
        content: 'Vous êtes maintenant prêt pour les stratégies les plus avancées du Yams !',
        explanation: 'Les experts pensent 3-4 tours à l\'avance et calculent les probabilités en temps réel.',
        luckyDialogue: 'Wow, champion ! 👑 Tu es arrivé au niveau légendaire ! Prépare-toi à devenir un Maître du Yams !',
        luckyMood: 'celebrating',
      },
      {
        id: 'level10_step2',
        type: 'explanation',
        title: 'Analyse de fin de partie',
        content: 'Les 3 derniers tours sont cruciaux : optimisez chaque point',
        explanation: 'Calculez vos options restantes, évaluez les scores attendus, et priorisez les catégories difficiles.',
        luckyDialogue: 'En fin de partie, chaque point compte ! Analyse, calcule, optimise ! 🧮',
        luckyMood: 'thinking',
      },
      {
        id: 'level10_step3',
        type: 'demonstration',
        title: 'Décision complexe',
        content: 'Situation multi-facteurs',
        demoData: {
          dice: [3, 3, 3, 5, 6],
          explanation: 'Tour 11/13. Brelan = 20 pts OU section supérieure (3 = 9 pts pour le bonus). Analysez : êtes-vous proche du bonus ? Quelles catégories restent ?',
        },
        luckyDialogue: 'Plusieurs facteurs à considérer ! Score actuel, catégories restantes, bonus... que décides-tu ? 🤔',
        luckyMood: 'thinking',
      },
      {
        id: 'level10_step4',
        type: 'challenge',
        title: 'Le défi ultime',
        content: 'Prouvez votre maîtrise',
        challengeData: {
          objective: 'Tour 13/13 : maximisez votre score final',
          startDice: [6, 5, 4, 3, 2],
          targetCategory: 'largeStraight',
          minScore: 40,
          hint: 'Dernière chance ! Vous avez presque une Grande Suite (2-3-4-5-6). Le 6 doit devenir un 1, ou le 2 un 6... Analysez vos catégories restantes !',
        },
        luckyDialogue: 'C\'est le moment de vérité ! Tout ce que tu as appris se joue maintenant ! 🔥',
        luckyMood: 'excited',
      },
      {
        id: 'level10_step5',
        type: 'quiz',
        title: 'Test du Maître',
        content: 'Question finale d\'expert',
        quizData: {
          question: 'Tour 11/13. Section sup : 58/63. Reste : Brelan, Carré, Yams. Vous avez 5-5-5-2-1 (Brelan=18). Que faire ?',
          options: [
            'Jouer le Brelan (18 pts)',
            'Jouer les 5 en section sup (15 pts)',
            'Relancer pour un Carré',
            'Barrer une case',
          ],
          correctAnswer: 1,
          explanation: 'Jouez les "5" ! Vous êtes à 58/63, il faut 5 points pour le bonus de 35 pts. Les 3 dés "5" donnent 15 pts dans la section sup, ce qui vous fait atteindre 73 > 63. Le bonus (35 pts) vaut plus que les 18 pts du Brelan !',
        },
        luckyDialogue: 'Le bonus change tout ! 35 points, c\'est énorme ! Parfois, il faut sacrifier un bon coup pour un excellent résultat global ! 🎯',
        luckyMood: 'celebrating',
      },
      {
        id: 'level10_step6',
        type: 'explanation',
        title: 'Vous êtes un Maître !',
        content: 'Félicitations ! Vous avez terminé tous les niveaux du tutoriel. Vous maîtrisez maintenant toutes les stratégies du Yams !',
        explanation: 'Continuez à pratiquer, explorez le mode Pratique, et analysez vos parties pour devenir encore meilleur !',
        luckyDialogue: 'BRAVO CHAMPION ! 🏆 Tu es officiellement un Maître du Yams ! Je suis fier de toi ! Maintenant, va montrer tes talents au monde ! 🌟',
        luckyMood: 'celebrating',
      },
    ],
  },
};

// ============================================================================
// TUTORIAL SERVICE
// ============================================================================

export class TutorialService {
  /**
   * Obtenir la progression actuelle du tutoriel
   */
  static async getProgress(): Promise<TutorialProgress | null> {
    try {
      const data = await AsyncStorage.getItem(TUTORIAL_PROGRESS_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading tutorial progress:', error);
      return null;
    }
  }

  /**
   * Initialiser une nouvelle progression
   */
  static async initializeProgress(): Promise<TutorialProgress> {
    const progress: TutorialProgress = {
      currentLevel: 1,
      currentStepIndex: 0,
      completedLevels: [],
      completedSteps: [],
      quizScores: {},
      startedAt: Date.now(),
      lastUpdated: Date.now(),
      totalTimeSpent: 0,
    };

    await this.saveProgress(progress);
    return progress;
  }

  /**
   * Sauvegarder la progression
   */
  static async saveProgress(progress: TutorialProgress): Promise<void> {
    try {
      progress.lastUpdated = Date.now();
      await AsyncStorage.setItem(TUTORIAL_PROGRESS_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving tutorial progress:', error);
    }
  }

  /**
   * Compléter une étape
   */
  static async completeStep(
    progress: TutorialProgress,
    stepId: string,
    quizScore?: number
  ): Promise<TutorialProgress> {
    if (!progress.completedSteps.includes(stepId)) {
      progress.completedSteps.push(stepId);
    }

    if (quizScore !== undefined) {
      progress.quizScores[stepId] = quizScore;
    }

    await this.saveProgress(progress);
    return progress;
  }

  /**
   * Passer au step suivant
   */
  static async nextStep(progress: TutorialProgress): Promise<TutorialProgress> {
    const currentLevel = TUTORIAL_LEVELS[progress.currentLevel];

    if (progress.currentStepIndex < currentLevel.steps.length - 1) {
      // Passer au step suivant dans le niveau actuel
      progress.currentStepIndex++;
    } else {
      // Compléter le niveau actuel
      if (!progress.completedLevels.includes(progress.currentLevel)) {
        progress.completedLevels.push(progress.currentLevel);
      }

      // Passer au niveau suivant si disponible
      if (progress.currentLevel < 10) {
        progress.currentLevel = (progress.currentLevel + 1) as TutorialLevel;
        progress.currentStepIndex = 0;
      }
    }

    await this.saveProgress(progress);
    return progress;
  }

  /**
   * Vérifier si un niveau est débloqué
   */
  static isLevelUnlocked(level: TutorialLevel, progress: TutorialProgress): boolean {
    const levelData = TUTORIAL_LEVELS[level];
    if (!levelData.requiredLevel) return true;
    return progress.completedLevels.includes(levelData.requiredLevel);
  }

  /**
   * Obtenir les données d'un niveau
   */
  static getLevelData(level: TutorialLevel): TutorialLevelData {
    return TUTORIAL_LEVELS[level];
  }

  /**
   * Obtenir le step actuel
   */
  static getCurrentStep(progress: TutorialProgress): TutorialStep {
    const level = TUTORIAL_LEVELS[progress.currentLevel];
    return level.steps[progress.currentStepIndex];
  }

  /**
   * Calculer le pourcentage de complétion
   */
  static getCompletionPercentage(progress: TutorialProgress): number {
    const totalSteps = Object.values(TUTORIAL_LEVELS).reduce(
      (sum, level) => sum + level.steps.length,
      0
    );
    return Math.round((progress.completedSteps.length / totalSteps) * 100);
  }

  /**
   * Réinitialiser la progression
   */
  static async resetProgress(): Promise<void> {
    await AsyncStorage.removeItem(TUTORIAL_PROGRESS_KEY);
  }

  /**
   * Obtenir toutes les données des niveaux
   */
  static getAllLevels(): TutorialLevelData[] {
    return Object.values(TUTORIAL_LEVELS);
  }

  /**
   * Sauter au niveau spécifique (pour debug/test)
   */
  static async jumpToLevel(progress: TutorialProgress, level: TutorialLevel): Promise<TutorialProgress> {
    progress.currentLevel = level;
    progress.currentStepIndex = 0;
    await this.saveProgress(progress);
    return progress;
  }
}
