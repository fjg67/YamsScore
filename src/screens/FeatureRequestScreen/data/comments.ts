/**
 * Données pour les commentaires (mock)
 */

import { User } from './suggestions';

export interface Reaction {
  emoji: string;
  count: number;
  userReacted: boolean;
}

export interface Comment {
  id: string;
  author: User;
  content: string;
  createdAt: Date;
  reactions: Reaction[];
  replies?: Comment[];
  isOfficialResponse?: boolean;
}

// Mock comments pour les suggestions
export const mockComments: Record<string, Comment[]> = {
  '1': [
    {
      id: 'c1',
      author: {
        id: '4',
        name: 'DarkLover',
        emoji: '🌙',
        badge: 'silver',
        level: 6,
        points: 512,
        totalSuggestions: 5,
        implementedSuggestions: 1,
      },
      content: 'Excellente idée ! J\'ajouterais aussi la possibilité de personnaliser les couleurs des néons individuellement 🎨',
      createdAt: new Date('2025-01-16T10:30:00'),
      reactions: [
        { emoji: '👍', count: 23, userReacted: false },
        { emoji: '❤️', count: 8, userReacted: false },
      ],
      replies: [
        {
          id: 'c1-r1',
          author: {
            id: '1',
            name: 'DesignGuru',
            emoji: '🎨',
            badge: 'gold',
            level: 7,
            points: 847,
            totalSuggestions: 12,
            implementedSuggestions: 3,
          },
          content: 'Très bonne idée ! Je vais ajouter ça à la suggestion 👌',
          createdAt: new Date('2025-01-16T11:00:00'),
          reactions: [
            { emoji: '👍', count: 12, userReacted: false },
          ],
        },
      ],
    },
    {
      id: 'c2',
      author: {
        id: '99',
        name: 'YamsTeam',
        emoji: '👨‍💻',
        badge: 'legend',
        level: 99,
        points: 99999,
        totalSuggestions: 0,
        implementedSuggestions: 42,
      },
      content: 'Nous adorons cette idée ! Elle s\'aligne parfaitement avec notre vision d\'une interface moderne et futuriste. En cours d\'étude approfondie avec notre équipe design.',
      createdAt: new Date('2025-01-16T14:00:00'),
      reactions: [
        { emoji: '👍', count: 45, userReacted: true },
        { emoji: '🎉', count: 23, userReacted: false },
        { emoji: '❤️', count: 18, userReacted: false },
      ],
      isOfficialResponse: true,
    },
  ],
  '2': [
    {
      id: 'c3',
      author: {
        id: '5',
        name: 'ARFanatic',
        emoji: '🥽',
        badge: 'gold',
        level: 8,
        points: 923,
        totalSuggestions: 15,
        implementedSuggestions: 4,
      },
      content: 'J\'ai hâte de voir ça ! La réalité augmentée va révolutionner l\'expérience du Yams 🎲✨',
      createdAt: new Date('2025-01-12T09:00:00'),
      reactions: [
        { emoji: '👍', count: 34, userReacted: false },
        { emoji: '🔥', count: 12, userReacted: false },
      ],
    },
    {
      id: 'c4',
      author: {
        id: '99',
        name: 'YamsTeam',
        emoji: '👨‍💻',
        badge: 'legend',
        level: 99,
        points: 99999,
        totalSuggestions: 0,
        implementedSuggestions: 42,
      },
      content: 'En développement ! 🚀 La physique des dés est presque terminée. Les dés roulent de manière ultra réaliste avec collision detection et gravité réaliste.',
      createdAt: new Date('2025-01-19T16:30:00'),
      reactions: [
        { emoji: '👍', count: 67, userReacted: false },
        { emoji: '🎉', count: 28, userReacted: false },
        { emoji: '🔥', count: 19, userReacted: false },
      ],
      isOfficialResponse: true,
    },
  ],
};

// Fonction pour obtenir les commentaires d'une suggestion
export const getCommentsBySuggestionId = (suggestionId: string): Comment[] => {
  return mockComments[suggestionId] || [];
};

// Fonction pour compter le nombre total de commentaires (avec réponses)
export const getTotalCommentCount = (comments: Comment[]): number => {
  let count = comments.length;
  comments.forEach(comment => {
    if (comment.replies) {
      count += comment.replies.length;
    }
  });
  return count;
};
