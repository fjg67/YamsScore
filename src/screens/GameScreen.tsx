/**
 * Écran principal de jeu - Feuille de score
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useAppSelector } from '../store/hooks';
import { getColors } from '../constants';
import { ScoreCategory } from '../types';
import ScoreGrid from '../components/ScoreSheet/ScoreGrid';
import NumPad from '../components/NumPad/NumPad';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const GameScreen: React.FC = () => {
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

  // Vérifier si la partie est terminée
  const isGameFinished = currentGame.status === 'completed';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* En-tête */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.backButton, { color: colors.primary }]}>
            ← Retour
          </Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>
          {isGameFinished ? 'Partie terminée' : 'Partie en cours'}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Rules')}>
          <Text style={[styles.rulesButton, { color: colors.primary }]}>
            Règles
          </Text>
        </TouchableOpacity>
      </View>

      {/* Affichage du gagnant si la partie est terminée */}
      {isGameFinished && currentGame.winnerId && (
        <View style={[styles.winnerBanner, { backgroundColor: colors.secondary }]}>
          <Text style={styles.winnerText}>
            🏆 {getPlayerName(currentGame.winnerId)} a gagné ! 🏆
          </Text>
        </View>
      )}

      {/* Grille de score */}
      <View style={styles.content}>
        <ScoreGrid
          onCellPress={handleCellPress}
          selectedCell={selectedCell}
        />
      </View>

      {/* NumPad Modal */}
      {selectedCell && (
        <NumPad
          visible={numPadVisible}
          playerId={selectedCell.playerId}
          playerName={getPlayerName(selectedCell.playerId)}
          category={selectedCell.category}
          onClose={handleNumPadClose}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    fontSize: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  rulesButton: {
    fontSize: 16,
  },
  winnerBanner: {
    padding: 16,
    alignItems: 'center',
  },
  winnerText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 16,
  },
  linkText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default GameScreen;
