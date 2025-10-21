/**
 * Hook pour générer les données de carte de partage
 * Prépare les informations pour partage sur réseaux sociaux
 */

import { useMemo } from 'react';
import { ShareCardData, GameSummary } from '../types/victory.types';

export const useShareCard = (summary: GameSummary | null): ShareCardData | null => {
  return useMemo(() => {
    if (!summary) return null;

    const formatDuration = (ms: number): string => {
      const minutes = Math.floor(ms / 60000);
      if (minutes < 1) return '< 1 minute';
      if (minutes === 1) return '1 minute';
      return `${minutes} minutes`;
    };

    const winner = summary.winner;
    const podium = summary.players.slice(0, 3);

    // Generate highlights
    const highlights: string[] = [];

    // Winner's best achievement
    if (winner.achievements.length > 0) {
      highlights.push(winner.achievements[0].title);
    }

    // Score-based highlights
    if (winner.score >= 300) {
      highlights.push('Score Légendaire !');
    } else if (winner.score >= 250) {
      highlights.push('Excellent Score !');
    }

    // Bonus highlight
    const bonusAchievers = summary.players.filter(p =>
      p.highlights.some(h => h.type === 'bonus_achieved')
    );
    if (bonusAchievers.length > 0) {
      highlights.push(`${bonusAchievers.length} Bonus débloqué${bonusAchievers.length > 1 ? 's' : ''}`);
    }

    // Yams highlights
    const yamsCount = winner.highlights.find(h => h.type === 'yams_count');
    if (yamsCount && typeof yamsCount.value === 'number' && yamsCount.value > 0) {
      highlights.push(`${yamsCount.value} Yams !`);
    }

    // Perfect scores
    const perfectCount = winner.highlights.find(h => h.type === 'perfect_scores');
    if (perfectCount && typeof perfectCount.value === 'number' && perfectCount.value > 0) {
      highlights.push(`${perfectCount.value} Score${perfectCount.value > 1 ? 's' : ''} Parfait${perfectCount.value > 1 ? 's' : ''}`);
    }

    return {
      winnerName: winner.player.name,
      winnerScore: winner.score,
      winnerAvatar: winner.player.avatar || '👤',

      podium: {
        first: {
          name: podium[0].player.name,
          score: podium[0].score,
          avatar: podium[0].player.avatar || '👤',
        },
        second: podium[1] ? {
          name: podium[1].player.name,
          score: podium[1].score,
          avatar: podium[1].player.avatar || '👤',
        } : undefined,
        third: podium[2] ? {
          name: podium[2].player.name,
          score: podium[2].score,
          avatar: podium[2].player.avatar || '👤',
        } : undefined,
      },

      gameDate: summary.completedAt,
      totalPlayers: summary.players.length,
      gameDuration: formatDuration(summary.duration),
      highlights: highlights.slice(0, 3), // Max 3 highlights

      backgroundColor: '#1a1a2e',
      accentColor: '#FFD700',
    };
  }, [summary]);
};

/**
 * Generate shareable text message
 */
export const generateShareMessage = (data: ShareCardData): string => {
  const lines: string[] = [];

  lines.push('🎲 Partie de Yams - Résultats');
  lines.push('');
  lines.push(`👑 Vainqueur: ${data.winnerName}`);
  lines.push(`🎯 Score: ${data.winnerScore} points`);
  lines.push('');

  if (data.podium.second) {
    lines.push('🏆 Podium:');
    lines.push(`🥇 ${data.podium.first.name} - ${data.podium.first.score} pts`);
    lines.push(`🥈 ${data.podium.second.name} - ${data.podium.second.score} pts`);
    if (data.podium.third) {
      lines.push(`🥉 ${data.podium.third.name} - ${data.podium.third.score} pts`);
    }
    lines.push('');
  }

  if (data.highlights.length > 0) {
    lines.push('✨ Highlights:');
    data.highlights.forEach(h => lines.push(`• ${h}`));
    lines.push('');
  }

  lines.push(`⏱️ Durée: ${data.gameDuration}`);
  lines.push('');
  lines.push('Joué avec YamsScore Premium 🎮');

  return lines.join('\n');
};
