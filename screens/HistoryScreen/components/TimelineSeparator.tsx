import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';

interface TimelineSeparatorProps {
  label: string;
}

const TimelineSeparator: React.FC<TimelineSeparatorProps> = ({ label }) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['transparent', 'rgba(255, 255, 255, 0.2)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.line}
      />
      <Text style={styles.label}>{label}</Text>
      <LinearGradient
        colors={['transparent', 'rgba(255, 255, 255, 0.2)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.line}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  line: {
    flex: 1,
    height: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});

export default TimelineSeparator;
