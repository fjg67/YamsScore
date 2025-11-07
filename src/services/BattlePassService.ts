import { BattlePass, BattlePassTier, Reward } from '../types/progression';

export class BattlePassService {
  /**
   * Génère un Battle Pass complet avec 50 paliers
   */
  static generateBattlePass(season: number, isPremium: boolean = false): BattlePass {
    const now = new Date();
    const endDate = new Date(now);
    endDate.setDate(now.getDate() + 90); // 90 jours de saison

    return {
      season,
      name: `Saison ${season}`,
      description: `Battle Pass de la Saison ${season} - 50 paliers de récompenses`,
      startDate: now,
      endDate,
      currentTier: 0,
      currentXP: 0,
      maxTier: 50,
      isPremium,
      tiers: this.generateTiers(),
    };
  }

  /**
   * Génère les 50 paliers avec récompenses
   */
  private static generateTiers(): BattlePassTier[] {
    const tiers: BattlePassTier[] = [];

    for (let i = 1; i <= 50; i++) {
      // XP requis augmente progressivement
      // Formule: 1000 + (tier * 100)
      const xpRequired = 1000 + i * 100;

      const freeRewards = this.getFreeRewardsForTier(i);
      const premiumRewards = this.getPremiumRewardsForTier(i);

      tiers.push({
        tier: i,
        xpRequired,
        freeRewards,
        premiumRewards,
      });
    }

    return tiers;
  }

  /**
   * Récompenses gratuites par palier
   */
  private static getFreeRewardsForTier(tier: number): Reward[] {
    const rewards: Reward[] = [];

    // Tous les 5 niveaux: XP Boost temporaire
    if (tier % 5 === 0) {
      rewards.push({
        type: 'xp_boost',
        id: `xp_boost_${tier}`,
        name: 'XP Boost 1h',
        description: '+50% XP pendant 1 heure',
        icon: '⚡',
        rarity: 'common',
      });
    }

    // Tous les 10 niveaux: Coins
    if (tier % 10 === 0) {
      rewards.push({
        type: 'coins',
        id: `coins_${tier}`,
        name: `${tier * 100} Coins`,
        description: `Obtenez ${tier * 100} coins`,
        icon: '💰',
        rarity: tier >= 30 ? 'rare' : 'common',
      });
    }

    // Palier 25: Emote gratuit
    if (tier === 25) {
      rewards.push({
        type: 'emote',
        id: 'emote_thumbs_up',
        name: 'Pouce en l\'air',
        description: 'Emote Pouce en l\'air',
        icon: '👍',
        rarity: 'rare',
      });
    }

    // Palier 50: Gros bonus
    if (tier === 50) {
      rewards.push(
        {
          type: 'coins',
          id: 'coins_final',
          name: '10000 Coins',
          description: 'Récompense finale!',
          icon: '💎',
          rarity: 'legendary',
        },
        {
          type: 'title',
          id: 'title_season_complete',
          name: `Champion S${Math.ceil(tier / 50)}`,
          description: 'Titre de champion de saison',
          icon: '🏆',
          rarity: 'epic',
        }
      );
    }

    return rewards;
  }

  /**
   * Récompenses premium par palier
   */
  private static getPremiumRewardsForTier(tier: number): Reward[] {
    const rewards: Reward[] = [];

    // Tous les niveaux: Coins bonus
    if (tier % 3 === 0) {
      rewards.push({
        type: 'coins',
        id: `premium_coins_${tier}`,
        name: `${tier * 150} Coins Premium`,
        description: `Bonus premium: ${tier * 150} coins`,
        icon: '💎',
        rarity: tier >= 40 ? 'epic' : tier >= 20 ? 'rare' : 'common',
      });
    }

    // Skins de dés
    if (tier === 5) {
      rewards.push({
        type: 'dice_skin',
        id: 'dice_skin_blue',
        name: 'Dés Bleus',
        description: 'Skin de dés bleus',
        icon: '🎲',
        rarity: 'rare',
      });
    }

    if (tier === 10) {
      rewards.push({
        type: 'dice_skin',
        id: 'dice_skin_red',
        name: 'Dés Rouges',
        description: 'Skin de dés rouges',
        icon: '🎲',
        rarity: 'rare',
      });
    }

    if (tier === 15) {
      rewards.push({
        type: 'dice_skin',
        id: 'dice_skin_gold',
        name: 'Dés Dorés',
        description: 'Skin de dés dorés premium',
        icon: '🎲',
        rarity: 'epic',
      });
    }

    // Backgrounds
    if (tier === 8) {
      rewards.push({
        type: 'background',
        id: 'bg_forest',
        name: 'Fond Forêt',
        description: 'Background thème forêt',
        icon: '🌲',
        rarity: 'rare',
      });
    }

    if (tier === 18) {
      rewards.push({
        type: 'background',
        id: 'bg_ocean',
        name: 'Fond Océan',
        description: 'Background thème océan',
        icon: '🌊',
        rarity: 'rare',
      });
    }

    if (tier === 28) {
      rewards.push({
        type: 'background',
        id: 'bg_space',
        name: 'Fond Espace',
        description: 'Background thème spatial',
        icon: '🌌',
        rarity: 'epic',
      });
    }

    // Emotes premium
    if (tier === 12) {
      rewards.push({
        type: 'emote',
        id: 'emote_fire',
        name: 'Feu',
        description: 'Emote Feu',
        icon: '🔥',
        rarity: 'rare',
      });
    }

    if (tier === 22) {
      rewards.push({
        type: 'emote',
        id: 'emote_crown',
        name: 'Couronne',
        description: 'Emote Couronne',
        icon: '👑',
        rarity: 'epic',
      });
    }

    if (tier === 32) {
      rewards.push({
        type: 'emote',
        id: 'emote_diamond',
        name: 'Diamant',
        description: 'Emote Diamant',
        icon: '💎',
        rarity: 'epic',
      });
    }

    // Titres premium
    if (tier === 20) {
      rewards.push({
        type: 'title',
        id: 'title_elite',
        name: 'Elite',
        description: 'Titre Elite',
        icon: '⭐',
        rarity: 'epic',
      });
    }

    if (tier === 30) {
      rewards.push({
        type: 'title',
        id: 'title_legend',
        name: 'Légende',
        description: 'Titre Légende',
        icon: '🌟',
        rarity: 'epic',
      });
    }

    if (tier === 40) {
      rewards.push({
        type: 'title',
        id: 'title_mythic',
        name: 'Mythique',
        description: 'Titre Mythique',
        icon: '💫',
        rarity: 'legendary',
      });
    }

    // Borders premium
    if (tier === 25) {
      rewards.push({
        type: 'border',
        id: 'border_gold',
        name: 'Bordure Dorée',
        description: 'Bordure de profil dorée',
        icon: '🖼️',
        rarity: 'epic',
      });
    }

    if (tier === 35) {
      rewards.push({
        type: 'border',
        id: 'border_diamond',
        name: 'Bordure Diamant',
        description: 'Bordure de profil diamant',
        icon: '🖼️',
        rarity: 'legendary',
      });
    }

    // XP Boosts premium plus puissants
    if (tier === 7 || tier === 17 || tier === 27 || tier === 37 || tier === 47) {
      rewards.push({
        type: 'xp_boost',
        id: `premium_xp_boost_${tier}`,
        name: 'XP Boost Premium 24h',
        description: '+100% XP pendant 24 heures',
        icon: '⚡',
        rarity: 'epic',
      });
    }

    // Palier 50: Récompense ultime premium
    if (tier === 50) {
      rewards.push(
        {
          type: 'dice_skin',
          id: 'dice_skin_rainbow',
          name: 'Dés Arc-en-ciel',
          description: 'Skin de dés arc-en-ciel légendaire',
          icon: '🎲',
          rarity: 'legendary',
        },
        {
          type: 'border',
          id: 'border_ultimate',
          name: 'Bordure Ultime',
          description: 'Bordure animée exclusive',
          icon: '🖼️',
          rarity: 'legendary',
        },
        {
          type: 'title',
          id: 'title_ultimate_champion',
          name: 'Champion Ultime',
          description: 'Titre de champion ultime',
          icon: '👑',
          rarity: 'legendary',
        },
        {
          type: 'coins',
          id: 'coins_ultimate',
          name: '50000 Coins',
          description: 'Récompense ultime premium',
          icon: '💎',
          rarity: 'legendary',
        }
      );
    }

    return rewards;
  }

  /**
   * Ajoute de l'XP au Battle Pass
   */
  static addBattlePassXP(
    battlePass: BattlePass,
    xp: number
  ): {
    battlePass: BattlePass;
    tiersUnlocked: number[];
    rewards: Reward[];
  } {
    const tiersUnlocked: number[] = [];
    const rewards: Reward[] = [];

    let remainingXP = battlePass.currentXP + xp;
    let currentTier = battlePass.currentTier;

    // Monter de niveau
    while (currentTier < battlePass.maxTier) {
      const nextTier = battlePass.tiers[currentTier];
      if (!nextTier || remainingXP < nextTier.xpRequired) break;

      remainingXP -= nextTier.xpRequired;
      currentTier++;
      tiersUnlocked.push(currentTier);

      // Collecter récompenses
      const tier = battlePass.tiers[currentTier - 1];
      rewards.push(...tier.freeRewards);
      if (battlePass.isPremium) {
        rewards.push(...tier.premiumRewards);
      }
    }

    return {
      battlePass: {
        ...battlePass,
        currentTier,
        currentXP: remainingXP,
      },
      tiersUnlocked,
      rewards,
    };
  }

  /**
   * Vérifie si le Battle Pass est expiré
   */
  static isBattlePassExpired(battlePass: BattlePass): boolean {
    return new Date() > new Date(battlePass.endDate);
  }

  /**
   * Calcule le temps restant
   */
  static getTimeRemaining(battlePass: BattlePass): {
    days: number;
    hours: number;
    minutes: number;
  } {
    const now = new Date();
    const end = new Date(battlePass.endDate);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0 };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return { days, hours, minutes };
  }

  /**
   * Active le Battle Pass Premium
   */
  static activatePremium(battlePass: BattlePass): {
    battlePass: BattlePass;
    retroactiveRewards: Reward[];
  } {
    // Collecter toutes les récompenses premium rétroactives
    const retroactiveRewards: Reward[] = [];

    for (let i = 0; i < battlePass.currentTier; i++) {
      const tier = battlePass.tiers[i];
      retroactiveRewards.push(...tier.premiumRewards);
    }

    return {
      battlePass: {
        ...battlePass,
        isPremium: true,
      },
      retroactiveRewards,
    };
  }

  /**
   * Calcule le pourcentage de progression
   */
  static getProgressPercentage(battlePass: BattlePass): number {
    return (battlePass.currentTier / battlePass.maxTier) * 100;
  }

  /**
   * Récupère le prochain palier et XP restant
   */
  static getNextTierInfo(battlePass: BattlePass): {
    nextTier: number;
    xpNeeded: number;
    xpCurrent: number;
    rewards: Reward[];
  } | null {
    if (battlePass.currentTier >= battlePass.maxTier) {
      return null;
    }

    const nextTierData = battlePass.tiers[battlePass.currentTier];

    return {
      nextTier: battlePass.currentTier + 1,
      xpNeeded: nextTierData.xpRequired,
      xpCurrent: battlePass.currentXP,
      rewards: [
        ...nextTierData.freeRewards,
        ...(battlePass.isPremium ? nextTierData.premiumRewards : []),
      ],
    };
  }
}
