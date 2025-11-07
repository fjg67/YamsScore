import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const FloatingParticle = ({ delay = 0 }: { delay?: number }) => {
  const translateY = React.useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const translateX = React.useRef(new Animated.Value(Math.random() * SCREEN_WIDTH)).current;
  const opacity = React.useRef(new Animated.Value(0)).current;
  const scale = React.useRef(new Animated.Value(0.5 + Math.random() * 0.5)).current;
  React.useEffect(() => {
    const animate = () => {
      translateY.setValue(SCREEN_HEIGHT); translateX.setValue(Math.random() * SCREEN_WIDTH); opacity.setValue(0);
      Animated.sequence([Animated.delay(delay), Animated.parallel([Animated.timing(translateY, { toValue: -100, duration: 8000 + Math.random() * 4000, useNativeDriver: true }), Animated.timing(opacity, { toValue: 0.15 + Math.random() * 0.15, duration: 1000, useNativeDriver: true }), Animated.timing(scale, { toValue: 0.8 + Math.random() * 0.4, duration: 1000, useNativeDriver: true })]), Animated.timing(opacity, { toValue: 0, duration: 1000, useNativeDriver: true })]).start(() => animate());
    }; animate();
  }, [delay, translateY, translateX, opacity, scale]);
  return <Animated.View style={[styles.particle, { transform: [{ translateX }, { translateY }, { scale }], opacity }]} />;
};

interface PrestigeScreenProps {
  onBack?: () => void;
}

export const PrestigeScreen: React.FC<PrestigeScreenProps> = ({ onBack }) => {
  const rotateAnim = React.useRef(new Animated.Value(0)).current;
  const glowAnim = React.useRef(new Animated.Value(0.3)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 10000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  React.useEffect(() => {
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

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#667eea', '#764ba2', '#f093fb', '#4facfe']} style={StyleSheet.absoluteFillObject} />
      <Animated.View style={[styles.glowEffect, { opacity: glowAnim }]} />
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        {Array.from({ length: 20 }).map((_, i) => <FloatingParticle key={i} delay={i * 200} />)}
      </View>
      <View style={styles.gradient}>
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
          {/* Icon rotatif avec glow */}
          <View style={styles.iconContainer}>
            <Animated.View style={{ transform: [{ rotate }] }}>
              <LinearGradient
                colors={['#ffecd2', '#fcb69f']}
                style={styles.iconGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.icon}>👑</Text>
              </LinearGradient>
            </Animated.View>
          </View>

          <Text style={styles.title}>Système Prestige</Text>
          <Text style={styles.subtitle}>10 niveaux de prestige</Text>

          <View style={styles.infoBox}>
            <LinearGradient
              colors={['rgba(255, 236, 210, 0.2)', 'rgba(252, 182, 159, 0.2)']}
              style={styles.infoGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.infoTitle}>⚡ Reset pour la puissance</Text>
              <Text style={styles.infoText}>
                • Niveau 50 requis pour prestige{'\n'}
                • Reset niveau → Boost XP permanent{'\n'}
                • 10 niveaux : Bronze → Ultimate{'\n'}
                • Boost XP jusqu'à 2.0x{'\n'}
                • Bordures et emotes exclusifs
              </Text>
            </LinearGradient>
          </View>

          {/* Preview des niveaux de prestige */}
          <View style={styles.prestigeLevels}>
            <Text style={styles.levelsTitle}>Niveaux de Prestige</Text>

            <PrestigeLevel icon="🥉" name="Bronze" boost="1.1x" color={['#CD7F32', '#8B5A00']} />
            <PrestigeLevel icon="🥈" name="Silver" boost="1.2x" color={['#C0C0C0', '#808080']} />
            <PrestigeLevel icon="🥇" name="Gold" boost="1.3x" color={['#FFD700', '#FFA500']} />
            <PrestigeLevel icon="💎" name="Platinum" boost="1.4x" color={['#E5E4E2', '#B8B8B8']} />
            <PrestigeLevel icon="💠" name="Diamond" boost="1.5x" color={['#B9F2FF', '#4FC3F7']} />
            <PrestigeLevel icon="⚡" name="Master" boost="1.6x" color={['#FFD700', '#FF8C00']} />
            <PrestigeLevel icon="🌟" name="Grandmaster" boost="1.7x" color={['#FF69B4', '#FF1493']} />
            <PrestigeLevel icon="🔥" name="Challenger" boost="1.8x" color={['#FF4500', '#DC143C']} />
            <PrestigeLevel icon="🌌" name="Cosmic" boost="1.9x" color={['#9400D3', '#4B0082']} />
            <PrestigeLevel icon="👁️" name="ULTIMATE" boost="2.0x" color={['#FF00FF', '#8B008B']} />
          </View>

          <LinearGradient
            colors={['#ffecd2', '#fcb69f']}
            style={styles.comingSoonButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.comingSoonText}>🔒 En développement</Text>
          </LinearGradient>
        </ScrollView>
      </View>
    </View>
  );
};

const PrestigeLevel: React.FC<{
  icon: string;
  name: string;
  boost: string;
  color: string[];
}> = ({ icon, name, boost, color }) => (
  <View style={styles.prestigeCard}>
    <LinearGradient
      colors={color}
      style={styles.prestigeGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={styles.prestigeIcon}>{icon}</Text>
      <View style={styles.prestigeInfo}>
        <Text style={styles.prestigeName}>{name}</Text>
        <Text style={styles.prestigeBoost}>XP Boost: {boost}</Text>
      </View>
      <View style={styles.lockBadge}>
        <Text style={styles.lockIcon}>🔒</Text>
      </View>
    </LinearGradient>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  gradient: {
    flex: 1,
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
    alignItems: 'center',
    padding: 20,
    paddingTop: 120,
  },
  iconContainer: {
    marginBottom: 20,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ffecd2',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  icon: {
    fontSize: 64,
  },
  title: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 30,
  },
  infoBox: {
    width: '100%',
    marginBottom: 30,
    borderRadius: 20,
    overflow: 'hidden',
  },
  infoGradient: {
    padding: 24,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 28,
  },
  prestigeLevels: {
    width: '100%',
    marginBottom: 30,
  },
  levelsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  prestigeCard: {
    marginBottom: 10,
    borderRadius: 14,
    overflow: 'hidden',
  },
  prestigeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  prestigeIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  prestigeInfo: {
    flex: 1,
  },
  prestigeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  prestigeBoost: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
  },
  lockBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockIcon: {
    fontSize: 16,
  },
  comingSoonButton: {
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 30,
    shadowColor: '#ffecd2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  comingSoonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});
