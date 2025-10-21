/**
 * A/B Testing Hook - Pour tester différentes variations
 * Permet d'optimiser la conversion et l'engagement
 */

import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AB_TEST_KEY = '@yams_ab_tests';

export enum ABTestVariant {
  A = 'A',
  B = 'B',
}

export interface ABTest {
  id: string;
  variant: ABTestVariant;
  assignedAt: string; // ISO date
}

/**
 * Hook pour gérer les A/B tests
 */
export const useABTest = (testId: string, defaultVariant: ABTestVariant = ABTestVariant.A) => {
  const [variant, setVariant] = useState<ABTestVariant>(defaultVariant);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOrAssignVariant();
  }, [testId]);

  const loadOrAssignVariant = async () => {
    try {
      const storedTests = await AsyncStorage.getItem(AB_TEST_KEY);
      const tests: ABTest[] = storedTests ? JSON.parse(storedTests) : [];

      // Chercher si l'utilisateur a déjà une variante assignée
      const existingTest = tests.find(test => test.id === testId);

      if (existingTest) {
        setVariant(existingTest.variant);
      } else {
        // Assigner aléatoirement une variante (50/50)
        const newVariant = Math.random() < 0.5 ? ABTestVariant.A : ABTestVariant.B;

        const newTest: ABTest = {
          id: testId,
          variant: newVariant,
          assignedAt: new Date().toISOString(),
        };

        tests.push(newTest);
        await AsyncStorage.setItem(AB_TEST_KEY, JSON.stringify(tests));

        setVariant(newVariant);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error in A/B test:', error);
      setVariant(defaultVariant);
      setIsLoading(false);
    }
  };

  /**
   * Force une variante spécifique (pour testing)
   */
  const forceVariant = async (newVariant: ABTestVariant) => {
    try {
      const storedTests = await AsyncStorage.getItem(AB_TEST_KEY);
      const tests: ABTest[] = storedTests ? JSON.parse(storedTests) : [];

      const testIndex = tests.findIndex(test => test.id === testId);

      if (testIndex >= 0) {
        tests[testIndex].variant = newVariant;
      } else {
        tests.push({
          id: testId,
          variant: newVariant,
          assignedAt: new Date().toISOString(),
        });
      }

      await AsyncStorage.setItem(AB_TEST_KEY, JSON.stringify(tests));
      setVariant(newVariant);
    } catch (error) {
      console.error('Error forcing variant:', error);
    }
  };

  return {
    variant,
    isVariantA: variant === ABTestVariant.A,
    isVariantB: variant === ABTestVariant.B,
    isLoading,
    forceVariant,
  };
};

/**
 * Tests A/B disponibles
 */
export const ABTests = {
  WELCOME_CTA_TEXT: 'welcome_cta_text', // "Commencer" vs "Jouer maintenant"
  MASCOT_POSITION: 'mascot_position', // Haut vs Centre
  CARD_LAYOUT: 'card_layout', // Horizontal vs Vertical
  ONBOARDING_FLOW: 'onboarding_flow', // Simple vs Détaillé
  THEME_DEFAULT: 'theme_default', // Light vs Dark
};
