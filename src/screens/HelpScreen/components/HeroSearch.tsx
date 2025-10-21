/**
 * Hero Search - Intelligence Artificielle
 * Barre de recherche premium avec suggestions
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

interface HeroSearchProps {
  onSearch: (query: string) => void;
  isDarkMode?: boolean;
}

const greetings = [
  'Comment puis-je t\'aider ? 👋',
  'Besoin d\'aide ? 🤝',
  'Une question ? 💬',
  'Je suis là pour toi ! 🙌',
];

const placeholders = [
  'Cherche ta question...',
  'Comment calculer le bonus ?',
  'Règles du Yams',
  'Partager mes scores',
  'Changer le thème',
];

export const HeroSearch: React.FC<HeroSearchProps> = ({
  onSearch,
  isDarkMode = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [greeting, setGreeting] = useState(greetings[0]);
  const [placeholder, setPlaceholder] = useState(placeholders[0]);
  const fadeAnim = new Animated.Value(1);

  // Rotation des greetings
  useEffect(() => {
    const greetingIndex = Math.floor(Math.random() * greetings.length);
    setGreeting(greetings[greetingIndex]);
  }, []);

  // Rotation des placeholders
  useEffect(() => {
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      const randomIndex = Math.floor(Math.random() * placeholders.length);
      setPlaceholder(placeholders[randomIndex]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    onSearch(text);
  };

  const handleClear = () => {
    setSearchQuery('');
    onSearch('');
  };

  return (
    <LinearGradient
      colors={['#4A90E2', '#5E3AEE', '#50C878']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Greeting */}
      <Text style={styles.greeting}>{greeting}</Text>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>

        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
          <TextInput
            style={styles.input}
            value={searchQuery}
            onChangeText={handleSearch}
            placeholder={placeholder}
            placeholderTextColor="rgba(0,0,0,0.4)"
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
          />
        </Animated.View>

        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Quick Links */}
      {searchQuery.length === 0 && (
        <View style={styles.quickLinks}>
          <QuickChip icon="🎲" text="Règles" color="#4A90E2" />
          <QuickChip icon="🏆" text="Scores" color="#50C878" />
          <QuickChip icon="⚙️" text="Paramètres" color="#9B59B6" />
          <QuickChip icon="🐛" text="Bug" color="#FF6B6B" />
        </View>
      )}
    </LinearGradient>
  );
};

interface QuickChipProps {
  icon: string;
  text: string;
  color: string;
}

const QuickChip: React.FC<QuickChipProps> = ({ icon, text, color }) => (
  <TouchableOpacity style={styles.chip}>
    <Text style={styles.chipIcon}>{icon}</Text>
    <Text style={styles.chipText}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  searchBar: {
    height: 56,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 32,
    elevation: 8,
  },
  searchIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 17,
    color: '#000000',
    fontWeight: '500',
  },
  clearButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  clearIcon: {
    fontSize: 16,
    color: '#666666',
  },
  quickLinks: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    gap: 6,
  },
  chipIcon: {
    fontSize: 16,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
