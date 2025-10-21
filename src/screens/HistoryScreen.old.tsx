/**
 * Écran d'historique des parties terminées
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setGames, removeGame, setLoading } from '../store/slices/historySlice';
import { loadAllGames, deleteGame } from '../utils/storage';
import { getColors } from '../constants';
import { Game } from '../types';

const HistoryScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.settings.theme);
  const games = useAppSelector((state) => state.history.games);
  const isLoading = useAppSelector((state) => state.history.isLoading);
  const colors = getColors(theme);

  // Charger les parties au montage
  useEffect(() => {
    loadGames();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadGames = async () => {
    try {
      dispatch(setLoading(true));
      const allGames = await loadAllGames();
      // Filtrer seulement les parties terminées
      const completedGames = allGames.filter((g) => g.status === 'completed');
      dispatch(setGames(completedGames));
    } catch (error) {
      console.error('Erreur chargement parties:', error);
      Alert.alert('Erreur', 'Impossible de charger les parties');
    }
  };

  const handleDeleteGame = (gameId: string) => {
    Alert.alert(
      'Supprimer la partie',
      'Êtes-vous sûr de vouloir supprimer cette partie ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteGame(gameId);
              dispatch(removeGame(gameId));
            } catch (error) {
              console.error('Erreur suppression:', error);
              Alert.alert('Erreur', 'Impossible de supprimer la partie');
            }
          },
        },
      ]
    );
  };

  const formatDate = (date: Date): string => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} à ${hours}:${minutes}`;
  };

  const getWinnerName = (game: Game): string => {
    if (!game.winnerId) return 'Aucun';
    const winner = game.players.find((p) => p.id === game.winnerId);
    return winner?.name || 'Inconnu';
  };

  const getWinnerScore = (game: Game): number => {
    if (!game.winnerId) return 0;
    const winnerScore = game.scores.find((s) => s.playerId === game.winnerId);
    return winnerScore?.grandTotal || 0;
  };

  const renderGameItem = ({ item }: { item: Game }) => {
    const winnerName = getWinnerName(item);
    const winnerScore = getWinnerScore(item);
    const winner = item.players.find((p) => p.id === item.winnerId);

    return (
      <View style={[styles.gameCard, { backgroundColor: colors.surface }]}>
        <View style={styles.gameHeader}>
          <View style={styles.gameTitleRow}>
            <Text style={[styles.gameDate, { color: colors.textSecondary }]}>
              {formatDate(item.completedAt || item.createdAt)}
            </Text>
            <View style={styles.playerCount}>
              <Text style={[styles.playerCountText, { color: colors.textSecondary }]}>
                {item.players.length} joueurs
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.gameBody}>
          {/* Gagnant */}
          <View style={styles.winnerSection}>
            <View
              style={[
                styles.winnerBadge,
                { backgroundColor: winner?.color || colors.secondary },
              ]}
            >
              <Text style={styles.winnerBadgeText}>🏆</Text>
            </View>
            <View style={styles.winnerInfo}>
              <Text style={[styles.winnerName, { color: colors.text }]}>
                {winnerName}
              </Text>
              <Text style={[styles.winnerScore, { color: colors.primary }]}>
                {winnerScore} points
              </Text>
            </View>
          </View>

          {/* Liste des joueurs */}
          <View style={styles.playersSection}>
            {item.players.map((player) => {
              const playerScore = item.scores.find((s) => s.playerId === player.id);
              const isWinner = player.id === item.winnerId;

              return (
                <View key={player.id} style={styles.playerRow}>
                  <View
                    style={[
                      styles.playerDot,
                      { backgroundColor: player.color },
                    ]}
                  />
                  <Text
                    style={[
                      styles.playerName,
                      { color: colors.text },
                      isWinner && styles.playerNameBold,
                    ]}
                  >
                    {player.name}
                  </Text>
                  <Text
                    style={[
                      styles.playerScore,
                      { color: colors.textSecondary },
                      isWinner && { color: colors.primary, fontWeight: 'bold' },
                    ]}
                  >
                    {playerScore?.grandTotal || 0}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Actions */}
        <View style={styles.gameActions}>
          <TouchableOpacity
            style={[styles.deleteButton, { borderColor: colors.error }]}
            onPress={() => handleDeleteGame(item.id)}
          >
            <Text style={[styles.deleteButtonText, { color: colors.error }]}>
              🗑️ Supprimer
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        Aucune partie terminée
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        Jouez votre première partie pour la voir apparaître ici
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.backButton, { color: colors.primary }]}>
            ← Retour
          </Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Historique</Text>
        <TouchableOpacity onPress={loadGames}>
          <Text style={[styles.refreshButton, { color: colors.primary }]}>
            ↻
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Chargement...
          </Text>
        </View>
      ) : (
        <FlatList
          data={games}
          renderItem={renderGameItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
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
    fontSize: 24,
    fontWeight: 'bold',
  },
  refreshButton: {
    fontSize: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  listContent: {
    padding: 16,
  },
  gameCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gameHeader: {
    marginBottom: 12,
  },
  gameTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gameDate: {
    fontSize: 14,
    fontWeight: '600',
  },
  playerCount: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  playerCountText: {
    fontSize: 12,
  },
  gameBody: {
    marginBottom: 12,
  },
  winnerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  },
  winnerBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  winnerBadgeText: {
    fontSize: 24,
  },
  winnerInfo: {
    flex: 1,
  },
  winnerName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  winnerScore: {
    fontSize: 16,
    fontWeight: '600',
  },
  playersSection: {
    gap: 8,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  playerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  playerName: {
    flex: 1,
    fontSize: 14,
  },
  playerNameBold: {
    fontWeight: '600',
  },
  playerScore: {
    fontSize: 14,
    fontFamily: 'monospace',
  },
  gameActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: 12,
  },
  deleteButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default HistoryScreen;
