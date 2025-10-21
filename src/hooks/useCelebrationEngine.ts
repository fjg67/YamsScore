/**
 * Hook pour détecter les milestones et déclencher les célébrations appropriées
 * Version simplifiée compatible avec la structure Redux actuelle
 */

import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Milestone, ToastNotification, MilestoneType } from '../types/celebration.types';
import { CELEBRATION_CONFIGS } from '../constants/celebrations';
import { SoundManager } from '../services/SoundManager';
import { useHaptic } from '../hooks/useHaptic';
import { Player, PlayerScore, ScoreCategory } from '../types';

interface CelebrationQueue {
  milestones: Milestone[];
  toasts: ToastNotification[];
}

export const useCelebrationEngine = () => {
  const currentGame = useSelector((state: RootState) => state.game.currentGame);
  const celebrationLevel = useSelector((state: RootState) => state.settings.celebrationLevel);
  const { success: hapticSuccess, error: hapticError } = useHaptic();

  const [currentMilestone, setCurrentMilestone] = useState<Milestone | null>(null);
  const [currentToast, setCurrentToast] = useState<ToastNotification | null>(null);
  const [queue, setQueue] = useState<CelebrationQueue>({ milestones: [], toasts: [] });

  // Track previous scores to detect changes
  const prevScoresRef = useRef<PlayerScore[]>([]);
  const prevLeaderRef = useRef<string | null>(null);
  const prevPositionsRef = useRef<Map<string, number>>(new Map());
  const milestonesTriggeredRef = useRef<Set<string>>(new Set());

  // Detect milestones when scores change
  useEffect(() => {
    if (!currentGame || currentGame.status !== 'in_progress') {
      // Reset on new game
      milestonesTriggeredRef.current.clear();
      prevScoresRef.current = [];
      prevLeaderRef.current = null;
      prevPositionsRef.current.clear();
      return;
    }

    const newMilestones = detectMilestones();

    if (newMilestones.length > 0) {
      // Filtrer les célébrations en fonction du niveau
      let filteredMilestones = newMilestones;

      if (celebrationLevel === 'minimal') {
        // En mode minimal, on garde seulement les milestones majeures (YAMS)
        filteredMilestones = newMilestones.filter(m => m.type === 'yams');
      } else if (celebrationLevel === 'normal') {
        // En mode normal, on garde les milestones importantes (YAMS, bonus, comeback)
        filteredMilestones = newMilestones.filter(m =>
          m.type === 'yams' || m.type === 'bonus' || m.type === 'comeback'
        );
      }
      // En mode 'epic', on garde toutes les célébrations

      // Sort by priority (highest first)
      filteredMilestones.sort((a, b) => b.config.priority - a.config.priority);

      // Separate full-screen milestones from toasts
      const fullScreenMilestones = filteredMilestones.filter(m => m.config.fullScreen);
      const toastMilestones = filteredMilestones.filter(m => !m.config.fullScreen);

      setQueue(prev => ({
        milestones: [...prev.milestones, ...fullScreenMilestones],
        toasts: [...prev.toasts, ...toastMilestones.map(m => ({
          id: m.id,
          type: 'achievement' as const,
          message: m.config.subtitle ? `${m.config.title} - ${m.config.subtitle}` : m.config.title,
          emoji: m.config.emoji,
          duration: m.config.duration,
        }))],
      }));
    }

    // Update previous state
    prevScoresRef.current = [...currentGame.scores];

  }, [currentGame?.scores]);

  // Process milestone queue
  useEffect(() => {
    if (!currentMilestone && queue.milestones.length > 0) {
      const nextMilestone = queue.milestones[0];
      setCurrentMilestone(nextMilestone);
      setQueue(prev => ({ ...prev, milestones: prev.milestones.slice(1) }));

      // Trigger sound and haptic
      if (nextMilestone.config.sound) {
        SoundManager.play(nextMilestone.config.sound);
      }
      if (nextMilestone.config.haptic) {
        if (nextMilestone.config.haptic === 'success' || nextMilestone.config.haptic === 'heavy') {
          hapticSuccess();
        }
      }
    }
  }, [currentMilestone, queue.milestones, hapticSuccess]);

  // Process toast queue
  useEffect(() => {
    if (!currentToast && queue.toasts.length > 0) {
      const nextToast = queue.toasts[0];
      setCurrentToast(nextToast);
      setQueue(prev => ({ ...prev, toasts: prev.toasts.slice(1) }));
    }
  }, [currentToast, queue.toasts]);

  const detectMilestones = (): Milestone[] => {
    if (!currentGame) return [];

    const milestones: Milestone[] = [];

    // Check each player's scores for milestones
    currentGame.scores.forEach((playerScore: PlayerScore, index: number) => {
      const prevPlayerScore = prevScoresRef.current[index];
      if (!prevPlayerScore) return;

      const playerId = playerScore.playerId;
      const player = currentGame.players.find(p => p.id === playerId);
      if (!player) return;

      // Check category-specific milestones
      const categories: ScoreCategory[] = [
        'ones', 'twos', 'threes', 'fours', 'fives', 'sixes',
        'threeOfKind', 'fourOfKind', 'fullHouse', 'smallStraight',
        'largeStraight', 'yams', 'chance'
      ];

      categories.forEach(category => {
        const currentValue = playerScore[category];
        const prevValue = prevPlayerScore[category];

        if (currentValue !== undefined && currentValue !== prevValue) {
          const milestoneId = `${playerId}-${category}-${Date.now()}`;

          // Skip if already triggered
          if (milestonesTriggeredRef.current.has(milestoneId)) {
            return;
          }

          // YAMS (50 points)
          if (category === 'yams' && currentValue === 50) {
            milestones.push(createMilestone('yams', playerId, player.name, milestoneId));
          }

          // Large Straight (40 points)
          if (category === 'largeStraight' && currentValue === 40) {
            milestones.push(createMilestone('largeStraight', playerId, player.name, milestoneId));
          }

          // Full House (25 points)
          if (category === 'fullHouse' && currentValue === 25) {
            milestones.push(createMilestone('fullHouse', playerId, player.name, milestoneId));
          }
        }
      });

      // Check bonus milestone
      if (playerScore.upperBonus > 0 && prevPlayerScore.upperBonus === 0) {
        const bonusMilestoneId = `${playerId}-bonus-${Date.now()}`;
        milestones.push(createMilestone('bonus', playerId, player.name, bonusMilestoneId));
      }
    });

    // Check for comeback (last place to first place)
    const comebackMilestone = detectComeback();
    if (comebackMilestone) {
      milestones.push(comebackMilestone);
    }

    // Mark as triggered
    milestones.forEach(m => milestonesTriggeredRef.current.add(m.id));

    return milestones;
  };

  const detectComeback = (): Milestone | null => {
    if (!currentGame || currentGame.scores.length < 2) return null;

    // Calculate current positions (1 = first, 2 = second, etc.)
    const currentRankings = currentGame.scores
      .map((score, index) => ({
        playerId: score.playerId,
        playerName: currentGame.players.find(p => p.id === score.playerId)?.name || 'Joueur',
        total: score.grandTotal,
        index,
      }))
      .sort((a, b) => b.total - a.total) // Sort by total descending
      .map((player, position) => ({
        ...player,
        position: position + 1, // Position 1-based
      }));

    // Check each player
    for (const current of currentRankings) {
      const prevPosition = prevPositionsRef.current.get(current.playerId);

      // Comeback = was in last place, now in first place
      const wasLast = prevPosition === currentGame.scores.length;
      const nowFirst = current.position === 1;

      if (prevPosition && wasLast && nowFirst) {
        const comebackId = `comeback-${current.playerId}-${Date.now()}`;

        // Skip if already triggered
        if (milestonesTriggeredRef.current.has(comebackId)) {
          continue;
        }

        // Update positions before returning
        currentRankings.forEach(ranking => {
          prevPositionsRef.current.set(ranking.playerId, ranking.position);
        });

        return createMilestone('comeback', current.playerId, current.playerName, comebackId);
      }
    }

    // Update positions for next check
    currentRankings.forEach(ranking => {
      prevPositionsRef.current.set(ranking.playerId, ranking.position);
    });

    return null;
  };

  const createMilestone = (
    type: MilestoneType,
    playerId: string,
    playerName: string,
    id: string
  ): Milestone => {
    const config = CELEBRATION_CONFIGS[type];

    return {
      id,
      type,
      config,
      playerId,
      playerName,
      timestamp: Date.now(),
    };
  };

  const dismissMilestone = () => {
    setCurrentMilestone(null);
  };

  const dismissToast = () => {
    setCurrentToast(null);
  };

  return {
    currentMilestone,
    currentToast,
    dismissMilestone,
    dismissToast,
    queueSize: queue.milestones.length + queue.toasts.length,
  };
};
