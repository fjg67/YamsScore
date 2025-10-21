import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

const UserStories = () => {
  const stories = [
    {
      id: 'story-1',
      stars: 5,
      quote: 'Fini les disputes sur les calculs ! Cette app a sauvé nos soirées en famille. 😅',
      avatar: '👨‍👩‍👧‍👦',
      name: 'Famille Martin',
      location: 'Paris, France',
      meta: '124 parties jouées',
    },
    {
      id: 'story-2',
      stars: 5,
      quote: 'Les statistiques sont dingues ! Je vois enfin où je peux m\'améliorer. 📊',
      avatar: '🎮',
      name: 'Pierre',
      location: 'Lyon, France',
      meta: 'Top 5% joueurs',
    },
    {
      id: 'story-3',
      stars: 5,
      quote: 'Interface magnifique, animations fluides. On sent l\'amour du détail ! 💎',
      avatar: '🎨',
      name: 'Emma',
      location: 'Bordeaux, France',
      meta: 'Designer',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Ce que vous dites 💬</Text>
      <Text style={styles.subtitle}>
        Vos histoires nous inspirent chaque jour
      </Text>

      <View style={styles.storiesContainer}>
        {stories.map((story) => (
          <View key={story.id} style={styles.storyCard}>
            <View style={styles.stars}>
              {[...Array(5)].map((_, i) => (
                <Text key={i} style={styles.star}>⭐</Text>
              ))}
            </View>

            <Text style={styles.quote}>{story.quote}</Text>

            <View style={styles.authorContainer}>
              <Text style={styles.avatar}>{story.avatar}</Text>
              <View style={styles.authorInfo}>
                <Text style={styles.authorName}>{story.name}</Text>
                <Text style={styles.location}>{story.location}</Text>
                <Text style={styles.meta}>🎲 {story.meta}</Text>
              </View>
            </View>
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
  },
  storiesContainer: {
    gap: 16,
  },
  storyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  stars: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  star: {
    fontSize: 16,
    marginRight: 4,
  },
  quote: {
    fontSize: 16,
    lineHeight: 24,
    color: '#1A1A1A',
    marginBottom: 16,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    fontSize: 40,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  location: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  meta: {
    fontSize: 12,
    color: '#999999',
    marginTop: 4,
  },
});

export default UserStories;
