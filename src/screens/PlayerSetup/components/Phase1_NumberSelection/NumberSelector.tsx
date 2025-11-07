import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PlayerCountCard from './PlayerCountCard';
import { MIN_PLAYERS, MAX_PLAYERS } from '../../constants';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Calculs responsives
const RESPONSIVE = {
  paddingHorizontal: SCREEN_WIDTH * 0.02,
  headerMarginBottom: SCREEN_HEIGHT * 0.04,
  emojiSize: SCREEN_WIDTH * 0.17,
  titleSize: SCREEN_WIDTH * 0.095,
  subtitleSize: SCREEN_WIDTH * 0.05,
  rowGap: SCREEN_WIDTH * 0.025,
  buttonHeight: SCREEN_HEIGHT * 0.09,
  buttonFontSize: SCREEN_WIDTH * 0.06,
};

interface NumberSelectorProps {
  selectedCount: number;
  aiDifficulty?: 'easy' | 'normal' | 'hard';
  onSelectCount: (count: number) => void;
  onSelectAIDifficulty?: (difficulty: 'easy' | 'normal' | 'hard') => void;
  onNext: () => void;
}

const NumberSelector: React.FC<NumberSelectorProps> = ({
  selectedCount,
  onSelectCount,
}) => {
  const renderPlayerCountCards = () => {
    const cards = [];
    for (let i = MIN_PLAYERS; i <= MAX_PLAYERS; i++) {
      cards.push(
        <PlayerCountCard
          key={i}
          count={i}
          selected={selectedCount === i}
          onSelect={() => onSelectCount(i)}
        />
      );
    }
    return cards;
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.emoji}>🎲</Text>
          <Text style={styles.title}>Nouvelle Partie</Text>
          <Text style={styles.subtitle}>Combien de joueurs à la table ?</Text>
        </View>

        {/* Cards Grid */}
        <View style={styles.grid}>
          <View style={styles.row}>
            {renderPlayerCountCards().slice(0, 3)}
          </View>
          <View style={styles.row}>
            {renderPlayerCountCards().slice(3, 6)}
          </View>
        </View>

        {/* Quick Select (placeholder for future) */}
        {/* <View style={styles.quickSelect}>
          <TouchableOpacity style={styles.quickSelectCard}>
            <Text style={styles.quickSelectText}>👥 Dernière partie (4 joueurs)</Text>
          </TouchableOpacity>
        </View> */}
      </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  scrollContent: {
    paddingHorizontal: RESPONSIVE.paddingHorizontal,
    paddingTop: 20,
    paddingBottom: 110,
  },
  header: {
    alignItems: 'center',
    marginBottom: RESPONSIVE.headerMarginBottom,
    paddingHorizontal: 4,
  },
  emoji: {
    fontSize: RESPONSIVE.emojiSize,
    marginBottom: 14,
  },
  title: {
    fontSize: RESPONSIVE.titleSize,
    fontWeight: '900',
    color: '#1A202C',
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: RESPONSIVE.subtitleSize,
    fontWeight: '500',
    color: '#718096',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  grid: {
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 8,
    gap: RESPONSIVE.rowGap,
  },
  quickSelect: {
    marginTop: 32,
  },
  quickSelectCard: {
    backgroundColor: 'rgba(74, 144, 226, 0.05)',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#4A90E2',
    borderRadius: 16,
    padding: 16,
  },
  quickSelectText: {
    fontSize: 16,
    color: '#4A90E2',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default NumberSelector;
