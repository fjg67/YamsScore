import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Animated, Dimensions } from 'react-native';
import { PLAYER_COLORS } from '../../constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Calcul responsive de la taille des cartes
const getCardSize = () => {
  const availableWidth = SCREEN_WIDTH - 32; // Marges de 16px de chaque côté
  const cardWidth = (availableWidth - 20) / 3; // 3 cartes par ligne avec gap de 10px
  const cardHeight = cardWidth * 1.35; // Ratio hauteur/largeur
  return {
    width: Math.min(cardWidth, 115),
    height: Math.min(cardHeight, 155),
    fontSize: Math.min(cardWidth * 0.52, 58),
    labelSize: Math.min(cardWidth * 0.12, 13),
    iconSize: Math.min(cardWidth * 0.16, 18),
  };
};

const CARD_SIZE = getCardSize();

interface PlayerCountCardProps {
  count: number;
  selected: boolean;
  onSelect: () => void;
}

const PlayerCountCard: React.FC<PlayerCountCardProps> = ({ count, selected, onSelect }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shadowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (selected) {
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.15,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1.08,
            friction: 4,
            tension: 40,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(shadowAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1.0,
          friction: 5,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(shadowAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [selected, scaleAnim, shadowAnim]);

  const renderPlayerIcons = () => {
    const icons = [];
    
    // Mode Solo vs IA (1 joueur)
    if (count === 1) {
      icons.push(
        <Text key="player" style={styles.soloIcon}>
          {PLAYER_COLORS[0].emoji}
        </Text>
      );
      icons.push(
        <Text key="vs" style={styles.vsTextSmall}>
          VS
        </Text>
      );
      icons.push(
        <Text key="ai" style={styles.soloIcon}>
          🤖
        </Text>
      );
      return icons;
    }
    
    // Mode multijoueur (2-6 joueurs) - Ajuster la taille selon le nombre
    const iconSize = count === 2 
      ? CARD_SIZE.iconSize 
      : count === 3 
        ? CARD_SIZE.iconSize * 0.89
        : count === 4 
          ? CARD_SIZE.iconSize * 0.78
          : CARD_SIZE.iconSize * 0.67;
    
    for (let i = 0; i < count; i++) {
      const color = PLAYER_COLORS[i % PLAYER_COLORS.length];
      icons.push(
        <Text key={i} style={[styles.multiPlayerIcon, { fontSize: iconSize }]}>
          {color.emoji}
        </Text>
      );
    }
    return icons;
  };

  return (
    <TouchableOpacity
      onPress={onSelect}
      activeOpacity={0.8}
      style={styles.touchable}
    >
      <Animated.View
        style={[
          styles.card,
          selected ? styles.cardSelected : styles.cardDefault,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.iconsRow}>
          {renderPlayerIcons()}
        </View>

        <Text style={[styles.count, selected && styles.countSelected]}>
          {count}
        </Text>

        <Text style={[styles.label, selected && styles.labelSelected]}>
          {count === 1 ? 'Solo vs IA' : count === 2 ? `${count} joueurs` : `${count} joueurs`}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    margin: 0,
  },
  card: {
    width: CARD_SIZE.width,
    height: CARD_SIZE.height,
    borderRadius: CARD_SIZE.width * 0.26,
    alignItems: 'center',
    justifyContent: 'center',
    padding: CARD_SIZE.width * 0.13,
  },
  cardDefault: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: 'rgba(74, 144, 226, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  cardSelected: {
    backgroundColor: '#4A90E2',
    borderWidth: 0,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 24,
    elevation: 12,
  },
  iconsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: CARD_SIZE.width * 0.055,
    minHeight: CARD_SIZE.width * 0.22,
    maxWidth: CARD_SIZE.width * 0.83,
  },
  soloIcon: {
    fontSize: CARD_SIZE.iconSize,
    marginHorizontal: 1,
  },
  multiPlayerIcon: {
    marginHorizontal: 1,
    marginVertical: 1,
  },
  vsTextSmall: {
    fontSize: CARD_SIZE.width * 0.093,
    fontWeight: '700',
    color: '#7F8C8D',
    marginHorizontal: 1,
  },
  playerIcon: {
    marginHorizontal: 2,
  },
  vsText: {
    fontSize: CARD_SIZE.width * 0.1,
    fontWeight: '700',
    color: '#7F8C8D',
    marginHorizontal: 1,
  },
  count: {
    fontSize: CARD_SIZE.fontSize,
    fontWeight: '900',
    color: '#1A202C',
    marginVertical: CARD_SIZE.width * 0.055,
    letterSpacing: -1,
  },
  countSelected: {
    color: '#FFFFFF',
  },
  label: {
    fontSize: CARD_SIZE.labelSize,
    color: '#718096',
    fontWeight: '600',
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  labelSelected: {
    color: 'rgba(255, 255, 255, 0.95)',
  },
});

export default PlayerCountCard;
