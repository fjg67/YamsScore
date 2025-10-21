import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface TLDRPoint {
  icon: string;
  iconColor: string;
  text: string;
  emphasis?: boolean;
}

const TLDR_POINTS: TLDRPoint[] = [
  {
    icon: '✅',
    iconColor: '#50C878',
    text: 'Nous collectons uniquement ce qui est nécessaire pour faire fonctionner l\'app',
  },
  {
    icon: '🚫',
    iconColor: '#FF6B6B',
    text: 'Nous ne vendons jamais tes données à des tiers',
    emphasis: true,
  },
  {
    icon: '🔒',
    iconColor: '#4A90E2',
    text: 'Tes parties de Yams restent 100% privées',
  },
  {
    icon: '👤',
    iconColor: '#9B59B6',
    text: 'Aucune donnée personnelle identifiable n\'est requise',
  },
  {
    icon: '🗑️',
    iconColor: '#F39C12',
    text: 'Tu peux tout supprimer en 1 clic',
  },
];

export const TLDRCard: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.icon}>⚡</Text>
        <Text style={styles.title}>Résumé en 30 Secondes</Text>
      </View>
      <Text style={styles.subtitle}>Tout ce que tu dois savoir</Text>

      <View style={styles.pointsContainer}>
        {TLDR_POINTS.map((point, index) => (
          <View
            key={index}
            style={[
              styles.point,
              point.emphasis && styles.pointEmphasis,
            ]}>
            <Text style={[styles.pointIcon, {color: point.iconColor}]}>
              {point.icon}
            </Text>
            <Text style={styles.pointText}>
              {point.text.split('**').map((part, i) =>
                i % 2 === 1 ? (
                  <Text key={i} style={styles.bold}>
                    {part}
                  </Text>
                ) : (
                  part
                ),
              )}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#50C878',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  icon: {
    fontSize: 24,
  },
  title: {
    fontFamily: 'SF Pro Display',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
  },
  subtitle: {
    fontFamily: 'SF Pro Text',
    fontSize: 15,
    color: '#666666',
    marginBottom: 16,
  },
  pointsContainer: {
    gap: 16,
  },
  point: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  pointEmphasis: {
    backgroundColor: 'rgba(255,107,107,0.05)',
    padding: 12,
    borderRadius: 12,
    marginHorizontal: -12,
  },
  pointIcon: {
    fontSize: 24,
    flexShrink: 0,
    marginTop: -2,
  },
  pointText: {
    fontFamily: 'SF Pro Text',
    fontSize: 16,
    lineHeight: 24,
    color: '#333333',
    flex: 1,
  },
  bold: {
    fontWeight: 'bold',
  },
});
