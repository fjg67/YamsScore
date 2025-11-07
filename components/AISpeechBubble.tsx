import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Animated,
  StyleSheet
} from "react-native";

interface AISpeechBubbleProps {
  message: string;
  visible: boolean;
  difficulty: "easy" | "normal" | "hard";
  position?: { x: number; y: number };
}

export const AISpeechBubble: React.FC<AISpeechBubbleProps> = ({
  message,
  visible,
  difficulty,
  position = { x: 100, y: 100 }
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible && message) {
      // Animation d'entrée
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 7,
          useNativeDriver: true
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true
        })
      ]).start();

      // Auto-disparition après 2 secondes
      const timeout = setTimeout(() => {
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true
          }),
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true
          })
        ]).start();
      }, 2000);

      return () => clearTimeout(timeout);
    } else {
      // Animation de sortie
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true
        })
      ]).start();
    }
  }, [visible, message, scaleAnim, opacityAnim]);

  if (!message) return null;

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
          top: position.y - 80,
          left: position.x + 50,
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim
        }
      ]}
    >
      <View
        style={[
          styles.bubble,
          { borderColor: colors[difficulty] }
        ]}
      >
        <Text style={styles.message}>{message}</Text>

        {/* Triangle pointer */}
        <View
          style={[
            styles.pointer,
            { borderTopColor: colors[difficulty] }
          ]}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    maxWidth: 200,
    zIndex: 999
  },
  bubble: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3
  },
  message: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2C3E50",
    lineHeight: 20
  },
  pointer: {
    position: "absolute",
    bottom: -8,
    left: 20,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent"
  }
});
