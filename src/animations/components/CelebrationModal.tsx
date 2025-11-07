/**
 * CelebrationModal Component
 * Modal de célébration ultra premium pour les grandes réussites (Yams, Grande Suite, etc.)
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Modal,
  StyleSheet,
  Animated,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { CelebrationModalConfig } from '../types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface CelebrationModalProps {
  visible: boolean;
  config: CelebrationModalConfig;
  onClose?: () => void;
}

const CelebrationModal: React.FC<CelebrationModalProps> = ({
  visible,
  config,
  onClose,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const iconScaleAnim = useRef(new Animated.Value(0)).current;
  const titleScaleAnim = useRef(new Animated.Value(0)).current;
  const subtitleOpacityAnim = useRef(new Animated.Value(0)).current;
  const rayRotationAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible) {
      // Reset animations
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
      iconScaleAnim.setValue(0);
      titleScaleAnim.setValue(0);
      subtitleOpacityAnim.setValue(0);
      rayRotationAnim.setValue(0);
      pulseAnim.setValue(1);

      // Start animations sequence
      Animated.parallel([
        // Background fade in
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        // Modal scale in
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Icon bounce in
        Animated.spring(iconScaleAnim, {
          toValue: 1,
          tension: 40,
          friction: 5,
          useNativeDriver: true,
        }).start();

        // Title scale in with delay
        setTimeout(() => {
          Animated.spring(titleScaleAnim, {
            toValue: 1,
            tension: 50,
            friction: 6,
            useNativeDriver: true,
          }).start();
        }, 200);

        // Subtitle fade in with delay
        setTimeout(() => {
          Animated.timing(subtitleOpacityAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }).start();
        }, 400);
      });

      // Continuous ray rotation
      Animated.loop(
        Animated.timing(rayRotationAnim, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: true,
        })
      ).start();

      // Continuous pulse effect
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Auto close after duration
      if (config.duration && onClose) {
        const timeout = setTimeout(() => {
          handleClose();
        }, config.duration);

        return () => clearTimeout(timeout);
      }
    }
  }, [visible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onClose) onClose();
    });
  };

  const rayRotation = rayRotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={config.closable ? handleClose : undefined}
    >
      <Animated.View
        style={[
          styles.container,
          { opacity: opacityAnim },
        ]}
      >
        {/* Background blur */}
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType="dark"
          blurAmount={10}
          reducedTransparencyFallbackColor="rgba(0,0,0,0.9)"
        />

        {/* Golden rays */}
        <Animated.View
          style={[
            styles.raysContainer,
            { transform: [{ rotate: rayRotation }] },
          ]}
        >
          {[...Array(16)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.ray,
                {
                  transform: [
                    { rotate: `${i * (360 / 16)}deg` },
                    { translateX: SCREEN_WIDTH / 2 },
                  ],
                },
              ]}
            />
          ))}
        </Animated.View>

        {/* Main content */}
        <Animated.View
          style={[
            styles.content,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Icon with pulse */}
          <Animated.View
            style={{
              transform: [{ scale: Animated.multiply(iconScaleAnim, pulseAnim) }],
            }}
          >
            <Text style={[styles.icon, { fontSize: config.content.iconSize }]}>
              {config.content.icon}
            </Text>
          </Animated.View>

          {/* Title */}
          <Animated.View
            style={{
              transform: [{ scale: titleScaleAnim }],
            }}
          >
            <Text
              style={[
                styles.title,
                {
                  fontSize: config.content.titleSize,
                  color: config.content.titleColor,
                },
              ]}
            >
              {config.content.title}
            </Text>
          </Animated.View>

          {/* Subtitle */}
          {config.content.subtitle && (
            <Animated.View style={{ opacity: subtitleOpacityAnim }}>
              <Text
                style={[
                  styles.subtitle,
                  {
                    fontSize: config.content.subtitleSize || 28,
                    color: config.content.subtitleColor || '#FFFFFF',
                  },
                ]}
              >
                {config.content.subtitle}
              </Text>
            </Animated.View>
          )}

          {/* Sparkles decoration */}
          <View style={styles.sparklesContainer}>
            <Text style={styles.sparkle}>✨</Text>
            <Text style={[styles.sparkle, styles.sparkle2]}>✨</Text>
            <Text style={[styles.sparkle, styles.sparkle3]}>⭐</Text>
            <Text style={[styles.sparkle, styles.sparkle4]}>⭐</Text>
          </View>
        </Animated.View>

        {/* Close button */}
        {config.closable && (
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleClose}
            activeOpacity={0.7}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
  },
  raysContainer: {
    position: 'absolute',
    width: SCREEN_WIDTH * 2,
    height: SCREEN_WIDTH * 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ray: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    height: 4,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    borderRadius: 2,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderWidth: 3,
    borderColor: 'rgba(255, 215, 0, 0.5)',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 30,
    elevation: 20,
  },
  icon: {
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 15,
    letterSpacing: 8,
    textShadowColor: 'rgba(255, 215, 0, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  subtitle: {
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 2,
  },
  sparklesContainer: {
    position: 'absolute',
    width: '120%',
    height: '120%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sparkle: {
    position: 'absolute',
    fontSize: 30,
    top: 20,
    left: 20,
  },
  sparkle2: {
    top: 30,
    right: 20,
    left: undefined,
    fontSize: 25,
  },
  sparkle3: {
    bottom: 40,
    left: 30,
    top: undefined,
    fontSize: 35,
  },
  sparkle4: {
    bottom: 50,
    right: 30,
    left: undefined,
    top: undefined,
    fontSize: 28,
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 30,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
  },
});

export default CelebrationModal;
