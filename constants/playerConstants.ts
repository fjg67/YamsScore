export const XP_REWARDS = {
  playGame: 10,
  winGame: 50,
  yamsScored: 100,
  bonusEarned: 75,
  perfectGame: 200,
  beatAIEasy: 30,
  beatAINormal: 80,
  beatAIHard: 150,
  firstYams: 250,
  streak3Wins: 100,
  perfectStreak: 300
};

export const UNLOCKABLE_COLORS = [
  { level: 1, color: "#4A90E2", name: "Bleu" },
  { level: 1, color: "#50C878", name: "Vert" },
  { level: 1, color: "#FF6B6B", name: "Rouge" },
  { level: 1, color: "#FFD93D", name: "Jaune" },
  { level: 3, color: "#9B59B6", name: "Violet" },
  { level: 5, color: "#FF69B4", name: "Rose" },
  { level: 8, color: "#FF8C00", name: "Orange" },
  { level: 10, color: "#00CED1", name: "Turquoise" },
  { level: 15, color: "#FFD700", name: "Or" },
  { level: 20, color: "#C0C0C0", name: "Argent" }
];

export const UNLOCKABLE_AVATARS = [
  { level: 1, emoji: "😀", name: "Sourire" },
  { level: 1, emoji: "😎", name: "Cool" },
  { level: 2, emoji: "🤓", name: "Intello" },
  { level: 3, emoji: "😈", name: "Diable" },
  { level: 4, emoji: "👑", name: "Roi" },
  { level: 5, emoji: "🦄", name: "Licorne" },
  { level: 7, emoji: "🦁", name: "Lion" },
  { level: 10, emoji: "🔥", name: "Feu" },
  { level: 12, emoji: "⚡", name: "Éclair" },
  { level: 15, emoji: "🌟", name: "Étoile" },
  { level: 20, emoji: "💎", name: "Diamant" }
];

export const UNLOCKABLE_TITLES = [
  { level: 1, title: "Débutant" },
  { level: 5, title: "Expert" },
  { level: 8, title: "Champion" },
  { level: 12, title: "Légende" },
  { level: 15, title: "Maître" },
  { level: 20, title: "Divinité" }
];

export const UNLOCKABLE_BADGES = [
  { level: 1, badge: "🎲", title: "Joueur" },
  { level: 5, badge: "🎯", title: "Précis" },
  { level: 8, badge: "🏆", title: "Champion" },
  { level: 12, badge: "🔥", title: "En feu" },
  { level: 15, badge: "💫", title: "Légende" },
  { level: 20, badge: "👑", title: "Maître" },
  { level: 25, badge: "💎", title: "Diamant" }
];

export const UNLOCKABLE_THEMES = [
  { level: 1, theme: "light", name: "Thème Clair" },
  { level: 10, theme: "dark", name: "Thème Sombre" },
  { level: 15, theme: "neon", name: "Thème Néon" },
  { level: 20, theme: "retro", name: "Thème Rétro" },
  { level: 25, theme: "premium", name: "Thème Premium Gold" }
];

export const AI_OPPONENTS = [
  {
    difficulty: "easy" as const,
    name: "IA Débutant",
    avatar: "🤖",
    color: "#50C878",
    description: "Apprends les bases",
    personality: "Fait des erreurs souvent et prend des décisions basiques",
    stars: 2,
    winRate: 90,
    locked: false
  },
  {
    difficulty: "normal" as const,
    name: "IA Normal",
    avatar: "🤖",
    color: "#FFD93D",
    description: "Challenge équilibré",
    personality: "Joue correctement avec quelques erreurs tactiques",
    stars: 3,
    winRate: 60,
    locked: false
  },
  {
    difficulty: "hard" as const,
    name: "IA Difficile",
    avatar: "🤖",
    color: "#FF6B6B",
    description: "Pour les pros",
    personality: "Stratégie quasi-optimale, très difficile à battre",
    stars: 5,
    winRate: 30,
    locked: true,
    unlockCondition: "Gagne 5 parties consécutives contre IA Normal"
  }
];

export const getXPForLevel = (level: number): number => {
  return Math.floor(100 * Math.pow(1.5, level - 1));
};
