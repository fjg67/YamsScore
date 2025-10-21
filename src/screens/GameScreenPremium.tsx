/**
 * Écran de jeu PREMIUM - Version révolutionnaire
 * Intègre tous les composants premium de la Phase 1
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useAppSelector } from '../store/hooks';
import { getColors } from '../constants';
import { ScoreCategory } from '../types';
import { premiumTheme } from '../theme/premiumTheme';

// Premium Components
import PlayerBadgeCarousel from '../components/GameScreen/PlayerBadges/PlayerBadgeCarousel';
import LiveLeaderboardMini from '../components/GameScreen/Leaderboard/LiveLeaderboardMini';
import TurnIndicatorPremium from '../components/GameScreen/TurnIndicator/TurnIndicatorPremium';
import PremiumScoreGrid from '../components/GameScreen/ScoreSheet/PremiumScoreGrid';
import NumPadBottomSheet from '../components/NumPad/NumPadBottomSheet';
import CelebrationProvider from '../components/Celebrations/CelebrationProvider';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const GameScreenPremium: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const theme = useAppSelector((state) => state.settings.theme);
  const currentGame = useAppSelector((state) => state.game.currentGame);
  const colors = getColors(theme);

  const [numPadVisible, setNumPadVisible] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{
    playerId: string;
    category: ScoreCategory;
  } | null>(null);

  if (!currentGame) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>
          Aucune partie en cours
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={[styles.linkText, { color: colors.primary }]}>
            Retour à l'accueil
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBackPress = () => {
    Alert.alert(
      'Quitter la partie ?',
      'Que voulez-vous faire avec cette partie en cours ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Quitter sans sauvegarder',
          style: 'destructive',
          onPress: () => {
            // Retour à l'écran d'accueil sans sauvegarder
            navigation.navigate('Home');
          },
        },
        {
          text: 'Sauvegarder et quitter',
          onPress: () => {
            // TODO: Sauvegarder la partie
            // Pour l'instant, on retourne juste à l'écran d'accueil
            navigation.navigate('Home');
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleCellPress = (playerId: string, category: ScoreCategory) => {
    // Vérifier si la cellule n'est pas déjà remplie
    const playerScore = currentGame.scores.find((s) => s.playerId === playerId);
    if (playerScore && playerScore[category] !== undefined) {
      Alert.alert(
        'Score déjà saisi',
        'Cette case est déjà remplie. Les scores ne peuvent pas être modifiés.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Ouvrir le NumPad pour cette cellule
    setSelectedCell({ playerId, category });
    setNumPadVisible(true);
  };

  const handleNumPadClose = () => {
    setNumPadVisible(false);
    setSelectedCell(null);
  };

  const getPlayerName = (playerId: string): string => {
    const player = currentGame.players.find((p) => p.id === playerId);
    return player?.name || 'Joueur';
  };

  const getPlayerColor = (playerId: string): string => {
    const player = currentGame.players.find((p) => p.id === playerId);
    return player?.color || '#4A90E2';
  };

  // Vérifier si la partie est terminée
  const isGameFinished = currentGame.status === 'completed';

  return (
    <CelebrationProvider>
      <View style={styles.container}>
        {/* Header minimal */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress}>
            <Text style={[styles.backButton, { color: colors.primary }]}>
              ← Retour
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Rules')}>
            <Text style={[styles.rulesButton, { color: colors.primary }]}>
              Règles
            </Text>
          </TouchableOpacity>
        </View>

        {/* Player Badges Carousel */}
        <PlayerBadgeCarousel />

        {/* Live Leaderboard Mini */}
        <LiveLeaderboardMini />

        {/* Turn Indicator */}
        {!isGameFinished && <TurnIndicatorPremium />}

        {/* Winner Banner si partie terminée */}
        {isGameFinished && currentGame.winnerId && (
          <View style={[styles.winnerBanner, { backgroundColor: colors.secondary }]}>
            <Text style={styles.winnerText}>
              🏆 {getPlayerName(currentGame.winnerId)} a gagné ! 🏆
            </Text>
          </View>
        )}

        {/* Premium Score Grid */}
        <View style={styles.content}>
          <PremiumScoreGrid
            onCellPress={handleCellPress}
            selectedCell={selectedCell}
          />
        </View>

        {/* NumPad Premium Modal */}
        {selectedCell && (
          <NumPadBottomSheet
            visible={numPadVisible}
            playerId={selectedCell.playerId}
            playerName={getPlayerName(selectedCell.playerId)}
            playerColor={getPlayerColor(selectedCell.playerId)}
            category={selectedCell.category}
            onClose={handleNumPadClose}
          />
        )}
      </View>
    </CelebrationProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: premiumTheme.colors.ui.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: premiumTheme.spacing.md,
    paddingTop: 60,
    paddingBottom: premiumTheme.spacing.sm,
  },
  backButton: {
    fontSize: premiumTheme.typography.fontSize.xl,
  },
  rulesButton: {
    fontSize: premiumTheme.typography.fontSize.xl,
  },
  winnerBanner: {
    padding: premiumTheme.spacing.md,
    alignItems: 'center',
    borderRadius: premiumTheme.borderRadius.lg,
    marginHorizontal: premiumTheme.spacing.md,
    marginVertical: premiumTheme.spacing.sm,
  },
  winnerText: {
    color: '#FFFFFF',
    fontSize: premiumTheme.typography.fontSize.xxl,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  errorText: {
    fontSize: premiumTheme.typography.fontSize.xxl,
    textAlign: 'center',
    marginBottom: premiumTheme.spacing.md,
  },
  linkText: {
    fontSize: premiumTheme.typography.fontSize.xl,
    textAlign: 'center',
  },
});

export default GameScreenPremium;
