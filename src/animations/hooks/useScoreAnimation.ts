/**
 * useScoreAnimation Hook
 * Hook principal pour jouer les animations de score
 */

import { useCallback, useRef, useState } from 'react';
import { Animated } from 'react-native';
import { ScoreAnimationParams, ScoreAnimationConfig } from '../types';
import { getAnimationConfig } from '../configs';
import { playSound } from '../utils/soundManager';
import { playHaptic } from '../utils/hapticManager';
import { particleSystemRef } from '../components/ParticleSystem';
import { screenFlashRef } from '../components/ScreenFlash';
import { animatedMessageRef } from '../components/AnimatedMessage';
import { glowEffectRef } from '../components/GlowEffect';

export const useScoreAnimation = () => {
  const [celebrationModal, setCelebrationModal] = useState<{
    visible: boolean;
    config: any;
  } | null>(null);

  /**
   * Anime une cellule selon la configuration
   */
  const animateCell = useCallback(
    async (cellRef: any, config: ScoreAnimationConfig['cell']): Promise<void> => {
      if (!cellRef || !config) return;

      const animations: Animated.CompositeAnimation[] = [];

      // Scale animation
      if (config.scale) {
        const scaleAnim = new Animated.Value(config.scale[0]);
        cellRef.setNativeProps({ transform: [{ scale: scaleAnim }] });

        animations.push(
          Animated.timing(scaleAnim, {
            toValue: config.scale[config.scale.length - 1],
            duration: config.duration,
            useNativeDriver: true,
          })
        );
      }

      // Rotate animation
      if (config.rotate) {
        const rotateAnim = new Animated.Value(config.rotate[0]);
        animations.push(
          Animated.timing(rotateAnim, {
            toValue: config.rotate[config.rotate.length - 1],
            duration: config.duration,
            useNativeDriver: true,
          })
        );
      }

      // Opacity animation
      if (config.opacity) {
        const opacityAnim = new Animated.Value(config.opacity[0]);
        animations.push(
          Animated.timing(opacityAnim, {
            toValue: config.opacity[config.opacity.length - 1],
            duration: config.duration,
            useNativeDriver: true,
          })
        );
      }

      // Exécuter toutes les animations en parallèle
      if (animations.length > 0) {
        await new Promise<void>((resolve) => {
          Animated.parallel(animations).start(() => resolve());
        });
      }
    },
    []
  );

  /**
   * Joue l'animation complète pour un score
   */
  const playScoreAnimation = useCallback(
    async ({
      category,
      score,
      playerColor,
      cellRef,
      context = {},
    }: ScoreAnimationParams): Promise<void> => {
      // Animation spéciale pour BARRÉ
      if (context.isCrossed) {
        console.log('🎬 Animation BARRÉ ultra premium');

        // Vibration courte et sèche
        if (playHaptic) {
          playHaptic({ type: 'medium', pattern: [50, 30, 50] }).catch(() => {});
        }

        // Particules rouges/grises
        if (particleSystemRef.current) {
          particleSystemRef.current.emit(
            {
              type: 'circle',
              count: 30,
              colors: ['#FF6B6B', '#999999', '#666666'],
              size: 8,
              spread: 120,
              velocity: 18,
              gravity: 0.6,
              duration: 1200,
            },
            200,
            300
          );
        }

        // Message "BARRÉ"
        if (animatedMessageRef.current) {
          animatedMessageRef.current.show(
            {
              text: '❌ BARRÉ',
              fontSize: 28,
              color: '#FF6B6B',
              position: 'above',
              animation: {
                scale: [0, 1.3, 1.0],
                opacity: [0, 1, 1, 0],
                translateY: [-30, -60],
                duration: 1500,
              },
            },
            200,
            300
          );
        }

        return;
      }

      // 1. Récupérer la configuration d'animation
      const config = getAnimationConfig(category, score, context);

      if (!config) {
        console.warn(`Aucune animation trouvée pour ${category} - ${score}`);
        return;
      }

      console.log(`🎬 Animation: ${config.name} (${config.intensity})`);

      // 2. Jouer le son (non bloquant - IMMÉDIAT)
      if (config.sound) {
        playSound(config.sound).catch((err) =>
          console.error('Erreur son:', err)
        );
      }

      // 3. Vibration haptique (non bloquant - IMMÉDIAT)
      if (config.haptic) {
        playHaptic(config.haptic).catch((err) =>
          console.error('Erreur haptic:', err)
        );
      }

      // 4. LANCER TOUS LES EFFETS EN PARALLÈLE IMMÉDIATEMENT
      // Ne pas attendre l'animation de cellule pour commencer les autres effets!

      // 4a. Animation de la cellule (en arrière-plan, non bloquante)
      if (config.cell && cellRef) {
        animateCell(cellRef, config.cell); // Pas de await!
      }

      // 4b. Émettre les particules (IMMÉDIAT)
      if (config.particles && particleSystemRef.current) {
        particleSystemRef.current.emit(
          config.particles,
          200, // X position (à calculer depuis la cellule)
          300 // Y position (à calculer depuis la cellule)
        );
      }

      // 4c. Émettre le confetti (IMMÉDIAT)
      if (config.confetti && particleSystemRef.current) {
        particleSystemRef.current.emitConfetti(config.confetti);
      }

      // 4d. Flash écran (IMMÉDIAT)
      if (config.flash && screenFlashRef.current) {
        screenFlashRef.current.flash(config.flash);
      }

      // 4e. Glow effect (IMMÉDIAT)
      if (config.glow && glowEffectRef.current) {
        glowEffectRef.current.glow(config.glow, 200, 300);
      }

      // 4f. Message popup (IMMÉDIAT)
      if (config.message && animatedMessageRef.current) {
        animatedMessageRef.current.show(config.message, 200, 300);
      }

      // 4g. Modal de célébration (IMMÉDIAT)
      if (config.modal) {
        // Le modal sera affiché via le state - IMMÉDIATEMENT
        setCelebrationModal({ visible: true, config: config.modal });

        // Auto-fermer après la durée configurée
        if (config.modal.duration) {
          setTimeout(() => {
            setCelebrationModal(null);
          }, config.modal.duration);
        }
      }

      console.log(`✅ Animation ${config.name} terminée`);
    },
    [animateCell]
  );

  return {
    playScoreAnimation,
    celebrationModal,
    closeCelebrationModal: () => setCelebrationModal(null),
  };
};
