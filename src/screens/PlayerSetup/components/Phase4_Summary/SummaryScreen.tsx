import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { Player, GameConfig } from '../../../../types';

interface SummaryScreenProps {
  players: Player[];
  gameConfig: GameConfig;
  onLaunch: () => void;
  onBack: () => void;
}

const SummaryScreen: React.FC<SummaryScreenProps> = ({
  players,
  gameConfig,
  onLaunch,
  onBack,
}) => {
  const insets = useSafeAreaInsets();
  const buttonScale = useRef(new Animated.Value(1)).current;
  const buttonGradient = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse animation pour le bouton
    Animated.loop(
      Animated.sequence([
        Animated.timing(buttonScale, {
          toValue: 1.02,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(buttonScale, {
          toValue: 1.0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Gradient animation
    Animated.loop(
      Animated.timing(buttonGradient, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: false,
      })
    ).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderPlayerCard = (player: Player, index: number) => {
    return (
      <Animated.View key={player.id} style={styles.playerRecapCard}>
        <View style={styles.playerRecapContent}>
          <Text style={styles.positionNumber}>{index + 1}️⃣</Text>

          <View
            style={[styles.playerRecapAvatar, { backgroundColor: player.color }]}
          >
            <Text style={styles.playerRecapAvatarText}>
              {player.name[0].toUpperCase()}
            </Text>
          </View>

          <Text style={styles.playerRecapName}>{player.name}</Text>
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>← Modifier</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.emoji}>🎉</Text>
          <Text style={styles.title}>Tout est prêt !</Text>
        </View>

        {/* Recap Section */}
        <View style={styles.recapSection}>
          <Text style={styles.sectionTitle}>Récapitulatif</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>👥 {players.length} joueurs</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              🎮 Mode {gameConfig.mode === 'classic' ? 'Classique' : 'Descendant'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              📋 Ordre {gameConfig.orderType === 'manual' ? 'manuel' : 'aléatoire'}
            </Text>
          </View>
        </View>

        {/* Players List */}
        <View style={styles.playersSection}>
          {players.map((player, index) => renderPlayerCard(player, index))}
        </View>
      </ScrollView>

      {/* Launch Button */}
      <View style={[styles.launchContainer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <TouchableOpacity
          onPress={onLaunch}
          activeOpacity={0.9}
          style={styles.launchTouchable}
        >
          <Animated.View
            style={[
              styles.launchButtonWrapper,
              {
                transform: [{ scale: buttonScale }],
              },
            ]}
          >
            <LinearGradient
              colors={['#4A90E2', '#5DADE2', '#50C878']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.launchButton}
            >
              <Text style={styles.launchButtonText}>🎲 LANCER LA PARTIE 🎲</Text>
            </LinearGradient>
          </Animated.View>
        </TouchableOpacity>
      </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backButton: {
    padding: 8,
  },
  backText: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 140,
  },
  titleSection: {
    alignItems: 'center',
    marginVertical: 24,
  },
  emoji: {
    fontSize: 60,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
  },
  recapSection: {
    backgroundColor: 'rgba(74, 144, 226, 0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(74, 144, 226, 0.2)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 16,
  },
  infoRow: {
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 16,
    color: '#6C757D',
    fontWeight: '500',
  },
  playersSection: {
    marginBottom: 24,
  },
  playerRecapCard: {
    marginBottom: 12,
  },
  playerRecapContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  positionNumber: {
    fontSize: 24,
    marginRight: 12,
  },
  playerRecapAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  playerRecapAvatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  playerRecapName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    flex: 1,
  },
  launchContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: '#E1E8ED',
  },
  launchTouchable: {
    width: '100%',
  },
  launchButtonWrapper: {
    width: '100%',
  },
  launchButton: {
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
  },
  launchButtonText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});

export default SummaryScreen;
