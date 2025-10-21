import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface TeamMemberCardProps {
  emoji: string;
  gradientColors: string[];
  name: string;
  role: string;
  bio: string;
  quote: string;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({
  emoji,
  gradientColors,
  name,
  role,
  bio,
  quote,
}) => {
  return (
    <View style={styles.card}>
      <LinearGradient
        colors={gradientColors}
        style={styles.avatarContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.avatar}>{emoji}</Text>
      </LinearGradient>

      <View style={styles.infoContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.role}>{role}</Text>
        <Text style={styles.bio}>{bio}</Text>
        <Text style={styles.quote}>{quote}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 280,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 8,
    marginRight: 16,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatar: {
    fontSize: 64,
  },
  infoContainer: {
    alignItems: 'center',
    gap: 8,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  role: {
    fontSize: 15,
    fontWeight: '500',
    color: '#4A90E2',
  },
  bio: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 21,
    marginTop: 8,
  },
  quote: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#999999',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default TeamMemberCard;
