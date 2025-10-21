import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const ValuesSection = () => {
  const values = [
    {
      id: 'privacy',
      emoji: '🔒',
      gradientColors: ['#4A90E2', '#5DADE2'],
      title: 'Vie Privée',
      description: 'Tes données restent chez toi. Aucune vente, aucun tracking abusif.',
      badge: 'RGPD Compliant',
    },
    {
      id: 'performance',
      emoji: '⚡',
      gradientColors: ['#FFD700', '#FFA500'],
      title: 'Performance',
      description: 'Rapide comme l\'éclair. 60 FPS garanti.',
    },
    {
      id: 'accessibility',
      emoji: '♿',
      gradientColors: ['#50C878', '#3FA065'],
      title: 'Accessibilité',
      description: 'Pour tout le monde, sans exception.',
      badge: 'A11y First',
    },
    {
      id: 'transparency',
      emoji: '🔍',
      gradientColors: ['#9B59B6', '#8E44AD'],
      title: 'Transparence',
      description: 'Open source, open roadmap, open communication.',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Nos Valeurs 💎</Text>

      <View style={styles.valuesGrid}>
        {values.map((value) => (
          <View key={value.id} style={styles.valueCard}>
            <LinearGradient
              colors={value.gradientColors}
              style={styles.iconContainer}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.valueEmoji}>{value.emoji}</Text>
            </LinearGradient>

            <Text style={styles.valueTitle}>{value.title}</Text>
            <Text style={styles.valueDescription}>{value.description}</Text>

            {value.badge && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>✅ {value.badge}</Text>
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 24,
  },
  valuesGrid: {
    gap: 16,
  },
  valueCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  valueEmoji: {
    fontSize: 40,
  },
  valueTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  valueDescription: {
    fontSize: 15,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
  },
  badge: {
    marginTop: 12,
    backgroundColor: 'rgba(80,200,120,0.1)',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#50C878',
  },
});

export default ValuesSection;
