/**
 * Étape 1: Catégorisation Intelligente
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { haptics } from '../../../../utils/haptics';
import { categories } from '../../data/suggestions';

interface Props {
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string) => void;
  isDarkMode?: boolean;
}

export const Step1Category: React.FC<Props> = ({
  selectedCategory,
  onSelectCategory,
  isDarkMode = false,
}) => {
  const textColor = isDarkMode ? '#FFFFFF' : '#1A1A1A';
  const subtextColor = isDarkMode ? '#AAAAAA' : '#666666';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>
          📋 Catégorie de votre idée
        </Text>
        <Text style={[styles.subtitle, { color: subtextColor }]}>
          Choisissez la catégorie qui correspond le mieux
        </Text>
      </View>

      <View style={styles.grid}>
        {categories.map(category => (
          <CategoryCard
            key={category.id}
            category={category}
            isSelected={selectedCategory === category.id}
            onPress={() => {
              haptics.light();
              onSelectCategory(category.id);
            }}
          />
        ))}
      </View>
    </View>
  );
};

interface CategoryCardProps {
  category: any;
  isSelected: boolean;
  onPress: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  isSelected,
  onPress,
}) => {
  const scaleValue = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.cardContainer,
        {
          transform: [{ scale: scaleValue }],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <LinearGradient
          colors={category.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.card,
            isSelected && styles.cardSelected,
          ]}
        >
          {isSelected && (
            <View style={styles.checkmark}>
              <Text style={styles.checkmarkText}>✓</Text>
            </View>
          )}

          <Text style={styles.icon}>{category.icon}</Text>
          <Text style={styles.categoryTitle}>{category.title}</Text>
          <Text style={styles.count}>{category.count} idées</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardContainer: {
    width: '48%',
    marginBottom: 12,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
    position: 'relative',
  },
  cardSelected: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#10B981',
    fontSize: 16,
    fontWeight: 'bold',
  },
  icon: {
    fontSize: 40,
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  count: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
  },
});
