/**
 * AnimatedMessage Component
 * Message popup animé qui apparaît au-dessus des cellules
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Text, Dimensions } from 'react-native';
import { MessageConfig } from '../types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface AnimatedMessageProps {
  config?: MessageConfig | null;
  x?: number;
  y?: number;
  onComplete?: () => void;
}

// Ref globale pour afficher un message depuis n'importe où
export const animatedMessageRef = React.createRef<any>();

const AnimatedMessage = React.forwardRef<any, AnimatedMessageProps>(
  ({ config: externalConfig, x: externalX, y: externalY, onComplete }, ref) => {
    const [messageConfig, setMessageConfig] = React.useState<MessageConfig | null>(
      externalConfig || null
    );
    const [position, setPosition] = React.useState({ x: externalX || SCREEN_WIDTH / 2, y: externalY || 200 });

    const scaleAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const translateYAnim = useRef(new Animated.Value(0)).current;

    const showMessage = (config: MessageConfig, x?: number, y?: number) => {
      setMessageConfig(config);
      setPosition({
        x: x || SCREEN_WIDTH / 2,
        y: y || 200,
      });
    };

    useEffect(() => {
      if (messageConfig && messageConfig.animation) {
        playAnimation(messageConfig);
      }
    }, [messageConfig]);

    const playAnimation = (config: MessageConfig) => {
      if (!config.animation) return;

      const { animation } = config;
      const { duration } = animation;

      // Reset animations
      scaleAnim.setValue(animation.scale?.[0] || 0);
      opacityAnim.setValue(animation.opacity?.[0] || 0);
      translateYAnim.setValue(animation.translateY?.[0] || 0);

      const animations: Animated.CompositeAnimation[] = [];

      // Scale animation
      if (animation.scale) {
        const values = animation.scale;
        const animSteps = values.slice(1).map((value, index) => {
          return Animated.timing(scaleAnim, {
            toValue: value,
            duration: duration / (values.length - 1),
            useNativeDriver: true,
          });
        });
        animations.push(Animated.sequence(animSteps));
      }

      // Opacity animation
      if (animation.opacity) {
        const values = animation.opacity;
        const animSteps = values.slice(1).map((value, index) => {
          return Animated.timing(opacityAnim, {
            toValue: value,
            duration: duration / (values.length - 1),
            useNativeDriver: true,
          });
        });
        animations.push(Animated.sequence(animSteps));
      }

      // TranslateY animation
      if (animation.translateY) {
        const values = animation.translateY;
        const animSteps = values.slice(1).map((value, index) => {
          return Animated.timing(translateYAnim, {
            toValue: value,
            duration: duration / (values.length - 1),
            useNativeDriver: true,
          });
        });
        animations.push(Animated.sequence(animSteps));
      }

      // Run all animations in parallel
      Animated.parallel(animations).start(() => {
        setMessageConfig(null);
        if (onComplete) {
          onComplete();
        }
      });
    };

    // Exposer la méthode via ref
    React.useImperativeHandle(ref || animatedMessageRef, () => ({
      show: (config: MessageConfig, x?: number, y?: number) => {
        showMessage(config, x, y);
      },
    }));

    if (!messageConfig) return null;

    // Calculate position based on config
    let top = position.y;
    if (messageConfig.position === 'above') {
      top = position.y - 100;
    } else if (messageConfig.position === 'center') {
      top = SCREEN_HEIGHT / 2 - 50;
    } else if (messageConfig.position === 'below') {
      top = position.y + 100;
    }

    return (
      <Animated.View
        style={[
          styles.container,
          {
            top,
            left: position.x,
            transform: [
              { translateX: -150 }, // Center horizontally (assuming width ~300)
              { scale: scaleAnim },
              { translateY: translateYAnim },
            ],
            opacity: opacityAnim,
          },
        ]}
        pointerEvents="none"
      >
        <View style={styles.bubble}>
          <Text
            style={[
              styles.text,
              {
                fontSize: messageConfig.fontSize || 24,
                color: messageConfig.color,
              },
            ]}
          >
            {messageConfig.text}
          </Text>
        </View>
      </Animated.View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 9997,
    width: 300,
  },
  bubble: {
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
  text: {
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});

AnimatedMessage.displayName = 'AnimatedMessage';

export default AnimatedMessage;
