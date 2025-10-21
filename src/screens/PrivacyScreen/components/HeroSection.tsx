import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {LinearGradient} from 'react-native-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import {useEffect} from 'react';

export const HeroSection: React.FC = () => {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, {duration: 2000}),
        withTiming(1, {duration: 2000}),
      ),
      -1,
      false,
    );
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  return (
    <LinearGradient
      colors={['#4A90E2', '#5E3AEE', '#50C878']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={styles.container}>
      {/* Shield Background */}
      <Animated.View style={[styles.shieldContainer, animatedStyle]}>
        <Text style={styles.shieldIcon}>🔒</Text>
      </Animated.View>

      {/* Title */}
      <Text style={styles.title}>Ta Vie Privée, Notre Priorité</Text>
      <Text style={styles.tagline}>Transparence totale sur tes données</Text>

      {/* Trust Badges */}
      <View style={styles.badgesContainer}>
        <View style={[styles.badge, {backgroundColor: 'rgba(80,200,120,0.3)'}]}>
          <Text style={styles.badgeText}>✅ RGPD Compliant</Text>
        </View>
        <View style={[styles.badge, {backgroundColor: 'rgba(74,144,226,0.3)'}]}>
          <Text style={styles.badgeText}>🔐 Données Chiffrées</Text>
        </View>
        <View style={[styles.badge, {backgroundColor: 'rgba(255,107,107,0.3)'}]}>
          <Text style={styles.badgeText}>🚫 Zéro Vente</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 240,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  shieldContainer: {
    width: 120,
    height: 120,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
    marginBottom: 16,
  },
  shieldIcon: {
    fontSize: 60,
  },
  title: {
    fontFamily: 'SF Pro Display',
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 8,
    marginBottom: 8,
  },
  tagline: {
    fontFamily: 'SF Pro Text',
    fontSize: 17,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 20,
  },
  badgesContainer: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  badge: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  badgeText: {
    fontFamily: 'SF Pro Text',
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
