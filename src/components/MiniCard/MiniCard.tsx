/**
 * Mini Card pour Stats & Règles
 * Design glassmorphism compact
 */

import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';

interface MiniCardProps {
  emoji: string;
  title: string;
  subtitle: string;
  accentColor: string;
  onPress: () => void;
  testID?: string;
}

export const MiniCard: React.FC<MiniCardProps> = ({
  emoji,
  title,
  subtitle,
  accentColor,
  onPress,
  testID,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const emojiScale = useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    // Animation de bounce de l'emoji
    Animated.loop(
      Animated.sequence([
        Animated.timing(emojiScale, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(emojiScale, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [emojiScale]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      friction: 3,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 3,
    }).start();
  };

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
        flex: 1,
      }}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        testID={testID}
        activeOpacity={1}
        accessible={true}
        accessibilityLabel={title}
        accessibilityRole="button"
      >
        <View style={styles.card}>
          {/* Glassmorphism background */}
          <View style={styles.glassBackground} />

          {/* Accent bar */}
          <View
            style={[
              styles.accentBar,
              {
                backgroundColor: accentColor,
              },
            ]}
          />

          {/* Content */}
          <View style={styles.content}>
            <Animated.Text
              style={[
                styles.emoji,
                {
                  transform: [{ scale: emojiScale }],
                },
              ]}
            >
              {emoji}
            </Animated.Text>

            <View style={styles.textContainer}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subtitle}>{subtitle}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 90,
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: 4,
  },
  glassBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
  },
  accentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
});
