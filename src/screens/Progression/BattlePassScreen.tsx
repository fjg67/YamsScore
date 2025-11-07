import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
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

interface BattlePassScreenProps { onBack?: () => void; }

export const BattlePassScreen: React.FC<BattlePassScreenProps> = ({ onBack }) => {
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const glowAnim = React.useRef(new Animated.Value(0.3)).current;
  React.useEffect(() => { Animated.loop(Animated.sequence([Animated.timing(pulseAnim, { toValue: 1.05, duration: 1500, useNativeDriver: true }), Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: true })])).start(); }, []);
  React.useEffect(() => { const pulse = () => { Animated.sequence([Animated.timing(glowAnim, { toValue: 0.6, duration: 2000, useNativeDriver: true }), Animated.timing(glowAnim, { toValue: 0.3, duration: 2000, useNativeDriver: true })]).start(() => pulse()); }; pulse(); }, [glowAnim]);

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

        {/* Contenu principal */}
        <View style={styles.content}>
          <Animated.View style={[styles.iconContainer, { transform: [{ scale: pulseAnim }] }]}>
            <LinearGradient
              colors={['#fa709a', '#fee140']}
              style={styles.iconGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.icon}>🎫</Text>
            </LinearGradient>
          </Animated.View>

          <Text style={styles.title}>Battle Pass</Text>
          <Text style={styles.subtitle}>Saison 1</Text>

          <View style={styles.infoBox}>
            <LinearGradient
              colors={['rgba(250, 112, 154, 0.2)', 'rgba(254, 225, 64, 0.2)']}
              style={styles.infoGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.infoTitle}>🚀 Bientôt disponible !</Text>
              <Text style={styles.infoText}>
                • 50 paliers de récompenses{'\n'}
                • Version gratuite + premium{'\n'}
                • Skins, emotes, et badges exclusifs{'\n'}
                • Défis hebdomadaires{'\n'}
                • Récompenses légendaires
              </Text>
            </LinearGradient>
          </View>

          <View style={styles.featureContainer}>
            <FeatureCard
              icon="🎁"
              title="Récompenses"
              description="50 paliers à débloquer"
              colors={['#667eea', '#764ba2']}
            />
            <FeatureCard
              icon="⭐"
              title="XP Boosts"
              description="Multiplicateurs exclusifs"
              colors={['#f093fb', '#f5576c']}
            />
          </View>

          <LinearGradient
            colors={['#fa709a', '#fee140']}
            style={styles.comingSoonButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.comingSoonText}>🔒 En développement</Text>
          </LinearGradient>
        </View>
      </View>
    </View>
  );
};

const FeatureCard: React.FC<{
  icon: string;
  title: string;
  description: string;
  colors: string[];
}> = ({ icon, title, description, colors }) => (
  <View style={styles.featureCard}>
    <LinearGradient
      colors={colors}
      style={styles.featureGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={styles.featureIcon}>{icon}</Text>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  iconContainer: {
    marginBottom: 20,
  },
  iconGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#fa709a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  icon: {
    fontSize: 64,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 24,
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
    fontSize: 22,
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
  featureContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 30,
  },
  featureCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  featureGradient: {
    padding: 20,
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  comingSoonButton: {
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 30,
    shadowColor: '#fa709a',
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
