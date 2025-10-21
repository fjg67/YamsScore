/**
 * Écran de configuration des joueurs
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { createGame } from '../store/slices/gameSlice';
import { getColors, PlayerColors } from '../constants';
import { validatePlayerName, validateUniquePlayerNames } from '../utils';
import { Player } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const PlayerSetupScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.settings.theme);
  const colors = getColors(theme);

  const [playerNames, setPlayerNames] = useState<string[]>(['', '']);

  const handleAddPlayer = () => {
    if (playerNames.length < 6) {
      setPlayerNames([...playerNames, '']);
    }
  };

  const handleRemovePlayer = (index: number) => {
    if (playerNames.length > 2) {
      const newNames = [...playerNames];
      newNames.splice(index, 1);
      setPlayerNames(newNames);
    }
  };

  const handleUpdateName = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const handleStartGame = () => {
    // Valider les noms
    const errors: string[] = [];

    playerNames.forEach((name, index) => {
      const validation = validatePlayerName(name);
      if (!validation.isValid) {
        errors.push(`Joueur ${index + 1}: ${validation.error}`);
      }
    });

    const uniqueValidation = validateUniquePlayerNames(playerNames);
    if (!uniqueValidation.isValid) {
      errors.push(uniqueValidation.error!);
    }

    if (errors.length > 0) {
      Alert.alert('Erreur', errors.join('\n'));
      return;
    }

    // Créer les joueurs
    const players: Player[] = playerNames.map((name, index) => ({
      id: `player_${Date.now()}_${index}`,
      name: name.trim(),
      color: PlayerColors[index % PlayerColors.length],
    }));

    // Créer la partie
    dispatch(createGame({ players, mode: 'classic' }));

    // Naviguer vers l'écran de jeu
    navigation.navigate('Game', { gameId: `game_${Date.now()}` });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.backButton, { color: colors.primary }]}>
            ← Retour
          </Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>
          Configuration des joueurs
        </Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Saisissez le nom de chaque joueur (2-6 joueurs)
        </Text>

        {playerNames.map((name, index) => (
          <View key={index} style={styles.playerRow}>
            <View
              style={[
                styles.colorIndicator,
                { backgroundColor: PlayerColors[index % PlayerColors.length] },
              ]}
            />
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.surface,
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
              placeholder={`Joueur ${index + 1}`}
              placeholderTextColor={colors.textSecondary}
              value={name}
              onChangeText={(text) => handleUpdateName(index, text)}
              maxLength={20}
            />
            {playerNames.length > 2 && (
              <TouchableOpacity
                onPress={() => handleRemovePlayer(index)}
                style={styles.removeButton}
              >
                <Text style={[styles.removeButtonText, { color: colors.error }]}>
                  ✕
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        {playerNames.length < 6 && (
          <TouchableOpacity
            style={[styles.addButton, { borderColor: colors.primary }]}
            onPress={handleAddPlayer}
          >
            <Text style={[styles.addButtonText, { color: colors.primary }]}>
              + Ajouter un joueur
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.startButton, { backgroundColor: colors.secondary }]}
          onPress={handleStartGame}
        >
          <Text style={styles.startButtonText}>Commencer la partie</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    fontSize: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  colorIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  removeButton: {
    marginLeft: 12,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    padding: 20,
  },
  startButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PlayerSetupScreen;
