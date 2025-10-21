import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface StatCardProps {
  emoji: string;
  gradientColors: string[];
  value: string;
  label: string;
  trend?: {
    value: string;
    period: string;
  };
}

const StatCard: React.FC<StatCardProps> = ({
  emoji,
  gradientColors,
  value,
  label,
  trend,
}) => {
  return (
    <View style={styles.card}>
      <LinearGradient
        colors={gradientColors}
        style={styles.iconContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.emoji}>{emoji}</Text>
      </LinearGradient>

      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>

      {trend && (
        <Text style={styles.trend}>
          {trend.value} {trend.period}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emoji: {
    fontSize: 32,
  },
  value: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
    textAlign: 'center',
  },
  trend: {
    fontSize: 12,
    color: '#50C878',
    marginTop: 8,
    fontWeight: '600',
  },
});

export default StatCard;
