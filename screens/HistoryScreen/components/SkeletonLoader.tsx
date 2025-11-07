import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';

const SkeletonLoader: React.FC = () => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const SkeletonCard = () => (
    <View style={styles.card}>
      <Animated.View style={[styles.line, styles.lineTitle, { opacity: shimmerOpacity }]} />
      <Animated.View style={[styles.line, styles.lineSubtitle, { opacity: shimmerOpacity }]} />

      <View style={styles.spacing} />

      <Animated.View style={[styles.line, styles.lineWinner, { opacity: shimmerOpacity }]} />

      <View style={styles.spacing} />

      <Animated.View style={[styles.line, styles.linePlayer, { opacity: shimmerOpacity }]} />
      <Animated.View style={[styles.line, styles.linePlayer, { opacity: shimmerOpacity }]} />

      <View style={styles.spacing} />

      <View style={styles.footer}>
        <Animated.View style={[styles.line, styles.lineStat, { opacity: shimmerOpacity }]} />
        <Animated.View style={[styles.line, styles.lineStat, { opacity: shimmerOpacity }]} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 12,
  },
  card: {
    padding: 20,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  line: {
    height: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 8,
    marginBottom: 8,
  },
  lineTitle: {
    width: '60%',
    height: 20,
  },
  lineSubtitle: {
    width: '40%',
    height: 14,
  },
  lineWinner: {
    width: '100%',
    height: 60,
    borderRadius: 16,
  },
  linePlayer: {
    width: '100%',
    height: 40,
    borderRadius: 12,
  },
  lineStat: {
    width: '40%',
    height: 14,
  },
  spacing: {
    height: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
});

export default SkeletonLoader;
