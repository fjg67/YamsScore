import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import TeamMemberCard from '../components/TeamMemberCard';

const TeamSection = () => {
  const teamMembers = [
    {
      id: 'founder',
      emoji: '👨‍💻',
      gradientColors: ['#4A90E2', '#5DADE2'],
      name: 'Florian',
      role: 'Founder & Designer',
      bio: 'Passionné de jeux et de design. Rêvait de digitaliser le Yams depuis toujours.',
      quote: '"Le Yams mérite une app exceptionnelle"',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Le Créateur 👋</Text>
      <Text style={styles.subtitle}>
        Rencontre l'humain derrière Yams Score
      </Text>

      <View style={styles.memberContainer}>
        {teamMembers.map((member) => (
          <TeamMemberCard
            key={member.id}
            emoji={member.emoji}
            gradientColors={member.gradientColors}
            name={member.name}
            role={member.role}
            bio={member.bio}
            quote={member.quote}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  memberContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
});

export default TeamSection;
