import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { ProgressionService } from '../../services/ProgressionService';
import { PlayerProfile } from '../../types/progression';
import LinearGradient from 'react-native-linear-gradient';

const { width, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SCREEN_WIDTH = width;

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

interface ProgressionScreenProps {
  navigation: any;
  onBack?: () => void;
}

export const ProgressionScreen: React.FC<ProgressionScreenProps> = ({ navigation, onBack }) => {
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const glowAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    const pulse = () => {
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
      ]).start(() => pulse());
    };
    pulse();
  }, [glowAnim]);

  const loadProfile = async () => {
    const service = ProgressionService.getInstance();
    const data = await service.getProfile();
    setProfile(data);
    setLoading(false);
  };

  if (loading || !profile) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#667eea', '#764ba2', '#f093fb', '#4facfe']}
          style={StyleSheet.absoluteFillObject}
        />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  const xpPercentage = (profile.level.currentXP / profile.level.xpToNextLevel) * 100;
  const prestigeInfo = ProgressionService.getInstance().getPrestigeInfo(
    profile.prestige.currentPrestige
  );

  return (
    <View style={styles.fullContainer}>
      {/* Gradient Background */}
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb', '#4facfe']}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Glow Effect */}
      <Animated.View
        style={[
          styles.glowEffect,
          {
            opacity: glowAnim,
          },
        ]}
      />

      {/* Floating Particles */}
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        {Array.from({ length: 20 }).map((_, i) => (
          <FloatingParticle key={i} delay={i * 200} />
        ))}
      </View>

      <ScrollView style={styles.container}>
        {/* Header avec niveau et prestige */}
        <View style={styles.header}>
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

          <View style={styles.headerContent}>
          <View style={styles.levelContainer}>
            <Text style={styles.levelText}>Niveau {profile.level.level}</Text>
            {profile.prestige.currentPrestige > 0 && prestigeInfo && (
              <View style={styles.prestigeContainer}>
                <Text style={styles.prestigeIcon}>{prestigeInfo.icon}</Text>
                <Text style={styles.prestigeText}>{prestigeInfo.name}</Text>
              </View>
            )}
          </View>

          {/* Barre XP */}
          <View style={styles.xpBarContainer}>
            <View style={styles.xpBarBackground}>
              <View style={[styles.xpBarFill, { width: `${xpPercentage}%` }]} />
            </View>
            <Text style={styles.xpText}>
              {profile.level.currentXP} / {profile.level.xpToNextLevel} XP
            </Text>
          </View>

          {/* Stats rapides */}
          <View style={styles.quickStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{profile.coins}</Text>
              <Text style={styles.statLabel}>Coins</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{profile.achievementPoints}</Text>
              <Text style={styles.statLabel}>Achievement Points</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{profile.stats.gamesWon}</Text>
              <Text style={styles.statLabel}>Victoires</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Menu de navigation */}
      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={styles.menuCard}
          onPress={() => navigation.navigate('Quests', { profile })}
        >
          <LinearGradient colors={['#f093fb', '#f5576c']} style={styles.menuGradient}>
            <Text style={styles.menuIcon}>📜</Text>
            <Text style={styles.menuTitle}>Quêtes</Text>
            <Text style={styles.menuSubtitle}>
              {profile.dailyQuests.filter((q) => !q.completed).length} actives
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuCard}
          onPress={() => navigation.navigate('Achievements', { profile })}
        >
          <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.menuGradient}>
            <Text style={styles.menuIcon}>🏅</Text>
            <Text style={styles.menuTitle}>Achievements</Text>
            <Text style={styles.menuSubtitle}>
              {profile.achievements.filter((a) => a.completed).length} / 110
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuCard}
          onPress={() => navigation.navigate('BattlePass', { profile })}
        >
          <LinearGradient colors={['#fa709a', '#fee140']} style={styles.menuGradient}>
            <Text style={styles.menuIcon}>🎫</Text>
            <Text style={styles.menuTitle}>Battle Pass</Text>
            <Text style={styles.menuSubtitle}>
              Niveau {profile.battlePass.currentTier} / {profile.battlePass.maxTier}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuCard}
          onPress={() => navigation.navigate('Badges', { profile })}
        >
          <LinearGradient colors={['#a8edea', '#fed6e3']} style={styles.menuGradient}>
            <Text style={styles.menuIcon}>🎖️</Text>
            <Text style={styles.menuTitle}>Badges</Text>
            <Text style={styles.menuSubtitle}>
              {profile.unlockedBadges.length} débloqués
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuCard}
          onPress={() => navigation.navigate('Prestige', { profile })}
          disabled={!profile.prestige.canPrestige}
        >
          <LinearGradient
            colors={
              profile.prestige.canPrestige
                ? ['#ffecd2', '#fcb69f']
                : ['#d3d3d3', '#a9a9a9']
            }
            style={styles.menuGradient}
          >
            <Text style={styles.menuIcon}>👑</Text>
            <Text style={styles.menuTitle}>Prestige</Text>
            <Text style={styles.menuSubtitle}>
              {profile.prestige.canPrestige
                ? 'DISPONIBLE !'
                : `Niveau ${profile.prestige.nextPrestigeAt}`}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuCard}
          onPress={() => navigation.navigate('Stats', { profile })}
        >
          <LinearGradient colors={['#667eea', '#764ba2']} style={styles.menuGradient}>
            <Text style={styles.menuIcon}>📊</Text>
            <Text style={styles.menuTitle}>Statistiques</Text>
            <Text style={styles.menuSubtitle}>{profile.stats.gamesPlayed} parties</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Multiplicateurs actifs */}
      {profile.activeMultipliers.length > 0 && (
        <View style={styles.multiplierSection}>
          <Text style={styles.sectionTitle}>⚡ Multiplicateurs Actifs</Text>
          {profile.activeMultipliers.map((mult, index) => (
            <View key={index} style={styles.multiplierCard}>
              <Text style={styles.multiplierName}>{mult.name}</Text>
              <Text style={styles.multiplierValue}>x{mult.multiplier}</Text>
            </View>
          ))}
        </View>
      )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    backgroundColor: '#0a0e27',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  glowEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#fff',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderTopWidth: 0,
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
    letterSpacing: 0.5,
  },
  headerContent: {
    alignItems: 'center',
  },
  levelContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  levelText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  prestigeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  prestigeIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  prestigeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  xpBarContainer: {
    width: '100%',
    alignItems: 'center',
  },
  xpBarBackground: {
    width: '100%',
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  xpBarFill: {
    height: '100%',
    backgroundColor: '#4ade80',
    borderRadius: 12,
  },
  xpText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 8,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  menuContainer: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuCard: {
    width: (width - 48) / 2,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  menuGradient: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 140,
  },
  menuIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  menuTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  menuSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  multiplierSection: {
    padding: 16,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  multiplierCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  multiplierName: {
    color: '#fff',
    fontSize: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  multiplierValue: {
    color: '#4ade80',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
