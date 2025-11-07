import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  getGameHistory,
  deleteGameFromHistory,
  SavedGame,
} from '../../../services/gameHistoryService';

interface HistoryScreenProps {
  onBack?: () => void;
  onGameSelect?: (game: SavedGame) => void;
}

const HistoryScreen: React.FC<HistoryScreenProps> = ({ onBack, onGameSelect }) => {
  const [games, setGames] = useState<SavedGame[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadHistory = async () => {
    try {
      const history = await getGameHistory();
      setGames(history);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadHistory();
  };

  const handleDelete = (gameId: string) => {
    Alert.alert(
      'Supprimer la partie',
      'Êtes-vous sûr de vouloir supprimer cette partie de l\'historique ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteGameFromHistory(gameId);
              loadHistory();
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de supprimer la partie');
            }
          },
        },
      ]
    );
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Aujourd'hui à ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Hier à ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  const renderGameItem = ({ item }: { item: SavedGame }) => (
    <TouchableOpacity
      style={styles.gameCard}
      onPress={() => onGameSelect && onGameSelect(item)}
      activeOpacity={0.7}
    >
      <View style={styles.gameHeader}>
        <View style={styles.gameHeaderLeft}>
          <Text style={styles.gameName}>{item.gameName}</Text>
          <Text style={styles.gameDate}>{formatDate(item.completedAt)}</Text>
        </View>
        <TouchableOpacity
          onPress={() => handleDelete(item.id)}
          style={styles.deleteButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.deleteButtonText}>🗑️</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.winnerSection}>
        <Text style={styles.winnerLabel}>🏆 Vainqueur</Text>
        <View style={styles.winnerInfo}>
          <Text style={styles.winnerName}>{item.winner.name}</Text>
          <Text style={styles.winnerScore}>{item.winner.score} pts</Text>
        </View>
      </View>

      <View style={styles.playersSection}>
        <Text style={styles.playersSectionTitle}>Joueurs</Text>
        <View style={styles.playersList}>
          {item.players.map((player, index) => (
            <View key={player.id} style={styles.playerRow}>
              <View style={styles.playerLeft}>
                <View style={[styles.playerDot, { backgroundColor: player.color }]} />
                <Text style={styles.playerName}>
                  {player.name}
                  {player.isAI && ' 🤖'}
                </Text>
              </View>
              <Text style={styles.playerScore}>{player.score}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.gameFooter}>
        <View style={styles.gameInfo}>
          <Text style={styles.gameInfoLabel}>⏱️ Durée</Text>
          <Text style={styles.gameInfoValue}>{formatDuration(item.duration)}</Text>
        </View>
        <View style={styles.gameInfo}>
          <Text style={styles.gameInfoLabel}>🎯 Tours</Text>
          <Text style={styles.gameInfoValue}>{item.totalTurns}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Retour</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Historique</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Content */}
        {loading ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Chargement...</Text>
          </View>
        ) : games.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>📊</Text>
            <Text style={styles.emptyTitle}>Aucune partie</Text>
            <Text style={styles.emptySubtitle}>
              Les parties terminées apparaîtront ici
            </Text>
          </View>
        ) : (
          <FlatList
            data={games}
            renderItem={renderGameItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8ECF0',
  },
  backButton: {
    paddingVertical: 8,
    paddingRight: 16,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A90E2',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  headerRight: {
    width: 70,
  },
  listContent: {
    padding: 16,
  },
  gameCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  gameHeaderLeft: {
    flex: 1,
  },
  gameName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  gameDate: {
    fontSize: 13,
    color: '#7F8C8D',
  },
  deleteButton: {
    padding: 4,
  },
  deleteButtonText: {
    fontSize: 20,
  },
  winnerSection: {
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FFE082',
  },
  winnerLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F39C12',
    marginBottom: 6,
  },
  winnerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  winnerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  winnerScore: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F39C12',
  },
  playersSection: {
    marginBottom: 16,
  },
  playersSectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7F8C8D',
    marginBottom: 8,
  },
  playersList: {
    gap: 8,
  },
  playerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  playerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  playerName: {
    fontSize: 14,
    color: '#1A1A1A',
  },
  playerScore: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A90E2',
  },
  gameFooter: {
    flexDirection: 'row',
    gap: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  gameInfo: {
    flex: 1,
  },
  gameInfoLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginBottom: 4,
  },
  gameInfoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#7F8C8D',
  },
});

export default HistoryScreen;
