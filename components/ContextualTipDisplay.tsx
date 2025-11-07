/**
 * Contextual Tip Display Component
 * Composant pour afficher les tips contextuels pendant le jeu
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Modal,
} from 'react-native';
import { ContextualTip } from '../src/types/learning';
import { ContextualTipsService } from '../services/contextualTipsService';

interface ContextualTipDisplayProps {
  tip: ContextualTip | null;
  onDismiss: () => void;
  showLucky?: boolean;
}

export const ContextualTipDisplay: React.FC<ContextualTipDisplayProps> = ({
  tip,
  onDismiss,
  showLucky = true,
}) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (tip) {
      setVisible(true);
      // Animation d'entrée
      Animated.spring(fadeAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();

      // Auto-hide si configuré
      if (tip.autoHideAfter) {
        const timer = setTimeout(() => {
          handleDismiss();
        }, tip.autoHideAfter * 1000);

        return () => clearTimeout(timer);
      }

      // Marquer comme affiché
      if (tip.showOnce) {
        ContextualTipsService.markTipAsShown(tip.id);
      }
    } else {
      handleDismiss();
    }
  }, [tip]);

  const handleDismiss = () => {
    // Animation de sortie
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
      onDismiss();
    });
  };

  if (!visible || !tip) return null;

  // Déterminer le style selon la priorité
  const getPriorityColor = () => {
    switch (tip.priority) {
      case 'critical':
        return '#f44336';
      case 'high':
        return '#ff9800';
      case 'medium':
        return '#2563eb';
      case 'low':
        return '#8b92b0';
      default:
        return '#2563eb';
    }
  };

  const priorityColor = getPriorityColor();

  // Si c'est un tip critique, afficher en modal
  if (tip.priority === 'critical') {
    return (
      <Modal transparent visible={visible} animationType="fade">
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalContent,
              {
                opacity: fadeAnim,
                transform: [
                  {
                    scale: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            {/* Lucky mascotte */}
            {showLucky && tip.luckyDialogue && (
              <View style={styles.luckyContainer}>
                <View style={[styles.luckyMascot, { backgroundColor: priorityColor }]}>
                  <Text style={styles.luckyEmoji}>🍀</Text>
                </View>
              </View>
            )}

            {/* Message */}
            <Text style={styles.modalTitle}>{tip.message}</Text>
            <Text style={styles.modalExplanation}>{tip.explanation}</Text>

            {tip.suggestedAction && (
              <View style={styles.suggestedActionBox}>
                <Text style={styles.suggestedActionIcon}>💡</Text>
                <Text style={styles.suggestedActionText}>{tip.suggestedAction}</Text>
              </View>
            )}

            {/* Lucky dialogue */}
            {showLucky && tip.luckyDialogue && (
              <View style={styles.luckyDialogueBox}>
                <Text style={styles.luckyDialogueText}>{tip.luckyDialogue}</Text>
              </View>
            )}

            {/* Bouton de fermeture */}
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: priorityColor }]}
              onPress={handleDismiss}
            >
              <Text style={styles.modalButtonText}>Compris !</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    );
  }

  // Sinon, afficher en toast/banner
  return (
    <Animated.View
      style={[
        styles.toastContainer,
        {
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-100, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={[styles.toastContent, { borderLeftColor: priorityColor }]}>
        {/* Lucky */}
        {showLucky && tip.luckyDialogue && (
          <View style={styles.toastLucky}>
            <Text style={styles.toastLuckyEmoji}>🍀</Text>
          </View>
        )}

        {/* Contenu */}
        <View style={styles.toastTextContainer}>
          <Text style={styles.toastTitle}>{tip.message}</Text>
          {tip.explanation && (
            <Text style={styles.toastExplanation}>{tip.explanation}</Text>
          )}
          {tip.luckyDialogue && (
            <Text style={styles.toastLuckyDialogue}>{tip.luckyDialogue}</Text>
          )}
        </View>

        {/* Bouton de fermeture */}
        {tip.dismissible && (
          <TouchableOpacity style={styles.toastCloseButton} onPress={handleDismiss}>
            <Text style={styles.toastCloseText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#151a33',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  luckyContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  luckyMascot: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  luckyEmoji: {
    fontSize: 32,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalExplanation: {
    fontSize: 15,
    color: '#d1d5db',
    lineHeight: 22,
    marginBottom: 16,
    textAlign: 'center',
  },
  suggestedActionBox: {
    flexDirection: 'row',
    backgroundColor: '#1f2544',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  suggestedActionIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  suggestedActionText: {
    flex: 1,
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
  },
  luckyDialogueBox: {
    backgroundColor: '#ffd700',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  luckyDialogueText: {
    fontSize: 14,
    color: '#000',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  modalButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },

  // Toast styles
  toastContainer: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    zIndex: 1000,
  },
  toastContent: {
    flexDirection: 'row',
    backgroundColor: '#151a33',
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  toastLucky: {
    width: 40,
    height: 40,
    backgroundColor: '#ffd700',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  toastLuckyEmoji: {
    fontSize: 24,
  },
  toastTextContainer: {
    flex: 1,
  },
  toastTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  toastExplanation: {
    fontSize: 12,
    color: '#d1d5db',
    lineHeight: 16,
    marginBottom: 4,
  },
  toastLuckyDialogue: {
    fontSize: 12,
    color: '#ffd700',
    fontStyle: 'italic',
    lineHeight: 16,
  },
  toastCloseButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  toastCloseText: {
    fontSize: 18,
    color: '#8b92b0',
  },
});

/**
 * EXEMPLE D'UTILISATION DANS GAMESCREEN :
 *
 * ```typescript
 * import { ContextualTipDisplay } from '../components/ContextualTipDisplay';
 * import { ContextualTipsService } from '../services/contextualTipsService';
 *
 * const GameScreen = () => {
 *   const [currentTip, setCurrentTip] = useState<ContextualTip | null>(null);
 *
 *   // Après un lancer de dés
 *   const handleDiceRoll = async (dice: number[]) => {
 *     // ... logique de jeu
 *
 *     // Vérifier s'il y a un tip à afficher
 *     const pattern = ContextualTipsService.analyzeDicePattern(dice);
 *     if (pattern) {
 *       const tip = await ContextualTipsService.getTipForContext('dice_roll', {
 *         currentTurn: gameState.currentTurn,
 *         dicePattern: pattern,
 *       });
 *       if (tip) {
 *         setCurrentTip(tip);
 *       }
 *     }
 *   };
 *
 *   return (
 *     <View>
 *       {/* ... votre UI de jeu }
 *
 *       {/* Affichage des tips }
 *       <ContextualTipDisplay
 *         tip={currentTip}
 *         onDismiss={() => setCurrentTip(null)}
 *       />
 *     </View>
 *   );
 * };
 * ```
 */
