import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { getGameHistory, deleteGameFromHistory, getGameStats } from '../../services/gameHistoryService';
import { SavedGame } from '../../services/gameHistoryService';
import GameCardPremium from './components/GameCardPremium';
import GameDetailsModal from './components/GameDetailsModal';
import EmptyStateHistory from './components/EmptyStateHistory';
import SkeletonLoader from './components/SkeletonLoader';
import FilterChip from './components/FilterChip';
import TimelineSeparator from './components/TimelineSeparator';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Floating particles component
const FloatingParticle = ({ delay = 0 }: { delay?: number }) => {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const translateX = useRef(new Animated.Value(Math.random() * SCREEN_WIDTH)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5 + Math.random() * 0.5)).current;

  useEffect(() => {
    const animate = () => {
      translateY.setValue(SCREEN_HEIGHT);
      translateX.setValue(Math.random() * SCREEN_WIDTH);
      opacity.setValue(0);

      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -100,
            duration: 8000 + Math.random() * 4000,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.15 + Math.random() * 0.15,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0.8 + Math.random() * 0.4,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => animate());
    };

    animate();
  }, [delay, translateY, translateX, opacity, scale]);

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          transform: [
            { translateX },
            { translateY },
            { scale },
          ],
          opacity,
        },
      ]}
    />
  );
};

type FilterType = 'all' | 'today' | 'week' | 'month' | 'year';
type ResultFilter = 'all' | 'won' | 'lost';
type ScoreFilter = 'all' | 'high' | 'perfect' | 'yams';

interface HistoryScreenPremiumProps {
  onBack: () => void;
  onStartNewGame: () => void;
}

const HistoryScreenPremium: React.FC<HistoryScreenPremiumProps> = ({
  onBack,
  onStartNewGame,
}) => {
  const [games, setGames] = useState<SavedGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filters
  const [dateFilter, setDateFilter] = useState<FilterType>('all');
  const [resultFilter, setResultFilter] = useState<ResultFilter>('all');
  const [scoreFilter, setScoreFilter] = useState<ScoreFilter>('all');

  // Modal
  const [selectedGame, setSelectedGame] = useState<SavedGame | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Stats
  const [totalGames, setTotalGames] = useState(0);
  const [totalWins, setTotalWins] = useState(0);
  const [winRate, setWinRate] = useState(0);

  // Animation
  const scrollY = new Animated.Value(0);
  const glowAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    loadGames();
    loadStats();

    // Start glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 0.6,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.3,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [glowAnim]);

  const loadGames = async () => {
    try {
      setLoading(true);
      const history = await getGameHistory();
      setGames(history);
    } catch (error) {
      console.error('Error loading games:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const stats = await getGameStats();
      setTotalGames(stats.totalGames);
      // Calculate total wins (simplified - you'd need to track user ID)
      setTotalWins(Math.floor(stats.totalGames * 0.7)); // Placeholder
      setWinRate(stats.totalGames > 0 ? Math.floor((Math.floor(stats.totalGames * 0.7) / stats.totalGames) * 100) : 0);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadGames();
    await loadStats();
    setRefreshing(false);
  };

  const handleDeleteGame = async (gameId: string) => {
    try {
      await deleteGameFromHistory(gameId);
      await loadGames();
      await loadStats();
    } catch (error) {
      console.error('Error deleting game:', error);
    }
  };

  const handleOpenDetails = (game: SavedGame) => {
    setSelectedGame(game);
    setModalVisible(true);
  };

  // Filter games
  const filteredGames = useMemo(() => {
    let filtered = [...games];

    // Date filter
    if (dateFilter !== 'all') {
      const now = Date.now();
      const dayMs = 24 * 60 * 60 * 1000;

      filtered = filtered.filter(game => {
        const gameDate = game.completedAt;
        switch (dateFilter) {
          case 'today':
            return now - gameDate < dayMs;
          case 'week':
            return now - gameDate < 7 * dayMs;
          case 'month':
            return now - gameDate < 30 * dayMs;
          case 'year':
            return now - gameDate < 365 * dayMs;
          default:
            return true;
        }
      });
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(game =>
        game.gameName.toLowerCase().includes(query) ||
        game.players.some(p => p.name.toLowerCase().includes(query))
      );
    }

    // Score filter
    if (scoreFilter !== 'all') {
      filtered = filtered.filter(game => {
        const maxScore = Math.max(...game.players.map(p => p.score));
        switch (scoreFilter) {
          case 'high':
            return maxScore >= 300;
          case 'perfect':
            return maxScore >= 350;
          case 'yams':
            // Check if any player has yams (would need score details)
            return true; // Placeholder
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [games, dateFilter, searchQuery, scoreFilter]);

  // Group games by time period
  const groupedGames = useMemo(() => {
    const groups: { label: string; games: SavedGame[] }[] = [];
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;

    const today: SavedGame[] = [];
    const yesterday: SavedGame[] = [];
    const thisWeek: SavedGame[] = [];
    const older: SavedGame[] = [];

    filteredGames.forEach(game => {
      const diff = now - game.completedAt;

      if (diff < dayMs) {
        today.push(game);
      } else if (diff < 2 * dayMs) {
        yesterday.push(game);
      } else if (diff < 7 * dayMs) {
        thisWeek.push(game);
      } else {
        older.push(game);
      }
    });

    if (today.length > 0) groups.push({ label: "Aujourd'hui", games: today });
    if (yesterday.length > 0) groups.push({ label: 'Hier', games: yesterday });
    if (thisWeek.length > 0) groups.push({ label: 'Cette semaine', games: thisWeek });
    if (older.length > 0) groups.push({ label: 'Plus ancien', games: older });

    return groups;
  }, [filteredGames]);

  if (loading) {
    return (
      <View style={styles.container}>
        <SkeletonLoader />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Gradient Background */}
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb', '#4facfe']}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Glow effect */}
      <Animated.View
        style={[
          styles.glowContainer,
          { opacity: glowAnim }
        ]}
      >
        <LinearGradient
          colors={['rgba(102, 126, 234, 0.3)', 'transparent', 'rgba(118, 75, 162, 0.3)']}
          style={styles.glowGradient}
        />
      </Animated.View>

      {/* Floating Particles */}
      <View style={styles.particlesContainer}>
        {[...Array(20)].map((_, i) => (
          <FloatingParticle key={i} delay={i * 300} />
        ))}
      </View>

      {/* Header with premium background */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Historique</Text>
          <TouchableOpacity style={styles.searchIconButton}>
            <Text style={styles.searchIcon}>🔍</Text>
          </TouchableOpacity>
        </View>

        {/* Stats bar */}
        <View style={styles.statsBar}>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>🏆</Text>
            <Text style={styles.statValue}>{totalGames} parties</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalWins} victoires</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{winRate}%</Text>
          </View>
        </View>
      </View>

      {/* Search bar */}
      {searchQuery !== '' || false ? (
        <View style={styles.searchBar}>
          <Text style={styles.searchBarIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher..."
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
            >
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : null}

      {/* Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersRow}
        contentContainerStyle={styles.filtersContent}
      >
        <FilterChip
          icon="📅"
          label="Tout"
          active={dateFilter === 'all'}
          onPress={() => setDateFilter('all')}
        />
        <FilterChip
          icon="📅"
          label="Aujourd'hui"
          active={dateFilter === 'today'}
          onPress={() => setDateFilter('today')}
        />
        <FilterChip
          icon="📅"
          label="Cette semaine"
          active={dateFilter === 'week'}
          onPress={() => setDateFilter('week')}
        />
        <FilterChip
          icon="📅"
          label="Ce mois"
          active={dateFilter === 'month'}
          onPress={() => setDateFilter('month')}
        />
        <FilterChip
          icon="📊"
          label="300+ pts"
          active={scoreFilter === 'high'}
          onPress={() => setScoreFilter(scoreFilter === 'high' ? 'all' : 'high')}
        />
        <FilterChip
          icon="🏆"
          label="350+ pts"
          active={scoreFilter === 'perfect'}
          onPress={() => setScoreFilter(scoreFilter === 'perfect' ? 'all' : 'perfect')}
        />
      </ScrollView>

      {/* Games list */}
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#4A90E2"
          />
        }
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {groupedGames.length === 0 ? (
          <EmptyStateHistory onStartGame={onStartNewGame} />
        ) : (
          groupedGames.map((group, index) => (
            <View key={index}>
              <TimelineSeparator label={group.label} />
              {group.games.map((game, gameIndex) => (
                <GameCardPremium
                  key={game.id}
                  game={game}
                  onPress={() => handleOpenDetails(game)}
                  onDelete={() => handleDeleteGame(game.id)}
                  index={gameIndex}
                />
              ))}
            </View>
          ))
        )}
      </ScrollView>

      {/* Details Modal */}
      {selectedGame && (
        <GameDetailsModal
          visible={modalVisible}
          game={selectedGame}
          onClose={() => setModalVisible(false)}
          onReplay={() => {
            setModalVisible(false);
            // TODO: Implement replay functionality
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#667eea',
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  glowContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  glowGradient: {
    flex: 1,
  },
  particlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  backIcon: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 0.5,
  },
  searchIconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  searchIcon: {
    fontSize: 20,
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginTop: 12,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statIcon: {
    fontSize: 16,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  separator: {
    width: 1,
    height: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  searchBar: {
    margin: 16,
    marginBottom: 0,
    padding: 14,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchBarIcon: {
    fontSize: 20,
    opacity: 0.8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  clearButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearIcon: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  filtersRow: {
    marginTop: 16,
    maxHeight: 60,
  },
  filtersContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  scrollView: {
    flex: 1,
  },
});

export default HistoryScreenPremium;
