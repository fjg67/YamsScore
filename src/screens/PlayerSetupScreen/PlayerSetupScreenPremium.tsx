/**
 * PlayerSetupScreen Premium - Ultra Design
 * Configuration des joueurs avec avatars emoji, couleurs, animations
 * Version Ultra Premium avec effets visuels et animations cinématiques
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Animated as RNAnimated,
  Easing,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { RootStackParamList } from '../../navigation/types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { createGame } from '../../store/slices/gameSlice';
import { getColors } from '../../constants';
import { Player } from '../../types';

// Components
import PlayerCard from './components/PlayerCard';
import AddPlayerButton from './components/AddPlayerButton';
import AvatarPicker from './components/AvatarPicker';
import StartGameButton from './components/StartGameButton';
import { AnimatedBackground } from '../../components/AnimatedBackground/AnimatedBackground';
import { FloatingParticles } from '../../components/FloatingParticles/FloatingParticles';
import { ConfettiExplosion } from '../../components/ConfettiExplosion/ConfettiExplosion';

// Hooks
import { usePlayerManagement } from './hooks/usePlayerManagement';

// Utils
import { PlayerColorConfig } from './utils/playerColors';

const { width } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const PlayerSetupScreenPremium: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.settings.theme);
  const colors = getColors(theme);
  const isDarkMode = theme === 'dark';

  const {
    players,
    addPlayer,
    removePlayer,
    updatePlayerName,
    updatePlayerEmoji,
    updatePlayerColor,
    isDuplicate,
    validation,
    canAddMore,
    canRemove,
  } = usePlayerManagement(2);

  const [avatarPickerVisible, setAvatarPickerVisible] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Animations
  const headerOpacity = useRef(new RNAnimated.Value(0)).current;
  const headerTranslateY = useRef(new RNAnimated.Value(-20)).current;
  const titleOpacity = useRef(new RNAnimated.Value(0)).current;
  const titleScale = useRef(new RNAnimated.Value(0.9)).current;
  const progressOpacity = useRef(new RNAnimated.Value(0)).current;
  const footerOpacity = useRef(new RNAnimated.Value(0)).current;
  const footerTranslateY = useRef(new RNAnimated.Value(50)).current;
  const badgeScale = useRef(new RNAnimated.Value(1)).current;

  // Animation d'entrée cinématique
  useEffect(() => {
    playCinematicEntry();
    startBadgePulse();
  }, []);

  const startBadgePulse = useCallback(() => {
    RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(badgeScale, {
          toValue: 1.08,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        RNAnimated.timing(badgeScale, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [badgeScale]);

  const playCinematicEntry = useCallback(() => {
    RNAnimated.sequence([
      // Délai initial
      RNAnimated.delay(100),

      // 1. Header apparaît (0.5s)
      RNAnimated.parallel([
        RNAnimated.timing(headerOpacity, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        RNAnimated.spring(headerTranslateY, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),

      RNAnimated.delay(100),

      // 2. Titre apparaît avec scale (0.6s)
      RNAnimated.parallel([
        RNAnimated.timing(titleOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        RNAnimated.spring(titleScale, {
          toValue: 1,
          friction: 7,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),

      RNAnimated.delay(150),

      // 3. Progress bar apparaît (0.4s)
      RNAnimated.timing(progressOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),

      RNAnimated.delay(200),

      // 4. Footer apparaît (0.5s)
      RNAnimated.parallel([
        RNAnimated.timing(footerOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        RNAnimated.spring(footerTranslateY, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const handleAvatarPress = (playerId: string) => {
    setSelectedPlayerId(playerId);
    setAvatarPickerVisible(true);
    ReactNativeHapticFeedback.trigger('impactLight');
  };

  const handleSelectEmoji = (emoji: string) => {
    if (selectedPlayerId) {
      updatePlayerEmoji(selectedPlayerId, emoji);
    }
  };

  const handleSelectColor = (color: PlayerColorConfig) => {
    if (selectedPlayerId) {
      updatePlayerColor(selectedPlayerId, color);
    }
  };

  const handleStartGame = () => {
    if (!validation.isValid) {
      Alert.alert('Attention', validation.errors.join('\n'));
      ReactNativeHapticFeedback.trigger('notificationWarning');
      return;
    }

    // Animation de succès
    ReactNativeHapticFeedback.trigger('notificationSuccess');
    setShowConfetti(true);

    // Créer les joueurs avec les nouveaux champs
    const gamePlayers: Player[] = players.map((player) => ({
      id: player.id,
      name: player.name.trim(),
      color: player.color.hex,
      emoji: player.emoji,
      colorGradient: player.color.gradient,
    }));

    // Créer la partie
    dispatch(createGame({ players: gamePlayers, mode: 'classic' }));

    // Naviguer vers l'écran de jeu avec un délai pour l'animation
    setTimeout(() => {
      navigation.navigate('Game', { gameId: `game_${Date.now()}` });
    }, 800);
  };

  const getDynamicSubtitle = () => {
    const count = players.length;
    if (count <= 1) return 'Ajoute tes adversaires';
    if (count <= 3) return 'Parfait ! Encore quelques-uns ?';
    return 'Super équipe ! C\'est parti ?';
  };

  const selectedPlayer = selectedPlayerId
    ? players.find((p) => p.id === selectedPlayerId)
    : null;

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#0A0A0A' : '#F8F9FA' }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {/* Background animé */}
      <AnimatedBackground isDarkMode={isDarkMode} />

      {/* Particules flottantes */}
      <FloatingParticles
        count={8}
        colors={['#4A90E2', '#50C878', '#FF6B6B', '#FFD700']}
        minSize={3}
        maxSize={10}
        speed={10000}
      />

      {/* Confettis de succès */}
      {showConfetti && (
        <ConfettiExplosion
          count={50}
          origin={{ x: width / 2, y: 400 }}
          colors={['#FF6B6B', '#4A90E2', '#50C878', '#FFD700', '#9B59B6', '#FF8C00']}
          duration={2500}
          spread={300}
          onComplete={() => setShowConfetti(false)}
        />
      )}

      <SafeAreaView style={styles.safeArea}>
        {/* Header avec animation */}
        <RNAnimated.View
          style={[
            styles.header,
            {
              opacity: headerOpacity,
              transform: [{ translateY: headerTranslateY }],
            },
          ]}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={[styles.backButton, { color: colors.primary }]}>← Retour</Text>
          </TouchableOpacity>

          <RNAnimated.View
            style={[
              styles.playerCountBadge,
              { transform: [{ scale: badgeScale }] }
            ]}
          >
            <LinearGradient
              colors={['#FF6B6B', '#FF8E53', '#FFA94D']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.playerCountGradient}
            >
              <View style={styles.playerCountContent}>
                <Text style={styles.playerCountNumber}>{players.length}</Text>
                <Text style={styles.playerCountSeparator}>/</Text>
                <Text style={styles.playerCountTotal}>6</Text>
              </View>
            </LinearGradient>
          </RNAnimated.View>
        </RNAnimated.View>

        {/* Titre avec animation */}
        <RNAnimated.View
          style={[
            styles.headerContent,
            {
              opacity: titleOpacity,
              transform: [{ scale: titleScale }],
            },
          ]}
        >
          <Text style={[styles.title, { color: colors.text }]}>Qui joue ce soir ? 🎲</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {getDynamicSubtitle()}
          </Text>

          {/* Progress Bar avec animation */}
          <RNAnimated.View style={[styles.progressBarContainer, { opacity: progressOpacity }]}>
            <View style={styles.progressBarBackground}>
              <Animated.View
                style={[
                  styles.progressBarFill,
                  { width: `${(players.length / 6) * 100}%` },
                ]}
              >
                <LinearGradient
                  colors={['#4A90E2', '#50C878']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={StyleSheet.absoluteFill}
                />
              </Animated.View>
            </View>
          </RNAnimated.View>
        </RNAnimated.View>

      {/* Player Cards */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {players.map((player, index) => (
          <PlayerCard
            key={player.id}
            playerIndex={index}
            name={player.name}
            emoji={player.emoji}
            color={player.color}
            onNameChange={(name) => updatePlayerName(player.id, name)}
            onAvatarPress={() => handleAvatarPress(player.id)}
            onRemove={() => removePlayer(player.id)}
            canRemove={canRemove}
            isDuplicate={isDuplicate(player.id)}
          />
        ))}

        {/* Add Player Button */}
        <AddPlayerButton
          onPress={addPlayer}
          disabled={!canAddMore}
          currentPlayers={players.length}
          maxPlayers={6}
        />

        {/* Validation Message */}
        {!validation.isValid && players.length >= 2 && (
          <Animated.View
            entering={FadeInDown.duration(300)}
            style={styles.validationContainer}
          >
            <Text style={styles.validationText}>
              {validation.errors.join(' • ')}
            </Text>
          </Animated.View>
        )}

        {validation.isValid && players.length >= 2 && (
          <Animated.View
            entering={FadeInDown.duration(300)}
            style={[styles.validationContainer, styles.validationSuccess]}
          >
            <Text style={styles.validationSuccessText}>✓ Tout est prêt !</Text>
          </Animated.View>
        )}
      </ScrollView>

        {/* Start Game Button Ultra Premium avec animation */}
        <RNAnimated.View
          style={[
            styles.footer,
            {
              opacity: footerOpacity,
              transform: [{ translateY: footerTranslateY }],
            },
          ]}
        >
          <StartGameButton
            onPress={handleStartGame}
            disabled={!validation.isValid}
            playerCount={players.length}
          />
        </RNAnimated.View>
      </SafeAreaView>

      {/* Avatar Picker Modal */}
      {selectedPlayer && (
        <AvatarPicker
          visible={avatarPickerVisible}
          currentEmoji={selectedPlayer.emoji}
          currentColor={selectedPlayer.color}
          onClose={() => setAvatarPickerVisible(false)}
          onSelectEmoji={handleSelectEmoji}
          onSelectColor={handleSelectColor}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  backButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  playerCountBadge: {
    borderRadius: 24,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  playerCountGradient: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 21,
    minWidth: 80,
  },
  playerCountContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  playerCountNumber: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    includeFontPadding: false,
    textAlign: 'center',
  },
  playerCountSeparator: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    opacity: 0.8,
    includeFontPadding: false,
  },
  playerCountTotal: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    includeFontPadding: false,
    textAlign: 'center',
  },
  headerContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 17,
    marginBottom: 20,
    fontWeight: '500',
  },
  progressBarContainer: {
    marginTop: 8,
  },
  progressBarBackground: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(74, 144, 226, 0.12)',
    overflow: 'hidden',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  validationContainer: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B6B',
  },
  validationSuccess: {
    backgroundColor: 'rgba(80, 200, 120, 0.1)',
    borderLeftColor: '#50C878',
  },
  validationText: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '600',
  },
  validationSuccessText: {
    color: '#50C878',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    padding: 20,
    paddingBottom: 32,
  },
});

export default PlayerSetupScreenPremium;
