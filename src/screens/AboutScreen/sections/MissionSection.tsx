import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

const MissionSection = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Notre Mission 🎯</Text>

      <Text style={styles.quote}>
        "Transformer chaque partie de Yams en moment mémorable"
      </Text>

      <View style={styles.manifestoContainer}>
        <Text style={styles.manifestoParagraph}>
          Le Yams est plus qu'un jeu de dés. C'est un moment de{' '}
          <Text style={styles.emphasis}>partage</Text>, de{' '}
          <Text style={styles.emphasis}>rire</Text>, de{' '}
          <Text style={styles.emphasis}>compétition amicale</Text>.
        </Text>

        <Text style={styles.manifestoParagraph}>
          Nous croyons que la technologie doit{' '}
          <Text style={styles.emphasis}>enrichir</Text> ces moments,{' '}
          <Text style={styles.emphasis}>pas les remplacer</Text>.
        </Text>

        <Text style={styles.manifestoParagraph}>
          Yams Score <Text style={styles.emphasis}>élimine</Text> les calculs,{' '}
          <Text style={styles.emphasis}>préserve</Text> les souvenirs, et{' '}
          <Text style={styles.emphasis}>célèbre</Text> chaque victoire.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 32,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 24,
  },
  quote: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
    lineHeight: 34,
    fontStyle: 'italic',
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  manifestoContainer: {
    gap: 20,
  },
  manifestoParagraph: {
    fontSize: 17,
    lineHeight: 27,
    color: '#333333',
    textAlign: 'center',
  },
  emphasis: {
    color: '#4A90E2',
    fontWeight: '600',
  },
});

export default MissionSection;
