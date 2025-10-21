/**
 * Écran d'accueil de l'application
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { loadGame } from '../store/slices/gameSlice';
import { loadCurrentGameId, loadGame as loadGameFromStorage } from '../utils/storage';
import { getColors } from '../constants';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.settings.theme);
  const colors = getColors(theme);

  const [hasCurrentGame, setHasCurrentGame] = useState(false);
  const [currentGameId, setCurrentGameId] = useState<string | null>(null);

  // Vérifier s'il y a une partie en cours au montage
  useEffect(() => {
    checkForCurrentGame();
  }, []);

  const checkForCurrentGame = async () => {
    try {
      const gameId = await loadCurrentGameId();
      if (gameId) {
        // Charger la partie pour vérifier qu'elle existe toujours
        const game = await loadGameFromStorage(gameId);
        if (game && game.status === 'in_progress') {
          setHasCurrentGame(true);
          setCurrentGameId(gameId);
        }
      }
    } catch (error) {
      console.error('Erreur chargement partie en cours:', error);
    }
  };

  const handleContinue = async () => {
    if (currentGameId) {
      try {
        const game = await loadGameFromStorage(currentGameId);
        if (game) {
          // Charger la partie dans Redux
          dispatch(loadGame(game));
          // Naviguer vers l'écran de jeu
          navigation.navigate('Game', { gameId: currentGameId });
        }
      } catch (error) {
        console.error('Erreur chargement partie:', error);
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={theme === 'light' ? 'dark-content' : 'light-content'}
      />

      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.primary }]}>
          Yams Score
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Feuille de marque digitale
        </Text>
      </View>

      <View style={styles.menu}>
        {/* Bouton Continuer (affiché seulement s'il y a une partie en cours) */}
        {hasCurrentGame && (
          <TouchableOpacity
            style={[styles.menuButton, styles.continueButton, { backgroundColor: colors.accent }]}
            onPress={handleContinue}
          >
            <Text style={styles.menuButtonText}>▶️ Continuer</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.menuButton, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('PlayerSetup')}
        >
          <Text style={styles.menuButtonText}>Nouvelle Partie</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuButton, { backgroundColor: colors.secondary }]}
          onPress={() => navigation.navigate('History')}
        >
          <Text style={styles.menuButtonText}>Historique</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuButton, { backgroundColor: colors.border }]}
          onPress={() => navigation.navigate('Rules')}
        >
          <Text style={[styles.menuButtonText, { color: colors.text }]}>
            Règles du jeu
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuButton, { backgroundColor: colors.border }]}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={[styles.menuButtonText, { color: colors.text }]}>
            Paramètres
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  menu: {
    width: '100%',
    maxWidth: 320,
  },
  menuButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  continueButton: {
    // Effet pulsation pour attirer l'attention
    shadowOpacity: 0.2,
    elevation: 5,
  },
  menuButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default HomeScreen;
