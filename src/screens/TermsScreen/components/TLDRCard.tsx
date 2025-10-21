import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';

interface TLDRPointProps {
  emoji: string;
  title: string;
  color: string;
  items: string[];
}

const TLDRPoint: React.FC<TLDRPointProps> = ({emoji, title, color, items}) => (
  <View style={styles.pointContainer}>
    <View style={[styles.pointHeader, {backgroundColor: `${color}15`}]}>
      <Text style={styles.pointEmoji}>{emoji}</Text>
      <Text style={[styles.pointTitle, {color}]}>{title}</Text>
    </View>
    <View style={styles.itemsList}>
      {items.map((item, index) => (
        <View key={index} style={styles.itemRow}>
          <View style={[styles.itemBullet, {backgroundColor: color}]} />
          <Text style={styles.itemText}>{item}</Text>
        </View>
      ))}
    </View>
  </View>
);

export const TLDRCard: React.FC = () => {
  const points: TLDRPointProps[] = [
    {
      emoji: '✅',
      title: 'Ce que tu peux faire :',
      color: '#50C878',
      items: [
        'Utiliser l\'app gratuitement',
        'Jouer autant de parties que tu veux',
        'Partager tes scores',
        'Supprimer ton compte quand tu veux',
      ],
    },
    {
      emoji: '🚫',
      title: 'Ce que tu ne peux pas faire :',
      color: '#FF6B6B',
      items: [
        'Pirater ou modifier l\'app',
        'Revendre ou copier notre code',
        'Utiliser l\'app pour frauder',
        'Harceler d\'autres utilisateurs',
      ],
    },
    {
      emoji: '🛡️',
      title: 'Ce qu\'on te garantit :',
      color: '#4A90E2',
      items: [
        'App gratuite et sans pub',
        'Mises à jour régulières',
        'Support réactif',
        'Respect de ta vie privée',
      ],
    },
    {
      emoji: '⚠️',
      title: 'Limites de responsabilité :',
      color: '#F39C12',
      items: [
        'On fait de notre mieux, mais des bugs peuvent arriver',
        'Tu es responsable de sauvegarder tes données importantes',
        'Service fourni "tel quel" (standard légal)',
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>📝</Text>
        <View>
          <Text style={styles.title}>L'Essentiel en 60 Secondes</Text>
          <Text style={styles.subtitle}>Ce qu'il faut vraiment savoir</Text>
        </View>
      </View>

      <Text style={styles.intro}>
        En utilisant Yams Score, voici ce qu'on se promet mutuellement :
      </Text>

      {points.map((point, index) => (
        <TLDRPoint key={index} {...point} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#4A90E2',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  title: {
    fontFamily: 'SF Pro Display',
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  subtitle: {
    fontFamily: 'SF Pro Text',
    fontSize: 15,
    fontWeight: '400',
    color: '#666666',
    marginTop: 2,
  },
  intro: {
    fontFamily: 'SF Pro Text',
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 16,
    lineHeight: 24,
  },
  pointContainer: {
    marginBottom: 16,
  },
  pointHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  pointEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  pointTitle: {
    fontFamily: 'SF Pro Text',
    fontSize: 17,
    fontWeight: '700',
  },
  itemsList: {
    paddingLeft: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  itemBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 7,
    marginRight: 10,
  },
  itemText: {
    flex: 1,
    fontFamily: 'SF Pro Text',
    fontSize: 15,
    fontWeight: '400',
    color: '#333333',
    lineHeight: 22,
  },
});
