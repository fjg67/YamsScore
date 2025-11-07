import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Calculs responsives
const RESPONSIVE = {
  padding: SCREEN_WIDTH * 0.03,
  titleSize: Math.min(SCREEN_WIDTH * 0.055, 22),
  turnSize: Math.min(SCREEN_WIDTH * 0.042, 16),
  iconSize: Math.min(SCREEN_WIDTH * 0.078, 30),
  buttonSize: Math.min(SCREEN_WIDTH * 0.13, 50),
};

interface GameHeaderProps {
  gameName: string;
  currentTurn: number;
  totalTurns: number;
  onBack: () => void;
  onSettings?: () => void;
  onHelp?: () => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({
  currentTurn,
  totalTurns,
  onBack,
}) => {
  const handleBack = () => {
    Alert.alert(
      'Quitter la partie ?',
      'La progression sera sauvegardée',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Quitter', style: 'destructive', onPress: onBack },
      ]
    );
  };

  return (
    <LinearGradient
      colors={['rgba(255, 255, 255, 0.35)', 'rgba(255, 255, 255, 0.25)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Back button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={handleBack}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.2)']}
          style={styles.backButtonGradient}
        >
          <Text style={styles.backIcon}>←</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Title */}
      <View style={styles.centerSection}>
        <View style={styles.titleContainer}>
          {/* Double text for glow effect */}
          <Text style={[styles.gameName, styles.gameNameGlow]}>📋 FEUILLE DE SCORE 📋</Text>
          <Text style={styles.gameName}>📋 FEUILLE DE SCORE 📋</Text>
        </View>
        <Text style={styles.turnIndicator}>
          Tour {currentTurn}/{totalTurns}
        </Text>
      </View>

      {/* Spacer pour équilibrer le layout */}
      <View style={styles.rightSpacer} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    height: Math.min(SCREEN_WIDTH * 0.17, 65),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: RESPONSIVE.padding,
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  backButton: {
    width: RESPONSIVE.buttonSize,
    height: RESPONSIVE.buttonSize,
    borderRadius: RESPONSIVE.buttonSize / 2,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  backButtonGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RESPONSIVE.buttonSize / 2,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  backIcon: {
    fontSize: RESPONSIVE.iconSize,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: RESPONSIVE.padding,
  },
  titleContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameIcon: {
    fontSize: Math.min(SCREEN_WIDTH * 0.047, 18),
  },
  gameName: {
    fontSize: RESPONSIVE.titleSize,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  gameNameGlow: {
    position: 'absolute',
    color: '#FFFFFF',
    opacity: 0.6,
    textShadowColor: '#ffffff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  turnIndicator: {
    fontSize: RESPONSIVE.turnSize,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  actionsSection: {
    flexDirection: 'row',
    gap: RESPONSIVE.padding / 3,
  },
  actionButton: {
    width: RESPONSIVE.buttonSize,
    height: RESPONSIVE.buttonSize,
    borderRadius: RESPONSIVE.buttonSize / 2,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RESPONSIVE.buttonSize / 2,
  },
  actionIcon: {
    fontSize: Math.min(SCREEN_WIDTH * 0.052, 20),
    fontWeight: '700',
    color: '#6C757D',
  },
  rightSpacer: {
    width: RESPONSIVE.buttonSize,
  },
});

export default GameHeader;
