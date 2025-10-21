import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import StatCard from '../components/StatCard';

const StatsShowcase = () => {
  const stats = [
    {
      id: 'users',
      emoji: '👥',
      gradientColors: ['#4A90E2', '#5DADE2'],
      value: '10K+',
      label: 'Joueurs actifs',
      trend: { value: '+15%', period: 'ce mois' },
    },
    {
      id: 'games',
      emoji: '🎲',
      gradientColors: ['#50C878', '#3FA065'],
      value: '50K+',
      label: 'Parties jouées',
      trend: { value: '+200', period: 'par jour' },
    },
    {
      id: 'rating',
      emoji: '⭐',
      gradientColors: ['#FFD700', '#FFA500'],
      value: '4.9',
      label: 'Note moyenne',
    },
    {
      id: 'reviews',
      emoji: '💬',
      gradientColors: ['#9B59B6', '#8E44AD'],
      value: '2K+',
      label: 'Avis positifs',
      trend: { value: '98%', period: 'satisfaction' },
    },
    {
      id: 'achievements',
      emoji: '🏆',
      gradientColors: ['#FF6B6B', '#FF8E53'],
      value: '75K+',
      label: 'Badges débloqués',
    },
    {
      id: 'countries',
      emoji: '🌍',
      gradientColors: ['#00BCD4', '#0097A7'],
      value: '45+',
      label: 'Pays',
      trend: { value: 'Mondial', period: '🗺️' },
    },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(74,144,226,0.05)', 'rgba(80,200,120,0.05)']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.sectionTitle}>L'App en Chiffres 📊</Text>

        <View style={styles.grid}>
          {stats.map((stat) => (
            <View key={stat.id} style={styles.gridItem}>
              <StatCard
                emoji={stat.emoji}
                gradientColors={stat.gradientColors}
                value={stat.value}
                label={stat.label}
                trend={stat.trend}
              />
            </View>
          ))}
        </View>

        <Text style={styles.footer}>Mis à jour en temps réel 🔄</Text>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  gradient: {
    borderRadius: 24,
    padding: 24,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 16,
  },
  gridItem: {
    width: '47%',
  },
  footer: {
    fontSize: 13,
    color: '#999999',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default StatsShowcase;
