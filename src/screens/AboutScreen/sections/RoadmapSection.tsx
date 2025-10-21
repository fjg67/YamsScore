import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const RoadmapSection = () => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(74,144,226,0.05)', 'rgba(80,200,120,0.05)']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.sectionTitle}>Roadmap 🗺️</Text>
        <Text style={styles.subtitle}>Ce qui arrive bientôt</Text>

        <View style={styles.timelineContainer}>
          <View style={styles.phase}>
            <Text style={[styles.phaseLabel, { color: '#50C878' }]}>
              Terminé ✅
            </Text>
            <View style={styles.items}>
              <View style={styles.item}>
                <Text style={styles.itemIcon}>🌙</Text>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemTitle}>Mode sombre</Text>
                  <Text style={styles.itemDescription}>
                    Thème sombre premium
                  </Text>
                </View>
              </View>
              <View style={styles.item}>
                <Text style={styles.itemIcon}>📊</Text>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemTitle}>Statistiques avancées</Text>
                  <Text style={styles.itemDescription}>
                    Graphiques et insights
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.phase}>
            <Text style={[styles.phaseLabel, { color: '#F39C12' }]}>
              En cours 🚧
            </Text>
            <View style={styles.items}>
              <View style={styles.item}>
                <Text style={styles.itemIcon}>🌐</Text>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemTitle}>
                    Mode multijoueur en ligne
                  </Text>
                  <Text style={styles.itemDescription}>
                    Joue avec des amis à distance
                  </Text>
                  <View style={styles.progressBar}>
                    <View style={[styles.progress, { width: '65%' }]} />
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.phase}>
            <Text style={[styles.phaseLabel, { color: '#9B59B6' }]}>
              Prévu 📅
            </Text>
            <View style={styles.items}>
              <View style={styles.item}>
                <Text style={styles.itemIcon}>🏆</Text>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemTitle}>Tournois</Text>
                  <Text style={styles.itemDescription}>
                    Compétitions communautaires
                  </Text>
                </View>
              </View>
              <View style={styles.item}>
                <Text style={styles.itemIcon}>⌚</Text>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemTitle}>Version Apple Watch</Text>
                  <Text style={styles.itemDescription}>
                    Yams sur ton poignet
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  gradient: {
    borderRadius: 24,
    padding: 24,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
  },
  timelineContainer: {
    gap: 24,
  },
  phase: {
    gap: 12,
  },
  phaseLabel: {
    fontSize: 18,
    fontWeight: '700',
  },
  items: {
    gap: 12,
  },
  item: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  itemIcon: {
    fontSize: 32,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#666666',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginTop: 8,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 3,
  },
});

export default RoadmapSection;
