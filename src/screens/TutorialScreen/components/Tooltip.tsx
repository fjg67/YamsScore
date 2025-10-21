/**
 * Tooltip contextuel intelligent
 */

import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

type TooltipType = 'info' | 'tip' | 'warning' | 'pro';

interface TooltipProps {
  message: string;
  type?: TooltipType;
  visible: boolean;
  onDismiss?: () => void;
  dismissAfter?: number; // Auto-dismiss après X ms
  position?: 'top' | 'bottom' | 'center';
  actionLabel?: string;
  onAction?: () => void;
}

const TOOLTIP_COLORS = {
  info: {
    gradient: ['#4ECDC4', '#44A08D'],
    icon: '💡',
  },
  tip: {
    gradient: ['#FFB347', '#FFCC33'],
    icon: '⚡',
  },
  warning: {
    gradient: ['#FF6B6B', '#EE5A6F'],
    icon: '⚠️',
  },
  pro: {
    gradient: ['#9B59B6', '#8E44AD'],
    icon: '🎯',
  },
};

export const Tooltip: React.FC<TooltipProps> = ({
  message,
  type = 'info',
  visible,
  onDismiss,
  dismissAfter = 8000,
  position = 'bottom',
  actionLabel,
  onAction,
}) => {
  const translateY = useSharedValue(position === 'bottom' ? SCREEN_HEIGHT : -200);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // Slide in
      const targetY = position === 'bottom' ? -80 : position === 'top' ? 80 : 0;
      translateY.value = withSpring(targetY, {
        damping: 20,
        stiffness: 90,
      });
      opacity.value = withTiming(1, { duration: 300 });

      // Auto-dismiss
      if (dismissAfter > 0 && onDismiss) {
        const timer = setTimeout(() => {
          handleDismiss();
        }, dismissAfter);
        return () => clearTimeout(timer);
      }
    } else {
      handleDismiss();
    }
  }, [visible]);

  const handleDismiss = () => {
    const hideY = position === 'bottom' ? SCREEN_HEIGHT : -200;
    translateY.value = withTiming(
      hideY,
      {
        duration: 300,
        easing: Easing.ease,
      },
      () => {
        if (onDismiss) {
          runOnJS(onDismiss)();
        }
      }
    );
    opacity.value = withTiming(0, { duration: 200 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const { gradient, icon } = TOOLTIP_COLORS[type];

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        position === 'bottom' && styles.containerBottom,
        position === 'top' && styles.containerTop,
        position === 'center' && styles.containerCenter,
        animatedStyle,
      ]}
    >
      <LinearGradient colors={[gradient[0], gradient[1]]} style={styles.tooltip} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <View style={styles.content}>
          <Text style={styles.icon}>{icon}</Text>
          <Text style={styles.message}>{message}</Text>
        </View>

        <View style={styles.actions}>
          {actionLabel && onAction && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                onAction();
                handleDismiss();
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.actionText}>{actionLabel}</Text>
            </TouchableOpacity>
          )}

          {onDismiss && (
            <TouchableOpacity
              style={styles.dismissButton}
              onPress={handleDismiss}
              activeOpacity={0.8}
            >
              <Text style={styles.dismissText}>Compris</Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  containerBottom: {
    bottom: 0,
  },
  containerTop: {
    top: 0,
  },
  containerCenter: {
    top: '50%',
    marginTop: -60,
  },
  tooltip: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  icon: {
    fontSize: 24,
    marginRight: 12,
  },
  message: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  dismissButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
  },
  dismissText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});
