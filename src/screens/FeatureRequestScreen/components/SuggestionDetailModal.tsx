/**
 * Modal de Détails d'une Suggestion - Vue Complète Ultra-Premium
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Share,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { statusLabels, getSuggestionById } from '../data/suggestions';
import { getCommentsBySuggestionId } from '../data/comments';
import { CommentItem } from './CommentItem';
import { DevelopmentTimeline } from './DevelopmentTimeline';
import { ReactionButton } from './ReactionButton';
import { CommentFormModal } from './CommentFormModal';
import { haptics } from '../../../utils/haptics';

interface Props {
  visible: boolean;
  suggestionId: string | null;
  onClose: () => void;
  onRelatedPress?: (suggestionId: string) => void;
  isDarkMode?: boolean;
}

export const SuggestionDetailModal: React.FC<Props> = ({
  visible,
  suggestionId,
  onClose,
  isDarkMode = false,
}) => {
  const [userReactions, setUserReactions] = useState<Set<string>>(new Set());
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [replyTo, setReplyTo] = useState<{ id: string; authorName: string } | undefined>();

  if (!suggestionId) return null;

  const suggestion = getSuggestionById(suggestionId);
  if (!suggestion) return null;

  const comments = getCommentsBySuggestionId(suggestionId);
  const status = statusLabels[suggestion.status];

  const bgColor = isDarkMode ? '#0A0A0A' : '#F5F5F5';
  const cardBgColor = isDarkMode ? '#1A1A1A' : '#FFFFFF';
  const textColor = isDarkMode ? '#FFFFFF' : '#1A1A1A';
  const subtextColor = isDarkMode ? '#AAAAAA' : '#666666';

  // Réactions disponibles
  const availableReactions = [
    { emoji: '👍', label: 'Like' },
    { emoji: '❤️', label: 'Love' },
    { emoji: '🎉', label: 'Celebrate' },
    { emoji: '💡', label: 'Brilliant' },
    { emoji: '🔥', label: 'Fire' },
    { emoji: '🤔', label: 'Thinking' },
  ];

  const handleReaction = (emoji: string) => {
    haptics.light();
    if (userReactions.has(emoji)) {
      // Retirer réaction
      const newReactions = new Set(userReactions);
      newReactions.delete(emoji);
      setUserReactions(newReactions);
    } else {
      // Ajouter réaction
      setUserReactions(new Set(userReactions).add(emoji));
    }
  };

  const handleCommentReaction = (commentId: string, emoji: string) => {
    haptics.light();
    Alert.alert('Réaction', `Réaction ${emoji} ajoutée au commentaire !`);
  };

  const handleShare = async () => {
    haptics.light();
    try {
      await Share.share({
        message: `Découvrez cette suggestion sur Yams Score: "${suggestion.title}" 🎲\n\n${suggestion.description}`,
        title: suggestion.title,
      });
    } catch (error) {
      console.error('Erreur partage:', error);
    }
  };

  const handleVote = () => {
    haptics.medium();
    Alert.alert(
      'Vote enregistré ! 🎉',
      '+1 XP • Merci pour votre soutien',
      [{ text: 'OK', style: 'default' }]
    );
  };

  const handleAddComment = () => {
    haptics.light();
    setReplyTo(undefined);
    setShowCommentForm(true);
  };

  const handleReplyToComment = (commentId: string, authorName: string) => {
    haptics.light();
    setReplyTo({ id: commentId, authorName });
    setShowCommentForm(true);
  };

  const handleSubmitComment = (_content: string) => {
    haptics.success();
    // Dans une vraie app, on enverrait ça au backend
    Alert.alert(
      'Commentaire publié ! 🎉',
      '+2 XP • Merci pour votre contribution',
      [{ text: 'OK', style: 'default' }]
    );
    setShowCommentForm(false);
    setReplyTo(undefined);
  };

  const handleCloseCommentForm = () => {
    haptics.light();
    setShowCommentForm(false);
    setReplyTo(undefined);
  };

  const handleClose = () => {
    haptics.light();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: cardBgColor }]}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: textColor }]}>
            Détails
          </Text>
          <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
            <Text style={styles.shareIcon}>🔗</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Featured Badge */}
          {suggestion.featured && (
            <View style={styles.featuredBadgeContainer}>
              <LinearGradient
                colors={['#FFD700', '#FFA500']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.featuredBadge}
              >
                <Text style={styles.featuredText}>⭐ FEATURED</Text>
              </LinearGradient>
            </View>
          )}

          {/* Main Card */}
          <View style={[styles.mainCard, { backgroundColor: cardBgColor }]}>
            {/* Author */}
            <View style={styles.authorSection}>
              <Text style={styles.authorEmoji}>{suggestion.author.emoji}</Text>
              <View style={styles.authorInfo}>
                <Text style={[styles.authorName, { color: textColor }]}>
                  {suggestion.author.name}
                </Text>
                <Text style={[styles.authorBadge, { color: subtextColor }]}>
                  {suggestion.author.badge === 'gold' && '🥇'}
                  {suggestion.author.badge === 'silver' && '🥈'}
                  {suggestion.author.badge === 'bronze' && '🥉'}
                  {suggestion.author.badge === 'platinum' && '💎'}
                  {suggestion.author.badge === 'legend' && '👑'}{' '}
                  {suggestion.author.badge.charAt(0).toUpperCase() +
                    suggestion.author.badge.slice(1)}{' '}
                  • Level {suggestion.author.level}
                </Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: status.color + '20' },
                ]}
              >
                <Text style={styles.statusEmoji}>{status.emoji}</Text>
                <Text style={[styles.statusText, { color: status.color }]}>
                  {status.label}
                </Text>
              </View>
            </View>

            {/* Title & Description */}
            <Text style={[styles.title, { color: textColor }]}>
              {suggestion.title}
            </Text>
            <Text style={[styles.description, { color: subtextColor }]}>
              {suggestion.description}
            </Text>

            {/* Tags */}
            <View style={styles.tags}>
              {suggestion.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>

            {/* Stats */}
            <View style={styles.stats}>
              <View style={styles.stat}>
                <Text style={styles.statIcon}>👁️</Text>
                <Text style={[styles.statText, { color: subtextColor }]}>
                  {suggestion.votes * 3} vues
                </Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statIcon}>💬</Text>
                <Text style={[styles.statText, { color: subtextColor }]}>
                  {suggestion.commentCount} commentaires
                </Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statIcon}>📅</Text>
                <Text style={[styles.statText, { color: subtextColor }]}>
                  {formatDate(suggestion.createdAt)}
                </Text>
              </View>
            </View>
          </View>

          {/* Vote & Reactions */}
          <View style={[styles.actionsCard, { backgroundColor: cardBgColor }]}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              Réactions
            </Text>

            {/* Vote Button */}
            <TouchableOpacity
              style={styles.voteButton}
              onPress={handleVote}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={['#4A90E2', '#2E5C8A']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.voteGradient}
              >
                <Text style={styles.voteIcon}>👍</Text>
                <Text style={styles.voteText}>
                  Voter ({suggestion.votes})
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Reactions */}
            <View style={styles.reactions}>
              {availableReactions.map((reaction, index) => (
                <ReactionButton
                  key={index}
                  emoji={reaction.emoji}
                  count={Math.floor(Math.random() * 20)}
                  userReacted={userReactions.has(reaction.emoji)}
                  onPress={() => handleReaction(reaction.emoji)}
                  isDarkMode={isDarkMode}
                />
              ))}
            </View>
          </View>

          {/* Development Timeline */}
          <View style={[styles.timelineCard, { backgroundColor: cardBgColor }]}>
            <DevelopmentTimeline
              suggestion={suggestion}
              isDarkMode={isDarkMode}
            />
          </View>

          {/* Comments */}
          {comments.length > 0 && (
            <View style={[styles.commentsCard, { backgroundColor: cardBgColor }]}>
              <Text style={[styles.sectionTitle, { color: textColor }]}>
                💬 Commentaires ({comments.length})
              </Text>

              {comments.map(comment => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  onReaction={handleCommentReaction}
                  onReply={handleReplyToComment}
                  isDarkMode={isDarkMode}
                />
              ))}

              {/* Add Comment Button */}
              <TouchableOpacity
                style={styles.addCommentButton}
                onPress={handleAddComment}
              >
                <Text style={styles.addCommentIcon}>💬</Text>
                <Text style={styles.addCommentText}>
                  Ajouter un commentaire
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Bottom Spacing */}
          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>

      {/* Comment Form Modal */}
      <CommentFormModal
        visible={showCommentForm}
        onClose={handleCloseCommentForm}
        onSubmit={handleSubmitComment}
        replyTo={replyTo}
        isDarkMode={isDarkMode}
      />
    </Modal>
  );
};

// Helper function
function formatDate(date: Date): string {
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 24,
    color: '#666666',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  shareButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
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
  featuredBadgeContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  featuredBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  featuredText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  mainCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 16,
  },
  authorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  authorEmoji: {
    fontSize: 40,
    marginRight: 12,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
  },
  authorBadge: {
    fontSize: 12,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  statusEmoji: {
    fontSize: 14,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    lineHeight: 32,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  stats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statIcon: {
    fontSize: 16,
  },
  statText: {
    fontSize: 13,
  },
  actionsCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  voteButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  voteGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 10,
  },
  voteIcon: {
    fontSize: 24,
  },
  voteText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  reactions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timelineCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 16,
  },
  commentsCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 16,
  },
  addCommentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#4A90E2',
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 8,
    gap: 8,
  },
  addCommentIcon: {
    fontSize: 20,
  },
  addCommentText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A90E2',
  },
});
