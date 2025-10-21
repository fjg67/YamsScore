/**
 * Help Screen - Centre d'Aide Ultra-Premium
 * Version finale avec recherche intelligente et support multi-canal
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Modal,
  TouchableOpacity,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../hooks/useTheme';
import { HeroSearch } from './components/HeroSearch';
import { CategoryCard } from './components/CategoryCard';
import { ArticleItem } from './components/ArticleItem';
import { ContactCard } from './components/ContactCard';
import { BackButton } from './components/BackButton';
import { ArticleDetail } from './views/ArticleDetail';
import { haptics, HapticType } from '../../utils/haptics';
import Fuse from 'fuse.js';
import {
  categories,
  articles,
  getPopularArticles,
  getArticleById,
  type Article,
} from './data/articles';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Help'>;
}

export const HelpScreen: React.FC<Props> = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);

  // Configuration Fuse.js pour la recherche fuzzy
  const fuse = new Fuse(articles, {
    keys: ['title', 'subtitle', 'content', 'tags'],
    threshold: 0.3,
    includeScore: true,
  });

  // Recherche
  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.trim().length === 0) {
      setSearchResults([]);
      return;
    }

    // Recherche fuzzy
    const results = fuse.search(query);
    setSearchResults(results.map(result => result.item));
  };

  // Ouvrir un article
  const handleArticlePress = (articleId: string) => {
    const article = getArticleById(articleId);
    if (!article) return;

    setSelectedArticle(article);

    // Charger les articles connexes
    if (article.relatedArticles) {
      const related = article.relatedArticles
        .map(id => getArticleById(id))
        .filter(Boolean) as Article[];
      setRelatedArticles(related);
    } else {
      setRelatedArticles([]);
    }
  };

  // Fermer l'article
  const handleCloseArticle = () => {
    setSelectedArticle(null);
    setRelatedArticles([]);
  };

  // Naviguer vers une catégorie
  const handleCategoryPress = (categoryId: string) => {
    const categoryArticles = articles.filter(
      article => article.categoryId === categoryId
    );
    setSearchResults(categoryArticles);
    setSearchQuery(''); // Clear search to show category results
  };

  const popularArticles = getPopularArticles();
  const bgColor = isDarkMode ? '#0A0A0A' : '#F5F5F5';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      {/* Bouton Retour Magnifique - Position fixe en haut à gauche */}
      <View style={styles.headerContainer}>
        <BackButton
          onPress={() => navigation.goBack()}
          label="Accueil"
          isDarkMode={isDarkMode}
        />
      </View>

      {/* Hero Search */}
      <HeroSearch onSearch={handleSearch} isDarkMode={isDarkMode} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Results */}
        {searchQuery.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
              Résultats de recherche ({searchResults.length})
            </Text>

            {searchResults.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>🔍</Text>
                <Text style={[styles.emptyTitle, { color: theme.text.primary }]}>
                  Aucun résultat trouvé
                </Text>
                <Text style={[styles.emptyText, { color: theme.text.secondary }]}>
                  Essaye avec d'autres mots-clés
                </Text>
              </View>
            ) : (
              searchResults.map(article => (
                <ArticleItem
                  key={article.id}
                  icon={article.icon}
                  title={article.title}
                  subtitle={article.subtitle}
                  views={article.views}
                  readTime={article.readTime}
                  helpfulRate={article.helpfulRate}
                  popular={article.popular}
                  tags={article.tags}
                  onPress={() => handleArticlePress(article.id)}
                  isDarkMode={isDarkMode}
                />
              ))
            )}
          </View>
        )}

        {/* Default Content (when no search) */}
        {searchQuery.length === 0 && searchResults.length === 0 && (
          <>
            {/* Popular Articles */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
                Articles Populaires 🔥
              </Text>

              {popularArticles.map(article => (
                <ArticleItem
                  key={article.id}
                  icon={article.icon}
                  title={article.title}
                  subtitle={article.subtitle}
                  views={article.views}
                  readTime={article.readTime}
                  helpfulRate={article.helpfulRate}
                  popular={article.popular}
                  tags={article.tags}
                  onPress={() => handleArticlePress(article.id)}
                  isDarkMode={isDarkMode}
                />
              ))}
            </View>

            {/* Categories Grid */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
                Parcourir par Catégorie 📚
              </Text>

              <View style={styles.categoriesGrid}>
                {categories.map(category => (
                  <CategoryCard
                    key={category.id}
                    icon={category.icon}
                    title={category.title}
                    count={category.count}
                    gradient={category.gradient}
                    popular={category.popular}
                    badge={category.badge}
                    onPress={() => handleCategoryPress(category.id)}
                  />
                ))}
              </View>
            </View>

            {/* Contact Support */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
                Besoin de Plus d'Aide ? 💬
              </Text>

              <Text style={[styles.sectionSubtitle, { color: theme.text.secondary }]}>
                ⚡ Notre équipe répond en moins de 24h
              </Text>

              <ContactCard
                icon="💬"
                title="Chat en direct"
                status="En ligne"
                responseTime="Réponse en ~5 min"
                gradient={['#4A90E2', '#5DADE2']}
                online={true}
                action="chat"
              />

              <ContactCard
                icon="✉️"
                title="Email"
                status="support@yams-score.app"
                responseTime="Réponse en ~24h"
                gradient={['#50C878', '#3FA065']}
                action="email"
              />

              <ContactCard
                icon="👥"
                title="Communauté Discord"
                status="2.4K membres actifs"
                responseTime="Aide entre joueurs"
                gradient={['#9B59B6', '#8E44AD']}
                action="discord"
              />

              {/* Bug Report */}
              <TouchableOpacity style={styles.bugButton}>
                <Text style={styles.bugButtonIcon}>🐛</Text>
                <Text style={styles.bugButtonText}>Signaler un bug</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Category Results (when category selected) */}
        {searchQuery.length === 0 && searchResults.length > 0 && (
          <View style={styles.section}>
            <TouchableOpacity
              onPress={() => setSearchResults([])}
              style={styles.backToHome}
            >
              <Text style={styles.backIcon}>←</Text>
              <Text style={[styles.backText, { color: theme.text.primary }]}>
                Retour
              </Text>
            </TouchableOpacity>

            <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
              Articles ({searchResults.length})
            </Text>

            {searchResults.map(article => (
              <ArticleItem
                key={article.id}
                icon={article.icon}
                title={article.title}
                subtitle={article.subtitle}
                views={article.views}
                readTime={article.readTime}
                helpfulRate={article.helpfulRate}
                popular={article.popular}
                tags={article.tags}
                onPress={() => handleArticlePress(article.id)}
                isDarkMode={isDarkMode}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Article Detail Modal */}
      <Modal
        visible={selectedArticle !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCloseArticle}
      >
        {selectedArticle && (
          <ArticleDetail
            article={selectedArticle}
            onClose={handleCloseArticle}
            onRelatedArticlePress={handleArticlePress}
            relatedArticles={relatedArticles}
          />
        )}
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1000,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 15,
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
  },
  bugButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FF6B6B',
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 12,
    gap: 8,
  },
  bugButtonIcon: {
    fontSize: 20,
  },
  bugButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B6B',
  },
  backToHome: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  backIcon: {
    fontSize: 20,
    color: '#4A90E2',
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
