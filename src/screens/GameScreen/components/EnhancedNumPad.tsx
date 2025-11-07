import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { CategoryType, Player, CATEGORIES } from '../../../types/game';
import { validateScore } from '../../../utils/scoreCalculator';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Floating particles component for modal
const FloatingParticle = ({ delay = 0 }: { delay?: number }) => {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const translateX = useRef(new Animated.Value(Math.random() * SCREEN_WIDTH)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5 + Math.random() * 0.5)).current;

  useEffect(() => {
    const animate = () => {
      translateY.setValue(SCREEN_HEIGHT);
      translateX.setValue(Math.random() * SCREEN_WIDTH);
      opacity.setValue(0);

      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -100,
            duration: 8000 + Math.random() * 4000,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.15 + Math.random() * 0.15,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0.8 + Math.random() * 0.4,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => animate());
    };

    animate();
  }, [delay, translateY, translateX, opacity, scale]);

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          transform: [
            { translateX },
            { translateY },
            { scale },
          ],
          opacity,
        },
      ]}
    />
  );
};

interface EnhancedNumPadProps {
  visible: boolean;
  player: Player | null;
  category: CategoryType | null;
  onSubmit: (value: number, isCrossed: boolean) => void;
  onCancel: () => void;
}

// 📊 SCORES POSSIBLES PAR CATÉGORIE
const POSSIBLE_SCORES: Record<string, number[]> = {
  ones: [0, 1, 2, 3, 4, 5],
  twos: [0, 2, 4, 6, 8, 10],
  threes: [0, 3, 6, 9, 12, 15],
  fours: [0, 4, 8, 12, 16, 20],
  fives: [0, 5, 10, 15, 20, 25],
  sixes: [0, 6, 12, 18, 24, 30],
  threeOfKind: [15, 18, 20, 22, 24, 25, 26, 27, 28, 29, 30], // Scores fréquents
  fourOfKind: [20, 22, 24, 25, 26, 27, 28, 29, 30], // Scores fréquents
  fullHouse: [0, 25],
  smallStraight: [0, 30],
  largeStraight: [0, 40],
  yams: [0, 50],
  chance: [15, 18, 20, 22, 24, 25, 26, 27, 28, 29, 30], // Scores fréquents
};

// Catégories qui nécessitent le pavé numérique
const CATEGORIES_WITH_NUMPAD = ['threeOfKind', 'fourOfKind', 'chance'];

// Fonction pour ajuster la luminosité d'une couleur
const adjustColorBrightness = (color: string, percent: number): string => {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;
  return (
    '#' +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
};

// 🎯 RÈGLES ET EXEMPLES PAR CATÉGORIE
const CATEGORY_RULES: Record<string, any> = {
  ones: {
    rule: 'Somme de tous les dés montrant 1',
    example: '⚀ ⚀ ⚀ ⚃ ⚄ = 3 points (3×1)',
    possibleScores: '0, 1, 2, 3, 4, 5',
    tips: 'Gardez tous les 1 pour maximiser',
  },
  twos: {
    rule: 'Somme de tous les dés montrant 2',
    example: '⚁ ⚁ ⚁ ⚁ ⚄ = 8 points (4×2)',
    possibleScores: '0, 2, 4, 6, 8, 10',
    tips: 'Maximum = 10 points (5×2)',
  },
  threes: {
    rule: 'Somme de tous les dés montrant 3',
    example: '⚂ ⚂ ⚂ ⚀ ⚅ = 9 points (3×3)',
    possibleScores: '0, 3, 6, 9, 12, 15',
    tips: 'Maximum = 15 points (5×3)',
  },
  fours: {
    rule: 'Somme de tous les dés montrant 4',
    example: '⚃ ⚃ ⚃ ⚃ ⚁ = 16 points (4×4)',
    possibleScores: '0, 4, 8, 12, 16, 20',
    tips: 'Maximum = 20 points (5×4)',
  },
  fives: {
    rule: 'Somme de tous les dés montrant 5',
    example: '⚄ ⚄ ⚄ ⚄ ⚄ = 25 points (5×5)',
    possibleScores: '0, 5, 10, 15, 20, 25',
    tips: 'Catégorie la plus précieuse du haut',
  },
  sixes: {
    rule: 'Somme de tous les dés montrant 6',
    example: '⚅ ⚅ ⚅ ⚅ ⚀ = 24 points (4×6)',
    possibleScores: '0, 6, 12, 18, 24, 30',
    tips: 'Maximum = 30 points (5×6)',
  },
  threeOfKind: {
    rule: 'Au moins 3 dés identiques\nTotal de TOUS les 5 dés',
    example: '⚃ ⚃ ⚃ ⚅ ⚅ = 26 points\n(4+4+4+6+6)',
    possibleScores: '5 à 30 points',
    tips: 'Cherchez les gros chiffres (5 ou 6)',
  },
  fourOfKind: {
    rule: 'Au moins 4 dés identiques\nTotal de TOUS les 5 dés',
    example: '⚅ ⚅ ⚅ ⚅ ⚄ = 29 points\n(6+6+6+6+5)',
    possibleScores: '8 à 30 points',
    tips: 'Visez les 6 pour maximiser',
  },
  fullHouse: {
    rule: 'Un brelan + une paire\nToujours 25 points',
    example: '⚃ ⚃ ⚃ ⚁ ⚁ = 25 points',
    possibleScores: '0 ou 25',
    tips: 'Score fixe, pas de calcul',
  },
  smallStraight: {
    rule: 'Suite de 4 dés consécutifs\nToujours 30 points',
    example: '⚀ ⚁ ⚂ ⚃ ⚅ = 30 points\n(1-2-3-4 présents)',
    possibleScores: '0 ou 30',
    tips: '3 suites possibles:\n1-2-3-4 / 2-3-4-5 / 3-4-5-6',
  },
  largeStraight: {
    rule: 'Suite de 5 dés consécutifs\nToujours 40 points',
    example: '⚀ ⚁ ⚂ ⚃ ⚄ = 40 points\n(1-2-3-4-5)',
    possibleScores: '0 ou 40',
    tips: '2 suites possibles:\n1-2-3-4-5 / 2-3-4-5-6',
  },
  yams: {
    rule: '5 dés identiques\nToujours 50 points',
    example: '⚅ ⚅ ⚅ ⚅ ⚅ = 50 points',
    possibleScores: '0 ou 50',
    tips: 'Le Graal du Yams ! 🎉',
  },
  chance: {
    rule: "N'importe quelle combinaison\nTotal de TOUS les 5 dés",
    example: '⚅ ⚅ ⚄ ⚃ ⚂ = 26 points\n(6+6+5+4+3)',
    possibleScores: '5 à 30 points',
    tips: 'Utilisez quand vous avez de gros chiffres',
  },
};

const EnhancedNumPad: React.FC<EnhancedNumPadProps> = ({
  visible,
  player,
  category,
  onSubmit,
  onCancel,
}) => {
  const [input, setInput] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showRules, setShowRules] = useState<boolean>(false);

  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const rulesHeightAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (visible) {
      setInput('');
      setErrorMessage('');
      setShowRules(false);

      // Open animation
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(glowAnim, {
              toValue: 0.6,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(glowAnim, {
              toValue: 0.3,
              duration: 2000,
              useNativeDriver: true,
            }),
          ])
        ),
      ]).start();
    } else {
      // Close animation
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, overlayAnim, glowAnim]);

  // Animate rules expansion/collapse
  useEffect(() => {
    Animated.timing(rulesHeightAnim, {
      toValue: showRules ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [showRules, rulesHeightAnim]);

  if (!visible || !player || !category) {
    return null;
  }

  const categoryInfo = CATEGORIES.find((c) => c.id === category);
  if (!categoryInfo) {
    return null;
  }

  const rules = CATEGORY_RULES[category] || CATEGORY_RULES.ones;
  const possibleScores = POSSIBLE_SCORES[category] || [0];
  const showNumpad = CATEGORIES_WITH_NUMPAD.includes(category);

  const handleDigitPress = (digit: string) => {
    setErrorMessage('');

    // Limit to 2 digits
    if (input.length >= 2) {
      return;
    }

    setInput(input + digit);
  };

  const handleQuickValue = (value: number) => {
    setErrorMessage('');
    setInput(value.toString());
  };

  const handleCrossed = () => {
    onSubmit(0, true);
  };

  const handleDelete = () => {
    setErrorMessage('');
    setInput(input.slice(0, -1));
  };

  const handleValidate = () => {
    if (input === '') {
      setErrorMessage('Choisissez un score');
      return;
    }

    const value = parseInt(input, 10);

    // Pour les catégories sans pavé, valider que le score est dans la liste
    if (!showNumpad && !possibleScores.includes(value)) {
      setErrorMessage('Score non valide pour cette catégorie');
      return;
    }

    const validation = validateScore(category, value);

    if (!validation.valid) {
      setErrorMessage(validation.message || 'Score invalide');

      // Shake animation
      Animated.sequence([
        Animated.timing(slideAnim, {
          toValue: -10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start();

      return;
    }

    onSubmit(value, false);
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onCancel}>
      <View style={styles.modalContainer}>
        {/* Overlay with dark background */}
        <Animated.View
          style={[
            styles.overlay,
            {
              opacity: overlayAnim,
            },
          ]}
        >
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onCancel} activeOpacity={1} />
        </Animated.View>

        {/* Bottom sheet */}
        <Animated.View
          style={[
            styles.bottomSheet,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.90)']}
            style={styles.bottomSheetGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
          <View style={styles.bottomSheetContent}>
            {/* Header simple */}
            <View style={styles.header}>
              <View style={styles.headerTop}>
                <View style={styles.playerInfo}>
                  <View style={[styles.playerDot, { backgroundColor: player.color }]} />
                  <Text style={styles.playerName}>{player.name}</Text>
                  <View style={styles.separatorDot} />
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryName}>{categoryInfo.name}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => setShowRules(!showRules)}
                  style={styles.rulesButton}
                  activeOpacity={0.7}
                >
                  <Text style={styles.rulesButtonText}>
                    {showRules ? '✕' : '?'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* RÈGLES EXPANDABLES */}
            {showRules && (
              <Animated.View
                style={[
                  styles.rulesAnimatedContainer,
                  {
                    maxHeight: rulesHeightAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 200],
                    }),
                    opacity: rulesHeightAnim,
                  },
                ]}
              >
                <View style={styles.rulesHeader}>
                  <Text style={styles.rulesHeaderText}>Aide - Règles du jeu</Text>
                  <TouchableOpacity
                    onPress={() => setShowRules(false)}
                    style={styles.rulesCloseButton}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.rulesCloseText}>Fermer</Text>
                  </TouchableOpacity>
                </View>
                <ScrollView style={styles.rulesContainer} nestedScrollEnabled>
                  <View style={styles.ruleSection}>
                    <Text style={styles.ruleTitle}>📖 Règle</Text>
                    <Text style={styles.ruleText}>{rules.rule}</Text>
                  </View>

                  <View style={styles.ruleSection}>
                    <Text style={styles.ruleTitle}>💡 Exemple</Text>
                    <View style={styles.exampleContainer}>
                      <Text style={styles.exampleText}>{rules.example}</Text>
                    </View>
                  </View>

                  <View style={styles.ruleSection}>
                    <Text style={styles.ruleTitle}>🎯 Scores possibles</Text>
                    <Text style={styles.scoresText}>{rules.possibleScores}</Text>
                  </View>

                  <View style={styles.ruleSection}>
                    <Text style={styles.ruleTitle}>💎 Conseil</Text>
                    <Text style={styles.tipsText}>{rules.tips}</Text>
                  </View>
                </ScrollView>
              </Animated.View>
            )}

            {/* Display du score */}
            <View style={styles.displayContainer}>
              <View style={styles.display}>
                <Text style={styles.displayLabel}>SCORE SÉLECTIONNÉ</Text>
                <View style={styles.displayValueContainer}>
                  <Text style={styles.displayText}>{input || '0'}</Text>
                </View>
                <Text style={styles.displaySubtitle}>
                  <Text style={styles.displaySubtitleIcon}>ℹ️</Text> {rules.possibleScores}
                </Text>
              </View>
            </View>

            {/* Error message */}
          {errorMessage !== '' && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}

          {/* SCORES POSSIBLES - Affichés différemment selon le type */}
          <View style={styles.scoresSection}>
            <Text style={styles.scoresLabel}>
              {showNumpad ? '⚡ SCORES FRÉQUENTS' : '🎯 CHOISISSEZ VOTRE SCORE'}
            </Text>

            {/* Pour les catégories SANS pavé : Affichage en grille */}
            {!showNumpad ? (
              // Pour les catégories spéciales : BARRÉ et VALIDÉ ultra premium
              ['fullHouse', 'smallStraight', 'largeStraight', 'yams'].includes(category) ? (
                <View style={styles.premiumButtonsContainer}>
                  {/* Bouton BARRÉ ultra premium */}
                  <TouchableOpacity
                    style={[
                      styles.premiumChoiceButton,
                      input === '0' && styles.premiumBarreActive,
                    ]}
                    onPress={() => {
                      setInput('0');
                      setTimeout(() => onSubmit(0, true), 100);
                    }}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={input === '0' ? ['#FF6B6B', '#EE5A5A'] : ['#FFE5E5', '#FFF0F0']}
                      style={styles.premiumChoiceGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Text style={styles.premiumChoiceIcon}>❌</Text>
                      <Text style={[
                        styles.premiumChoiceText,
                        input === '0' && styles.premiumChoiceTextActive,
                      ]}>
                        BARRÉ
                      </Text>
                      <Text style={[
                        styles.premiumChoiceSubtext,
                        input === '0' && styles.premiumChoiceSubtextActive,
                      ]}>
                        Je n'ai pas
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  {/* Bouton VALIDÉ ultra premium */}
                  <TouchableOpacity
                    style={[
                      styles.premiumChoiceButton,
                      input !== '0' && input !== '' && styles.premiumValideActive,
                    ]}
                    onPress={() => {
                      const scoreValue = possibleScores.find(s => s > 0) || 0;
                      setInput(scoreValue.toString());
                      setTimeout(() => onSubmit(scoreValue, false), 100);
                    }}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={input !== '0' && input !== '' ? ['#4CAF50', '#45A049'] : ['#E8F5E9', '#F1F8F2']}
                      style={styles.premiumChoiceGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Text style={styles.premiumChoiceIcon}>✓</Text>
                      <Text style={[
                        styles.premiumChoiceText,
                        input !== '0' && input !== '' && styles.premiumChoiceTextActive,
                      ]}>
                        VALIDÉ
                      </Text>
                      <Text style={[
                        styles.premiumChoiceScore,
                        input !== '0' && input !== '' && styles.premiumChoiceScoreActive,
                      ]}>
                        {possibleScores.find(s => s > 0) || 0} pts
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              ) : (
                // Pour les autres catégories : Grille normale
                <View style={styles.scoresGrid}>
                  {possibleScores.map((score) => (
                    <TouchableOpacity
                      key={score}
                      style={[styles.scoreGridButton, input === score.toString() && styles.scoreGridButtonActive]}
                      onPress={() => handleQuickValue(score)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.scoreGridButtonText,
                          input === score.toString() && styles.scoreGridButtonTextActive,
                        ]}
                      >
                        {score}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )
            ) : (
              /* Pour les catégories AVEC pavé : Scroll horizontal */
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.frequentScroll}>
                {possibleScores.map((score) => (
                  <TouchableOpacity
                    key={score}
                    style={[styles.frequentButton, input === score.toString() && styles.frequentButtonActive]}
                    onPress={() => handleQuickValue(score)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.frequentButtonText,
                        input === score.toString() && styles.frequentButtonTextActive,
                      ]}
                    >
                      {score}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>

          {/* Numpad grid - Uniquement pour Brelan, Carré et Chance */}
          {showNumpad && (
          <View style={styles.numpadGrid}>
            {/* Row 1 */}
            <View style={styles.numpadRow}>
              {['1', '2', '3'].map((digit) => (
                <TouchableOpacity
                  key={digit}
                  style={styles.numpadButton}
                  onPress={() => handleDigitPress(digit)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.numpadButtonText}>{digit}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Row 2 */}
            <View style={styles.numpadRow}>
              {['4', '5', '6'].map((digit) => (
                <TouchableOpacity
                  key={digit}
                  style={styles.numpadButton}
                  onPress={() => handleDigitPress(digit)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.numpadButtonText}>{digit}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Row 3 */}
            <View style={styles.numpadRow}>
              {['7', '8', '9'].map((digit) => (
                <TouchableOpacity
                  key={digit}
                  style={styles.numpadButton}
                  onPress={() => handleDigitPress(digit)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.numpadButtonText}>{digit}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Row 4 */}
            <View style={styles.numpadRow}>
              <TouchableOpacity
                style={[styles.numpadButton, styles.crossedButton]}
                onPress={handleCrossed}
                activeOpacity={0.7}
              >
                <Text style={styles.crossedButtonText}>Barré</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.numpadButton}
                onPress={() => handleDigitPress('0')}
                activeOpacity={0.7}
              >
                <Text style={styles.numpadButtonText}>0</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.numpadButton, styles.deleteButton]}
                onPress={handleDelete}
                activeOpacity={0.7}
              >
                <Text style={styles.deleteButtonText}>⌫</Text>
              </TouchableOpacity>
            </View>
          </View>
          )}

          {/* Action buttons */}
          <View style={styles.actionButtonsContainer}>
            {/* Pour les catégories spéciales : SEULEMENT bouton Annuler ultra premium */}
            {['fullHouse', 'smallStraight', 'largeStraight', 'yams'].includes(category) ? (
              <TouchableOpacity
                style={styles.premiumCancelButton}
                onPress={onCancel}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#667EEA', '#764BA2']}
                  style={styles.premiumCancelGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.premiumCancelIcon}>←</Text>
                  <Text style={styles.premiumCancelText}>Annuler</Text>
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              // Pour les autres : Annuler + Valider normaux
              <>
                <TouchableOpacity
                  style={[styles.actionButton, styles.cancelButton]}
                  onPress={onCancel}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cancelButtonText}>Annuler</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    styles.validateButton,
                    !input && styles.validateButtonDisabled,
                  ]}
                  onPress={handleValidate}
                  activeOpacity={0.7}
                  disabled={!input}
                >
                  <Text style={styles.validateButtonText}>Valider ✓</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
          </View>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  glowContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  particlesContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ffffff',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: '90%',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -12 },
    shadowOpacity: 0.3,
    shadowRadius: 32,
    elevation: 30,
  },
  bottomSheetGradient: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    borderBottomWidth: 0,
  },
  bottomSheetContent: {
    paddingBottom: 24,
    backgroundColor: 'transparent',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: 'transparent',
    borderBottomWidth: 2,
    borderBottomColor: '#E8ECF0',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  playerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2C3E50',
  },
  separatorDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#CBD5E0',
    marginHorizontal: 8,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#4A90E2',
    borderWidth: 0,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  rulesButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F4FD',
    borderWidth: 0,
  },
  rulesButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4A90E2',
  },
  rulesAnimatedContainer: {
    overflow: 'hidden',
  },
  rulesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  rulesHeaderText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#7F8C8D',
  },
  rulesCloseButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: '#FFE8E8',
    borderRadius: 8,
  },
  rulesCloseText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#E74C3C',
  },
  rulesContainer: {
    maxHeight: 180,
  },
  ruleSection: {
    marginBottom: 12,
  },
  ruleTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2C3E50',
    marginBottom: 4,
  },
  ruleText: {
    fontSize: 14,
    color: '#5D6D7E',
    lineHeight: 20,
  },
  exampleContainer: {
    backgroundColor: '#E8F8F5',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#27AE60',
  },
  exampleText: {
    fontSize: 14,
    color: '#27AE60',
    fontFamily: 'System',
    lineHeight: 20,
  },
  scoresText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E67E22',
  },
  tipsText: {
    fontSize: 13,
    color: '#8E44AD',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  displayContainer: {
    marginHorizontal: 20,
    marginTop: 16,
  },
  display: {
    backgroundColor: '#F0F7FF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 0,
  },
  displayLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#7F8C8D',
    letterSpacing: 1,
    marginBottom: 8,
  },
  displayValueContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#E8ECF0',
  },
  displayText: {
    fontSize: 42,
    fontWeight: '900',
    color: '#4A90E2',
    fontFamily: 'System',
  },
  displaySubtitle: {
    fontSize: 11,
    color: '#7F8C8D',
    fontWeight: '600',
  },
  displaySubtitleIcon: {
    fontSize: 10,
  },
  errorContainer: {
    marginHorizontal: 20,
    marginTop: 8,
    padding: 12,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
  },
  errorText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B6B',
    textAlign: 'center',
  },
  scoresSection: {
    marginTop: 16,
    paddingHorizontal: 20,
  },
  scoresLabel: {
    fontSize: 16,
    fontWeight: '900',
    color: '#2C3E50',
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  scoresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  scoreGridButton: {
    minWidth: 70,
    paddingHorizontal: 22,
    paddingVertical: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#E8F4FD',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  scoreGridButtonActive: {
    backgroundColor: '#4A90E2',
    borderColor: '#667EEA',
    borderWidth: 3,
    transform: [{ scale: 1.08 }],
    shadowColor: '#667EEA',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  scoreGridButtonText: {
    fontSize: 26,
    fontWeight: '900',
    color: '#4A90E2',
    fontFamily: 'System',
  },
  scoreGridButtonTextActive: {
    color: '#FFFFFF',
  },
  frequentScroll: {
    flexDirection: 'row',
  },
  frequentButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#E8F4FD',
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  frequentButtonActive: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  frequentButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#4A90E2',
    fontFamily: 'System',
  },
  frequentButtonTextActive: {
    color: '#FFFFFF',
  },
  numpadGrid: {
    marginHorizontal: 20,
    marginTop: 16,
    gap: 12,
  },
  numpadRow: {
    flexDirection: 'row',
    gap: 12,
  },
  numpadButton: {
    flex: 1,
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E1E8ED',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  numpadButtonText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C3E50',
    fontFamily: 'System',
  },
  crossedButton: {
    backgroundColor: '#FFEBEE',
    borderColor: '#FFCDD2',
  },
  crossedButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#E74C3C',
  },
  deleteButton: {
    backgroundColor: '#FFF3E0',
    borderColor: '#FFE0B2',
  },
  deleteButtonText: {
    fontSize: 28,
    fontWeight: '400',
    color: '#F39C12',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 20,
    gap: 14,
  },
  actionButton: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#666666',
  },
  validateButton: {
    backgroundColor: '#4A90E2',
  },
  validateButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  validateButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  // Styles BARRÉ/VALIDÉ Ultra Premium
  barreValideContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  barreValideButton: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  barreButton: {
    shadowColor: '#FF6B6B',
  },
  barreButtonActive: {
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
    transform: [{ scale: 1.02 }],
  },
  valideButton: {
    shadowColor: '#4CAF50',
  },
  valideButtonActive: {
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
    transform: [{ scale: 1.02 }],
  },
  barreValideGradient: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  barreValideIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  barreValideText: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1.5,
    color: '#666',
  },
  barreValideTextActive: {
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  barreValideScore: {
    fontSize: 14,
    fontWeight: '700',
    color: '#999',
    marginTop: 2,
  },
  barreValideScoreActive: {
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  // Styles pour BARRÉ et VALIDÉ ultra premium (côte à côte)
  premiumButtonsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  premiumChoiceButton: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 12,
  },
  premiumBarreActive: {
    shadowColor: '#FF6B6B',
    shadowOpacity: 0.6,
    shadowRadius: 30,
    elevation: 20,
    transform: [{ scale: 1.03 }],
  },
  premiumValideActive: {
    shadowColor: '#4CAF50',
    shadowOpacity: 0.6,
    shadowRadius: 30,
    elevation: 20,
    transform: [{ scale: 1.03 }],
  },
  premiumChoiceGradient: {
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 140,
  },
  premiumChoiceIcon: {
    fontSize: 56,
    marginBottom: 8,
  },
  premiumChoiceText: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 2.5,
    color: '#999',
    textTransform: 'uppercase',
  },
  premiumChoiceTextActive: {
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  premiumChoiceSubtext: {
    fontSize: 12,
    fontWeight: '600',
    color: '#AAA',
    marginTop: 4,
  },
  premiumChoiceSubtextActive: {
    color: 'rgba(255, 255, 255, 0.95)',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  premiumChoiceScore: {
    fontSize: 16,
    fontWeight: '800',
    color: '#AAA',
    marginTop: 2,
  },
  premiumChoiceScoreActive: {
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  // Styles pour bouton Annuler ultra premium
  premiumCancelButton: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#667EEA',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 15,
  },
  premiumCancelGradient: {
    flexDirection: 'row',
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 24,
  },
  premiumCancelIcon: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  premiumCancelText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});

export default EnhancedNumPad;
