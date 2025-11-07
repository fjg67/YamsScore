import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ProgressionService } from '../../services/ProgressionService';
import { PlayerProfile } from '../../types/progression';

interface StatsScreenProps {
  onBack?: () => void;
}

export const StatsScreen: React.FC<StatsScreenProps> = ({ onBack }) => {
  const [profile, setProfile] = useState<PlayerProfile | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const service = ProgressionService.getInstance();
    const data = await service.getProfile();
    setProfile(data);
  };

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  const winRate = profile.stats.gamesPlayed > 0
    ? ((profile.stats.gamesWon / profile.stats.gamesPlayed) * 100).toFixed(1)
    : '0';

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#141E30', '#243B55']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Bouton Retour Premium */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
            style={styles.backButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.backButtonIcon}>←</Text>
            <Text style={styles.backButtonText}>Retour</Text>
          </LinearGradient>
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.iconGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.icon}>📊</Text>
            </LinearGradient>
            <Text style={styles.title}>Statistiques</Text>
            <Text style={styles.subtitle}>Vos performances</Text>
          </View>

          {/* Stats principales */}
          <View style={styles.mainStats}>
            <StatCard
              icon="🎮"
              value={profile.stats.gamesPlayed.toString()}
              label="Parties jouées"
              colors={['#4facfe', '#00f2fe']}
            />
            <StatCard
              icon="🏆"
              value={profile.stats.gamesWon.toString()}
              label="Victoires"
              colors={['#43e97b', '#38f9d7']}
            />
            <StatCard
              icon="📈"
              value={`${winRate}%`}
              label="Taux de victoire"
              colors={['#fa709a', '#fee140']}
            />
            <StatCard
              icon="🎲"
              value={profile.stats.yamsScored.toString()}
              label="Yams réalisés"
              colors={['#a8edea', '#fed6e3']}
            />
          </View>

          {/* Scores */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎯 Scores</Text>
            <View style={styles.scoreCard}>
              <LinearGradient
                colors={['rgba(102, 126, 234, 0.2)', 'rgba(118, 75, 162, 0.2)']}
                style={styles.scoreGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.scoreRow}>
                  <Text style={styles.scoreLabel}>Score total</Text>
                  <Text style={styles.scoreValue}>{profile.stats.totalScore.toLocaleString()}</Text>
                </View>
                <View style={styles.scoreRow}>
                  <Text style={styles.scoreLabel}>Meilleur score</Text>
                  <Text style={styles.scoreValueHighlight}>{profile.stats.highestScore}</Text>
                </View>
                <View style={styles.scoreRow}>
                  <Text style={styles.scoreLabel}>Parties parfaites</Text>
                  <Text style={styles.scoreValue}>{profile.stats.perfectGames}</Text>
                </View>
              </LinearGradient>
            </View>
          </View>

          {/* Progression */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⭐ Progression</Text>
            <View style={styles.progressionCard}>
              <LinearGradient
                colors={['rgba(250, 112, 154, 0.2)', 'rgba(254, 225, 64, 0.2)']}
                style={styles.progressionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.progressionRow}>
                  <Text style={styles.progressionLabel}>Niveau actuel</Text>
                  <Text style={styles.progressionValue}>{profile.level.level}</Text>
                </View>
                <View style={styles.progressionRow}>
                  <Text style={styles.progressionLabel}>XP total</Text>
                  <Text style={styles.progressionValue}>{profile.level.totalXP.toLocaleString()}</Text>
                </View>
                <View style={styles.progressionRow}>
                  <Text style={styles.progressionLabel}>Achievements</Text>
                  <Text style={styles.progressionValue}>
                    {profile.achievements.filter(a => a.completed).length} / 110
                  </Text>
                </View>
                <View style={styles.progressionRow}>
                  <Text style={styles.progressionLabel}>Quêtes complétées</Text>
                  <Text style={styles.progressionValue}>{profile.questsCompleted}</Text>
                </View>
                <View style={styles.progressionRow}>
                  <Text style={styles.progressionLabel}>Coins</Text>
                  <Text style={styles.progressionValueGold}>{profile.coins.toLocaleString()}</Text>
                </View>
              </LinearGradient>
            </View>
          </View>

          {/* Message de motivation */}
          <View style={styles.motivationBox}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.motivationGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.motivationText}>
                {profile.stats.gamesWon > 100
                  ? "🎉 Champion confirmé ! Continue sur ta lancée !"
                  : profile.stats.gamesWon > 50
                  ? "💪 Excellent travail ! Tu progresses bien !"
                  : profile.stats.gamesWon > 10
                  ? "🔥 Tu es sur la bonne voie !"
                  : "🚀 C'est parti pour l'aventure !"}
              </Text>
            </LinearGradient>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

const StatCard: React.FC<{
  icon: string;
  value: string;
  label: string;
  colors: string[];
}> = ({ icon, value, label, colors }) => (
  <View style={styles.statCard}>
    <LinearGradient
      colors={colors}
      style={styles.statGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </LinearGradient>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  backButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  backButtonIcon: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 6,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    padding: 20,
    paddingTop: 120,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  iconGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  icon: {
    fontSize: 50,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.7)',
  },
  mainStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    width: '48%',
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  statGradient: {
    padding: 20,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  scoreCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  scoreGradient: {
    padding: 20,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  scoreLabel: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  scoreValueHighlight: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4ade80',
  },
  progressionCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  progressionGradient: {
    padding: 20,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
  },
  progressionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressionLabel: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
  },
  progressionValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  progressionValueGold: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  motivationBox: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 10,
  },
  motivationGradient: {
    padding: 20,
    alignItems: 'center',
  },
  motivationText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
});
