import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { Player } from '../../../../types';
import PlayerCard from './PlayerCard';
import { MAX_PLAYERS } from '../../constants';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Calculs responsives
const RESPONSIVE = {
  headerPadding: Math.max(SCREEN_WIDTH * 0.04, 16),
  titleSize: Math.min(SCREEN_WIDTH * 0.095, 36),
  titlePadding: SCREEN_WIDTH * 0.03,
  cardsPadding: SCREEN_WIDTH * 0.03,
  buttonHeight: Math.min(SCREEN_HEIGHT * 0.095, 80),
  buttonBottom: SCREEN_HEIGHT * 0.04,
  buttonMargin: SCREEN_WIDTH * 0.03,
  backButtonSize: Math.max(SCREEN_WIDTH * 0.055, 20),
  progressSize: Math.max(SCREEN_WIDTH * 0.065, 24),
  addButtonHeight: Math.min(SCREEN_HEIGHT * 0.11, 92),
  addButtonIconSize: Math.min(SCREEN_WIDTH * 0.095, 36),
  addButtonTextSize: Math.min(SCREEN_WIDTH * 0.055, 21),
};

interface PlayersListProps {
  players: Player[];
  onNameChange: (id: string, name: string) => void;
  onColorPress: (id: string) => void;
  onDeletePlayer: (id: string) => void;
  onAddPlayer: () => void;
  onContinue: () => void;
  onBack: () => void;
  canProceed: boolean;
}

const PlayersList: React.FC<PlayersListProps> = ({
  players,
  onNameChange,
  onColorPress,
  onDeletePlayer,
  onAddPlayer,
  onContinue,
  onBack,
  canProceed,
}) => {
  const insets = useSafeAreaInsets();
  const filledCount = players.filter(p => p.name.length >= 2).length;
  const totalCount = players.length;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Background gradient premium */}
      <LinearGradient
        colors={['#F0F4FF', '#E8F0FE', '#FFFFFF']}
        style={styles.backgroundGradient}
      />
      
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* Header Glass effect */}
        <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.8)']}
            style={styles.headerGlass}
          >
            <View style={styles.header}>
              <TouchableOpacity onPress={onBack} style={styles.backButton}>
                <LinearGradient
                  colors={['#E3F2FD', '#BBDEFB']}
                  style={styles.backButtonGradient}
                >
                  <Text style={styles.backText}>← Retour</Text>
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.progressBadge}>
                <LinearGradient
                  colors={['#C8E6C9', '#A5D6A7']}
                  style={styles.progressGradient}
                >
                  <Text style={styles.progressText}>
                    {filledCount}/{totalCount}
                  </Text>
                </LinearGradient>
              </View>
            </View>
          </LinearGradient>
        </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Qui sont les joueurs ?</Text>
        </View>

        {/* Player Cards */}
        <View style={styles.cardsContainer}>
          {players.map((player, index) => (
            <PlayerCard
              key={player.id}
              player={player}
              index={index}
              onNameChange={onNameChange}
              onColorPress={onColorPress}
              onDelete={onDeletePlayer}
              canDelete={players.length > 2}
              autoFocus={index === 0}
            />
          ))}

          {/* Add Player Button */}
          {players.length < MAX_PLAYERS && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={onAddPlayer}
              activeOpacity={0.7}
            >
              <Text style={styles.addButtonIcon}>➕</Text>
              <Text style={styles.addButtonText}>Ajouter un joueur</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Continue Button */}
      {canProceed ? (
        <TouchableOpacity
          style={[styles.continueButtonWrapper, { bottom: Math.max(insets.bottom, 20) + 20 }]}
          onPress={onContinue}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={['#4A90E2', '#5DADE2', '#50C878']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.continueButton}
          >
            <Text style={styles.continueButtonText}>Continuer →</Text>
          </LinearGradient>
        </TouchableOpacity>
      ) : (
        <View style={[styles.continueButtonWrapper, { bottom: Math.max(insets.bottom, 20) + 20 }]}>
          <View style={styles.continueButtonDisabled}>
            <Text style={styles.continueButtonTextDisabled}>
              Remplissez tous les noms
            </Text>
          </View>
        </View>
      )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  headerGlass: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: RESPONSIVE.headerPadding,
    paddingTop: 20,
    paddingBottom: 20,
  },
  backButton: {
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  backButtonGradient: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  backText: {
    fontSize: RESPONSIVE.backButtonSize,
    color: '#1976D2',
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  progressBadge: {
    borderRadius: 32,
    overflow: 'hidden',
    shadowColor: '#50C878',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 8,
  },
  progressGradient: {
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.7)',
  },
  progressText: {
    fontSize: RESPONSIVE.progressSize,
    fontWeight: '900',
    color: '#2E7D32',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(255, 255, 255, 0.9)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  scrollContent: {
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 20,
    paddingBottom: 120,
  },
  titleSection: {
    marginTop: 20,
    marginBottom: 32,
    alignItems: 'flex-start',
    paddingLeft: RESPONSIVE.titlePadding,
    paddingRight: RESPONSIVE.titlePadding,
  },
  title: {
    fontSize: RESPONSIVE.titleSize,
    fontWeight: '900',
    color: '#1A202C',
    textAlign: 'left',
    letterSpacing: -0.5,
    textShadowColor: 'rgba(74, 144, 226, 0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
    lineHeight: RESPONSIVE.titleSize * 1.2,
  },
  cardsContainer: {
    marginTop: 12,
    paddingLeft: RESPONSIVE.cardsPadding,
    paddingRight: RESPONSIVE.cardsPadding,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 3,
    borderStyle: 'dashed',
    borderColor: 'rgba(74, 144, 226, 0.4)',
    borderRadius: 28,
    height: RESPONSIVE.addButtonHeight,
    marginTop: 12,
    marginHorizontal: 0,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  addButtonIcon: {
    fontSize: RESPONSIVE.addButtonIconSize,
    marginRight: 12,
  },
  addButtonText: {
    fontSize: RESPONSIVE.addButtonTextSize,
    color: '#1976D2',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  continueButtonWrapper: {
    position: 'absolute',
    bottom: RESPONSIVE.buttonBottom,
    left: RESPONSIVE.buttonMargin,
    right: RESPONSIVE.buttonMargin,
  },
  continueButton: {
    height: RESPONSIVE.buttonHeight,
    borderRadius: RESPONSIVE.buttonHeight / 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 32,
    elevation: 16,
  },
  continueButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    height: RESPONSIVE.buttonHeight,
    borderRadius: RESPONSIVE.buttonHeight / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(160, 174, 192, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  continueButtonText: {
    fontSize: Math.max(Math.min(SCREEN_WIDTH * 0.063, 24), 20),
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  continueButtonTextDisabled: {
    fontSize: Math.max(Math.min(SCREEN_WIDTH * 0.05, 19), 16),
    fontWeight: '700',
    color: '#A0AEC0',
    letterSpacing: 0.5,
  },
});

export default PlayersList;
