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

interface BadgesScreenProps { onBack?: () => void; }

export const BadgesScreen: React.FC<BadgesScreenProps> = ({ onBack }) => {
  const floatAnim = React.useRef(new Animated.Value(0)).current;
  const glowAnim = React.useRef(new Animated.Value(0.3)).current;
  React.useEffect(() => { Animated.loop(Animated.sequence([Animated.timing(floatAnim, { toValue: -10, duration: 2000, useNativeDriver: true }), Animated.timing(floatAnim, { toValue: 0, duration: 2000, useNativeDriver: true })])).start(); }, []);
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

        <ScrollView contentContainerStyle={styles.content}>
          <Animated.View style={[styles.iconContainer, { transform: [{ translateY: floatAnim }] }]}>
            <LinearGradient
              colors={['#a8edea', '#fed6e3']}
              style={styles.iconGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.icon}>🎖️</Text>
            </LinearGradient>
          </Animated.View>

          <Text style={styles.title}>Collection de Badges</Text>
          <Text style={styles.subtitle}>45 badges à débloquer</Text>

          <View style={styles.infoBox}>
            <LinearGradient
              colors={['rgba(168, 237, 234, 0.2)', 'rgba(254, 214, 227, 0.2)']}
              style={styles.infoGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.infoTitle}>🏆 Système de badges premium</Text>
              <Text style={styles.infoText}>
                • Badges de maîtrise{'\n'}
                • Badges d'événements{'\n'}
                • Badges de prestige (1-10){'\n'}
                • Badges secrets{'\n'}
                • Affichage sur profil
              </Text>
            </LinearGradient>
          </View>

          {/* Preview des catégories */}
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>Catégories de badges</Text>

            <BadgeCategory
              icon="🏅"
              title="Maîtrise"
              count="15"
              colors={['#4facfe', '#00f2fe']}
            />
            <BadgeCategory
              icon="🎯"
              title="Achievements"
              count="12"
              colors={['#43e97b', '#38f9d7']}
            />
            <BadgeCategory
              icon="🎉"
              title="Événements"
              count="8"
              colors={['#fa709a', '#fee140']}
            />
            <BadgeCategory
              icon="👑"
              title="Prestige"
              count="10"
              colors={['#667eea', '#764ba2']}
            />
          </View>

          <LinearGradient
            colors={['#a8edea', '#fed6e3']}
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

const BadgeCategory: React.FC<{
  icon: string;
  title: string;
  count: string;
  colors: string[];
}> = ({ icon, title, count, colors }) => (
  <View style={styles.categoryCard}>
    <LinearGradient
      colors={colors}
      style={styles.categoryGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={styles.categoryIcon}>{icon}</Text>
      <View style={styles.categoryInfo}>
        <Text style={styles.categoryName}>{title}</Text>
        <Text style={styles.categoryCount}>{count} badges</Text>
      </View>
    </LinearGradient>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0e27' },
  glowEffect: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255, 255, 255, 0.1)' },
  particle: { position: 'absolute', width: 4, height: 4, borderRadius: 2, backgroundColor: '#fff' },
  gradient: { flex: 1 },
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
  },
  iconGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#a8edea',
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
  categoryContainer: {
    width: '100%',
    marginBottom: 30,
  },
  categoryTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  categoryCard: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  categoryGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  categoryIcon: {
    fontSize: 40,
    marginRight: 16,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  categoryCount: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
  },
  comingSoonButton: {
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 30,
    shadowColor: '#a8edea',
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
