/**
 * Hook pour détecter le shake du device
 * Version simplifiée pour démo
 */

import { useEffect } from 'react';
import { DeviceEventEmitter } from 'react-native';

interface UseShakeDetectionOptions {
  onShake: () => void;
}

export const useShakeDetection = ({
  onShake,
}: UseShakeDetectionOptions) => {
  useEffect(() => {
    // Pour cette démo, on utilise un event emitter personnalisé
    // Dans une vraie app, on utiliserait react-native-shake-event ou react-native-sensors
    const subscription = DeviceEventEmitter.addListener('shake', onShake);

    return () => {
      subscription.remove();
    };
  }, [onShake]);
};

// Helper pour trigger le shake manuellement (pour debug/testing)
export const triggerShake = () => {
  DeviceEventEmitter.emit('shake');
};
