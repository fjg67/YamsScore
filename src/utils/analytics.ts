/**
 * Analytics - Tracking des événements pour A/B testing
 * Permet de mesurer l'impact des variations
 */

export enum AnalyticsEvent {
  // Welcome screen
  WELCOME_VIEWED = 'welcome_viewed',
  CTA_CLICKED = 'cta_clicked',
  QUICK_ACTION_CLICKED = 'quick_action_clicked',
  MASCOT_TAPPED = 'mascot_tapped',

  // Gamification
  STREAK_ACHIEVED = 'streak_achieved',
  ACHIEVEMENT_UNLOCKED = 'achievement_unlocked',
  EASTER_EGG_FOUND = 'easter_egg_found',

  // User actions
  GAME_STARTED = 'game_started',
  GAME_COMPLETED = 'game_completed',
  SCORE_SHARED = 'score_shared',

  // Settings
  THEME_CHANGED = 'theme_changed',
  SOUND_TOGGLED = 'sound_toggled',

  // Engagement
  SESSION_STARTED = 'session_started',
  SESSION_ENDED = 'session_ended',
}

export interface AnalyticsProperties {
  [key: string]: string | number | boolean;
}

class AnalyticsManager {
  private static instance: AnalyticsManager;
  private events: Array<{ event: string; properties?: AnalyticsProperties; timestamp: string }> = [];

  private constructor() {}

  static getInstance(): AnalyticsManager {
    if (!AnalyticsManager.instance) {
      AnalyticsManager.instance = new AnalyticsManager();
    }
    return AnalyticsManager.instance;
  }

  /**
   * Track un événement
   */
  track(event: AnalyticsEvent, properties?: AnalyticsProperties): void {
    const eventData = {
      event,
      properties,
      timestamp: new Date().toISOString(),
    };

    this.events.push(eventData);

    if (__DEV__) {
      console.log('📊 Analytics:', event, properties);
    }

    // TODO: Envoyer à un service d'analytics (Firebase, Amplitude, etc.)
  }

  /**
   * Track une conversion (CTA clické)
   */
  trackConversion(ctaName: string, variant?: string): void {
    this.track(AnalyticsEvent.CTA_CLICKED, {
      cta_name: ctaName,
      variant: variant || 'default',
    });
  }

  /**
   * Track une vue de page
   */
  trackPageView(pageName: string, variant?: string): void {
    this.track(AnalyticsEvent.WELCOME_VIEWED, {
      page_name: pageName,
      variant: variant || 'default',
    });
  }

  /**
   * Track un achievement
   */
  trackAchievement(achievementId: string): void {
    this.track(AnalyticsEvent.ACHIEVEMENT_UNLOCKED, {
      achievement_id: achievementId,
    });
  }

  /**
   * Track un streak
   */
  trackStreak(days: number): void {
    this.track(AnalyticsEvent.STREAK_ACHIEVED, {
      days,
    });
  }

  /**
   * Track un easter egg
   */
  trackEasterEgg(eggType: string): void {
    this.track(AnalyticsEvent.EASTER_EGG_FOUND, {
      egg_type: eggType,
    });
  }

  /**
   * Récupère les événements trackés (pour debug)
   */
  getEvents(): Array<{ event: string; properties?: AnalyticsProperties; timestamp: string }> {
    return this.events;
  }

  /**
   * Nettoie les événements
   */
  clearEvents(): void {
    this.events = [];
  }
}

export const analytics = AnalyticsManager.getInstance();
