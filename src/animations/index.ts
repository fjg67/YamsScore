/**
 * Animation System - Main Export
 * Point d'entrée principal du système d'animations
 */

// Types
export * from './types';

// Hooks
export { useScoreAnimation } from './hooks/useScoreAnimation';

// Components
export { default as ParticleSystem, particleSystemRef } from './components/ParticleSystem';

// Configs
export { getAnimationConfig } from './configs';

// Utils
export { playSound, preloadAllSounds } from './utils/soundManager';
export { playHaptic, playSuccessHaptic, playErrorHaptic } from './utils/hapticManager';
