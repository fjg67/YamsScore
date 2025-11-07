import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ScoreEntry } from '../../../types/game';

interface ScoreCellProps {
  entry: ScoreEntry;
  playerColor: string;
  isActive: boolean;
  isLocked: boolean;
  isPlayerTurn: boolean; // Nouveau: true si c'est la colonne du joueur actif
  onPress: () => void;
  columnWidth: number;
}

const ScoreCell: React.FC<ScoreCellProps> = ({
  entry,
  playerColor,
  isActive,
  isLocked,
  isPlayerTurn,
  onPress,
  columnWidth,
}) => {
  // Protection contre entry undefined
  if (!entry) {
    return null;
  }

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isActive) {
      // Pulse animation for active cell
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.02,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1.0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }

    return () => {
      pulseAnim.stopAnimation();
    };
  }, [isActive, pulseAnim]);

  const handlePress = () => {
    if (isLocked || entry.value !== null) {
      return;
    }

    // Press animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onPress();
  };

  const getCellStyle = () => {
    if (entry.value !== null) {
      // Filled cell
      if (entry.isCrossed) {
        return styles.cellCrossed;
      }
      return styles.cellFilled;
    }

    if (isActive) {
      // Active cell (can be filled)
      return styles.cellActive;
    }

    // Empty cell
    return styles.cellEmpty;
  };

  const renderCellContent = () => {
    if (entry.value === null) {
      // Si la cellule est verrouillée (pas le tour du joueur), afficher un cadenas
      if (isLocked) {
        return (
          <View style={styles.lockedContainer}>
            <Text style={styles.lockIcon}>🔒</Text>
          </View>
        );
      }
      return <Text style={styles.emptyText}>–</Text>;
    }

    if (entry.isCrossed) {
      return (
        <View style={styles.crossedContainer}>
          <View style={styles.crossIconContainer}>
            <Text style={styles.crossIcon}>❌</Text>
          </View>
          <View style={[styles.crossLine1, { backgroundColor: '#FF3B3B' }]} />
          <View style={[styles.crossLine2, { backgroundColor: '#FF3B3B' }]} />
        </View>
      );
    }

    return <Text style={styles.scoreText}>{entry.value}</Text>;
  };

  const renderContent = () => {
    const content = renderCellContent();

    // Déterminer la couleur de bordure
    const getBorderColor = () => {
      if (entry.value !== null && entry.isCrossed) {
        return '#FF6B6B'; // Rouge pour barré
      }
      if (entry.value !== null) {
        return playerColor; // Couleur du joueur pour rempli
      }
      if (isActive) {
        return playerColor; // Couleur du joueur pour actif
      }
      if (isPlayerTurn && entry.value === null) {
        return playerColor; // Couleur du joueur si c'est son tour et cellule vide
      }
      return '#E8EEF4'; // Gris par défaut
    };

    if (entry.value !== null && entry.isCrossed) {
      // Crossed cell with premium red gradient
      return (
        <LinearGradient
          colors={['#FFE5E5', '#FFCCCC', '#FFB3B3']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.cell, getCellStyle(), { borderColor: getBorderColor() }]}
        >
          {content}
        </LinearGradient>
      );
    }

    if (entry.value !== null && !entry.isCrossed) {
      // Filled cell with ULTRA PREMIUM gradient
      const premiumColors = [
        `${playerColor}40`,
        `${playerColor}30`,
        `${playerColor}20`,
      ];

      return (
        <LinearGradient
          colors={premiumColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.cell, getCellStyle(), { borderColor: getBorderColor() }]}
        >
          <View style={styles.scoreContentContainer}>
            {content}
            <View style={styles.scoreShine} />
          </View>
        </LinearGradient>
      );
    }

    if (isActive) {
      // Active cell with gradient
      return (
        <LinearGradient
          colors={[`${playerColor}25`, `${playerColor}10`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.cell, getCellStyle(), { borderColor: getBorderColor() }]}
        >
          {content}
        </LinearGradient>
      );
    }

    if (isPlayerTurn && entry.value === null) {
      // Cellule vide mais c'est le tour du joueur - avec gradient subtil
      return (
        <LinearGradient
          colors={[`${playerColor}08`, '#FFFFFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.cell, getCellStyle(), { borderColor: getBorderColor(), borderWidth: 2.5 }]}
        >
          {content}
        </LinearGradient>
      );
    }

    // Cellule verrouillée - style grisé
    if (isLocked && entry.value === null) {
      return (
        <View style={[styles.cell, styles.cellLocked, { borderColor: '#D8D8D8' }]}>
          {content}
        </View>
      );
    }

    return (
      <View style={[styles.cell, getCellStyle(), { borderColor: getBorderColor() }]}>
        {content}
      </View>
    );
  };

  return (
    <Animated.View
      style={[
        styles.cellContainer,
        { width: columnWidth },
        {
          transform: [{ scale: isActive ? pulseAnim : scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={isLocked || entry.value !== null ? 1 : 0.85}
        disabled={isLocked || entry.value !== null}
        style={{ flex: 1 }}
      >
        {renderContent()}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cellContainer: {
    height: 56,
    padding: 2,
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cellEmpty: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  cellActive: {
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  cellFilled: {
    borderWidth: 3,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },
  cellCrossed: {
    borderColor: '#FF3B3B',
    borderWidth: 3,
    shadowColor: '#FF3B3B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.5)',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  scoreText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    fontFamily: 'System',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  scoreContentContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  scoreShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  crossedContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  crossIconContainer: {
    position: 'absolute',
    zIndex: 10,
  },
  crossIcon: {
    fontSize: 32,
    textShadowColor: 'rgba(255, 59, 59, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  crossLine1: {
    position: 'absolute',
    width: 42,
    height: 4,
    borderRadius: 2,
    transform: [{ rotate: '45deg' }],
    shadowColor: '#FF3B3B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  crossLine2: {
    position: 'absolute',
    width: 42,
    height: 4,
    borderRadius: 2,
    transform: [{ rotate: '-45deg' }],
    shadowColor: '#FF3B3B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  lockedContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockIcon: {
    fontSize: 20,
    opacity: 0.5,
  },
  cellLocked: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    opacity: 0.7,
  },
});

export default ScoreCell;
