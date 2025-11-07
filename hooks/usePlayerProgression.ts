import { useCallback } from "react";
import { Player } from "../types/player";
import { PlayerService } from "../services/playerService";
import { XP_REWARDS, UNLOCKABLE_COLORS, UNLOCKABLE_AVATARS, UNLOCKABLE_TITLES } from "../constants/playerConstants";

interface ProgressionState {
  newUnlocks: string[];
  achievement?: string;
}

export const usePlayerProgression = () => {
  const awardXP = useCallback(
    (player: Player, xpType: keyof typeof XP_REWARDS): { player: Player; state: ProgressionState } => {
      const xpAmount = XP_REWARDS[xpType];
      const { player: updatedPlayer, leveledUp } = PlayerService.addXP(player, xpAmount);

      const state: ProgressionState = { newUnlocks: [] };

      if (leveledUp) {
        // Vérifier nouveaux unlocks
        state.newUnlocks = [
          ...UNLOCKABLE_COLORS
            .filter(c => c.level === updatedPlayer.level)
            .map(c => c.color),
          ...UNLOCKABLE_AVATARS
            .filter(a => a.level === updatedPlayer.level)
            .map(a => a.emoji),
          ...UNLOCKABLE_TITLES
            .filter(t => t.level === updatedPlayer.level)
            .map(t => t.title)
        ];
      }

      return { player: updatedPlayer, state };
    },
    []
  );

  const completeGame = useCallback(
    (
      player: Player,
      finalScore: number,
      position: number,
      bonusEarned: boolean,
      yamsCount: number
    ): { player: Player; state: ProgressionState } => {
      let updatedPlayer = PlayerService.updateStatsAfterGame(
        player,
        finalScore,
        position === 1,
        bonusEarned,
        yamsCount
      );

      // Ajouter XP
      const xpType = position === 1 ? "winGame" : "playGame";
      const result = awardXP(
        updatedPlayer,
        xpType
      );

      return { player: result.player, state: result.state };
    },
    [awardXP]
  );

  return {
    awardXP,
    completeGame
  };
};
