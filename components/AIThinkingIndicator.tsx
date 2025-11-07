import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Animated,
  StyleSheet
} from "react-native";

interface AIThinkingIndicatorProps {
  visible: boolean;
  message: string;
  difficulty: "easy" | "normal" | "hard";
}

export const AIThinkingIndicator: React.FC<AIThinkingIndicatorProps> = ({
  visible,
  message,
  difficulty
}) => {
  const dot1Opacity = useRef(new Animated.Value(0.3)).current;
  const dot2Opacity = useRef(new Animated.Value(0.3)).current;
  const dot3Opacity = useRef(new Animated.Value(0.3)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Animation d'entrée
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 80,
        friction: 7,
        useNativeDriver: true
      }).start();

      // Animation des points
      const animateDots = () => {
        Animated.loop(
          Animated.stagger(150, [
            Animated.sequence([
              Animated.timing(dot1Opacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true
              }),
              Animated.timing(dot1Opacity, {
                toValue: 0.3,
                duration: 300,
                useNativeDriver: true
              })
            ]),
            Animated.sequence([
              Animated.timing(dot2Opacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true
              }),
              Animated.timing(dot2Opacity, {
                toValue: 0.3,
                duration: 300,
                useNativeDriver: true
              })
            ]),
            Animated.sequence([
              Animated.timing(dot3Opacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true
              }),
              Animated.timing(dot3Opacity, {
                toValue: 0.3,
                duration: 300,
                useNativeDriver: true
              })
            ])
          ])
        ).start();
      };

      animateDots();
    } else {
      // Animation de sortie
      Animated.spring(scaleAnim, {
        toValue: 0,
        tension: 80,
        friction: 7,
        useNativeDriver: true
      }).start();
    }
  }, [visible, dot1Opacity, dot2Opacity, dot3Opacity, scaleAnim]);

  if (!visible) return null;

  const colors = {
    easy: "#50C878",
    normal: "#FFD93D",
    hard: "#FF6B6B"
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: scaleAnim }]
        }
      ]}
    >
      <View style={styles.content}>
        {/* Robot emoji animé */}
        <Text style={styles.robotEmoji}>🤖</Text>

        {/* Message */}
        <Text style={styles.message}>{message}</Text>

        {/* Dots */}
        <View style={styles.dotsContainer}>
          <Animated.View
            style={[
              styles.dot,
              { backgroundColor: colors[difficulty], opacity: dot1Opacity }
            ]}
          />
          <Animated.View
            style={[
              styles.dot,
              { backgroundColor: colors[difficulty], opacity: dot2Opacity }
            ]}
          />
          <Animated.View
            style={[
              styles.dot,
              { backgroundColor: colors[difficulty], opacity: dot3Opacity }
            ]}
          />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: "40%",
    left: "50%",
    marginLeft: -120,
    width: 240,
    zIndex: 1000
  },
  content: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8
  },
  robotEmoji: {
    fontSize: 48,
    marginBottom: 12
  },
  message: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 16,
    textAlign: "center"
  },
  dotsContainer: {
    flexDirection: "row",
    gap: 8
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4
  }
});
