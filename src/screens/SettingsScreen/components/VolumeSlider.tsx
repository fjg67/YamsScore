/**
 * Volume Slider Component - iOS Style
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  Animated,
} from 'react-native';
import { haptics } from '../../../utils/haptics';

interface VolumeSliderProps {
  icon: string;
  title: string;
  value: number; // 0-100
  onValueChange: (value: number) => void;
  color?: string;
  enabled?: boolean;
}

const VolumeSlider: React.FC<VolumeSliderProps> = ({
  icon,
  title,
  value,
  onValueChange,
  color = '#4A90E2',
  enabled = true,
}) => {
  const sliderWidth = 250; // Largeur du slider
  const thumbSize = 28;

  // Position du thumb
  const thumbPosition = React.useRef(
    new Animated.Value((value / 100) * sliderWidth)
  ).current;

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => enabled,
      onMoveShouldSetPanResponder: () => enabled,
      onPanResponderGrant: () => {
        haptics.light();
      },
      onPanResponderMove: (_, gestureState) => {
        const newPosition = Math.max(
          0,
          Math.min(sliderWidth, gestureState.dx + (value / 100) * sliderWidth)
        );
        thumbPosition.setValue(newPosition);

        const newValue = Math.round((newPosition / sliderWidth) * 100);
        if (newValue !== value) {
          onValueChange(newValue);
          haptics.selection();
        }
      },
      onPanResponderRelease: () => {
        // Reset position based on value
        Animated.spring(thumbPosition, {
          toValue: (value / 100) * sliderWidth,
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  // Update thumb position when value changes externally
  React.useEffect(() => {
    Animated.spring(thumbPosition, {
      toValue: (value / 100) * sliderWidth,
      useNativeDriver: false,
    }).start();
  }, [value]);

  return (
    <View style={[styles.container, !enabled && styles.containerDisabled]}>
      <View style={styles.header}>
        <Text style={styles.icon}>{icon}</Text>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.valueText}>{value}%</Text>
        </View>
      </View>

      <View style={styles.sliderContainer}>
        {/* Track */}
        <View style={styles.track}>
          {/* Filled part */}
          <View
            style={[
              styles.trackFill,
              {
                width: `${value}%`,
                backgroundColor: enabled ? color : '#CCCCCC',
              },
            ]}
          />
        </View>

        {/* Thumb */}
        <Animated.View
          style={[
            styles.thumb,
            {
              left: thumbPosition,
              backgroundColor: enabled ? color : '#CCCCCC',
            },
          ]}
          {...panResponder.panHandlers}
        >
          <View style={styles.thumbInner} />
        </Animated.View>

        {/* Volume Icons */}
        <Text style={styles.iconLeft}>🔈</Text>
        <Text style={styles.iconRight}>🔊</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  containerDisabled: {
    opacity: 0.5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    fontSize: 24,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  valueText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A90E2',
  },
  sliderContainer: {
    position: 'relative',
    paddingHorizontal: 32,
  },
  track: {
    height: 4,
    backgroundColor: '#E8E8E8',
    borderRadius: 2,
    overflow: 'hidden',
  },
  trackFill: {
    height: '100%',
    borderRadius: 2,
  },
  thumb: {
    position: 'absolute',
    top: -10,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    marginLeft: -14, // Center the thumb
  },
  thumbInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  iconLeft: {
    position: 'absolute',
    left: 0,
    top: -8,
    fontSize: 16,
  },
  iconRight: {
    position: 'absolute',
    right: 0,
    top: -8,
    fontSize: 16,
  },
});

export default VolumeSlider;
