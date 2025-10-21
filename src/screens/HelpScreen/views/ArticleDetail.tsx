/**
 * Article Detail View - Affichage complet de l'article
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Share,
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import { haptics, HapticType } from '../../../utils/haptics';
import type { Article } from '../data/articles';
import { useTheme } from '../../../hooks/useTheme';

interface ArticleDetailProps {
  article: Article;
  onClose: () => void;
  onRelatedArticlePress: (articleId: string) => void;
  relatedArticles?: Article[];
}

export const ArticleDetail: React.FC<ArticleDetailProps> = ({
  article,
  onClose,
  onRelatedArticlePress,
  relatedArticles = [],
}) => {
  const { theme, isDarkMode } = useTheme();
  const [helpful, setHelpful] = useState<boolean | null>(null);

  const handleShare = async () => {
    haptics.trigger(HapticType.MEDIUM);
    try {
      await Share.share({
        message: `${article.title}\n\n${article.subtitle || ''}\n\nYams Score - Centre d'aide`,
        title: article.title,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const handleHelpful = (value: boolean) => {
    haptics.trigger(HapticType.SUCCESS);
    setHelpful(value);

    // TODO: Enregistrer le feedback
    console.log('Article helpful:', value);
  };

  const bgColor = isDarkMode ? '#0A0A0A' : '#FFFFFF';
  const textColor = isDarkMode ? '#FFFFFF' : '#1A1A1A';
  const subtitleColor = isDarkMode ? 'rgba(255,255,255,0.7)' : '#666666';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
          <Text style={styles.shareIcon}>📤</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          {/* Category */}
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryIcon}>{article.icon}</Text>
            <Text style={styles.categoryText}>Article d'aide</Text>
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: textColor }]}>{article.title}</Text>

          {/* Meta */}
          <View style={styles.meta}>
            {article.views && (
              <View style={styles.metaItem}>
                <Text style={styles.metaIcon}>👁️</Text>
                <Text style={[styles.metaText, { color: subtitleColor }]}>
                  {article.views}
                </Text>
              </View>
            )}
            {article.readTime && (
              <View style={styles.metaItem}>
                <Text style={styles.metaIcon}>⏱️</Text>
                <Text style={[styles.metaText, { color: subtitleColor }]}>
                  {article.readTime}
                </Text>
              </View>
            )}
          </View>

          {/* Tags */}
          {article.tags.length > 0 && (
            <View style={styles.tags}>
              {article.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Markdown Content */}
        <View style={styles.markdownContainer}>
          <Markdown
            style={markdownStyles(isDarkMode)}
          >
            {article.content}
          </Markdown>
        </View>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <View style={styles.relatedSection}>
            <Text style={[styles.relatedTitle, { color: textColor }]}>
              Articles Connexes
            </Text>

            {relatedArticles.map((related) => (
              <TouchableOpacity
                key={related.id}
                onPress={() => onRelatedArticlePress(related.id)}
                style={[styles.relatedCard, { backgroundColor: isDarkMode ? '#1E1E1E' : '#F5F5F5' }]}
              >
                <Text style={styles.relatedIcon}>{related.icon}</Text>
                <View style={styles.relatedContent}>
                  <Text style={[styles.relatedCardTitle, { color: textColor }]} numberOfLines={2}>
                    {related.title}
                  </Text>
                  {related.readTime && (
                    <Text style={[styles.relatedReadTime, { color: subtitleColor }]}>
                      ⏱️ {related.readTime}
                    </Text>
                  )}
                </View>
                <Text style={styles.relatedArrow}>→</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Helpful Section */}
        <View style={styles.helpfulSection}>
          <Text style={[styles.helpfulQuestion, { color: textColor }]}>
            Cet article t'a aidé ?
          </Text>

          <View style={styles.helpfulButtons}>
            <TouchableOpacity
              onPress={() => handleHelpful(true)}
              style={[
                styles.helpfulButton,
                styles.yesButton,
                helpful === true && styles.helpfulButtonActive,
              ]}
            >
              <Text style={styles.helpfulButtonText}>Oui 👍</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleHelpful(false)}
              style={[
                styles.helpfulButton,
                styles.noButton,
                helpful === false && styles.helpfulButtonActive,
              ]}
            >
              <Text style={styles.helpfulButtonText}>Non 👎</Text>
            </TouchableOpacity>
          </View>

          {helpful !== null && (
            <Text style={[styles.thankYou, { color: subtitleColor }]}>
              {helpful ? 'Merci pour ton feedback ! 🙏' : 'Merci, nous allons améliorer cet article.'}
            </Text>
          )}
        </View>

        {/* Contact Support */}
        <TouchableOpacity style={styles.contactButton}>
          <Text style={styles.contactButtonText}>Contacter le support</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const markdownStyles = (isDarkMode: boolean) => StyleSheet.create({
  body: {
    fontSize: 17,
    lineHeight: 27,
    color: isDarkMode ? '#FFFFFF' : '#333333',
  },
  heading1: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 32,
    marginBottom: 16,
    color: isDarkMode ? '#FFFFFF' : '#1A1A1A',
  },
  heading2: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 12,
    color: isDarkMode ? '#FFFFFF' : '#1A1A1A',
  },
  heading3: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 20,
    marginBottom: 10,
    color: isDarkMode ? '#FFFFFF' : '#1A1A1A',
  },
  paragraph: {
    marginBottom: 16,
    fontSize: 17,
    lineHeight: 27,
    color: isDarkMode ? 'rgba(255,255,255,0.9)' : '#333333',
  },
  bullet_list: {
    marginBottom: 16,
  },
  ordered_list: {
    marginBottom: 16,
  },
  list_item: {
    marginBottom: 8,
    fontSize: 17,
    lineHeight: 27,
    color: isDarkMode ? 'rgba(255,255,255,0.9)' : '#333333',
  },
  code_inline: {
    backgroundColor: isDarkMode ? '#2A2A2A' : '#F5F5F5',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: 16,
    fontFamily: 'Courier',
  },
  code_block: {
    backgroundColor: isDarkMode ? '#2A2A2A' : '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    fontSize: 15,
    fontFamily: 'Courier',
  },
  strong: {
    fontWeight: 'bold',
    color: isDarkMode ? '#FFFFFF' : '#1A1A1A',
  },
  em: {
    fontStyle: 'italic',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: '#4A90E2',
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareIcon: {
    fontSize: 20,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  hero: {
    marginBottom: 24,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 16,
    gap: 6,
  },
  categoryIcon: {
    fontSize: 16,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4A90E2',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 36,
    marginBottom: 12,
  },
  meta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaIcon: {
    fontSize: 14,
  },
  metaText: {
    fontSize: 14,
  },
  tags: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: 'rgba(80, 200, 120, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#50C878',
  },
  markdownContainer: {
    marginBottom: 32,
  },
  relatedSection: {
    marginBottom: 32,
  },
  relatedTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  relatedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  relatedIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  relatedContent: {
    flex: 1,
  },
  relatedCardTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  relatedReadTime: {
    fontSize: 12,
  },
  relatedArrow: {
    fontSize: 18,
    color: '#4A90E2',
    marginLeft: 8,
  },
  helpfulSection: {
    alignItems: 'center',
    paddingVertical: 24,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    marginBottom: 24,
  },
  helpfulQuestion: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 16,
  },
  helpfulButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  helpfulButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
  },
  yesButton: {
    borderColor: '#50C878',
    backgroundColor: 'rgba(80, 200, 120, 0.1)',
  },
  noButton: {
    borderColor: '#FF6B6B',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
  },
  helpfulButtonActive: {
    opacity: 0.5,
  },
  helpfulButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  thankYou: {
    marginTop: 12,
    fontSize: 14,
    fontStyle: 'italic',
  },
  contactButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 32,
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
