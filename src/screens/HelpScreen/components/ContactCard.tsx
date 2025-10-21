/**
 * Contact Card - Support multi-canal
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { haptics, HapticType } from '../../../utils/haptics';

interface ContactCardProps {
  icon: string;
  title: string;
  status: string;
  responseTime: string;
  gradient: string[];
  online?: boolean;
  action: 'email' | 'discord' | 'chat';
}

export const ContactCard: React.FC<ContactCardProps> = ({
  icon,
  title,
  status,
  responseTime,
  gradient,
  online,
  action,
}) => {
  const handlePress = () => {
    haptics.trigger(HapticType.MEDIUM);

    switch (action) {
      case 'email':
        Linking.openURL('mailto:support@yams-score.app?subject=Support Yams Score');
        break;
      case 'discord':
        Linking.openURL('https://discord.gg/yamsscore');
        break;
      case 'chat':
        // TODO: Implémenter le chat en direct
        console.log('Open chat');
        break;
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        {/* Icon */}
        <Text style={styles.icon}>{icon}</Text>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>

          {/* Status */}
          <View style={styles.statusContainer}>
            {online !== undefined && (
              <View style={[styles.dot, { backgroundColor: online ? '#50C878' : '#999999' }]} />
            )}
            <Text style={styles.status}>{status}</Text>
          </View>

          {/* Response Time */}
          <Text style={styles.responseTime}>{responseTime}</Text>
        </View>

        {/* Arrow */}
        <Text style={styles.arrow}>→</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 80,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  icon: {
    fontSize: 32,
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  status: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  responseTime: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  arrow: {
    fontSize: 24,
    color: '#FFFFFF',
    marginLeft: 8,
  },
});
