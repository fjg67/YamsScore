/**
 * Composant Commentaire
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Comment } from '../data/comments';
import { ReactionButton } from './ReactionButton';
import { haptics } from '../../../utils/haptics';

interface Props {
  comment: Comment;
  onReaction: (commentId: string, emoji: string) => void;
  onReply?: (commentId: string, authorName: string) => void;
  isDarkMode?: boolean;
}

export const CommentItem: React.FC<Props> = ({
  comment,
  onReaction,
  onReply,
  isDarkMode = false,
}) => {
  const handleReaction = (emoji: string) => {
    haptics.light();
    onReaction(comment.id, emoji);
  };

  const handleReply = () => {
    if (onReply) {
      haptics.light();
      onReply(comment.id, comment.author.name);
    }
  };

  const textColor = isDarkMode ? '#FFFFFF' : '#1A1A1A';
  const subtextColor = isDarkMode ? '#AAAAAA' : '#666666';
  const bgColor = comment.isOfficialResponse
    ? isDarkMode
      ? '#1A3A1A'
      : '#E8F5E9'
    : 'transparent';

  const timeAgo = formatTimeAgo(comment.createdAt);

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      {/* Official Badge */}
      {comment.isOfficialResponse && (
        <View style={styles.officialBadge}>
          <Text style={styles.officialBadgeText}>👨‍💻 RÉPONSE OFFICIELLE</Text>
        </View>
      )}

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.emoji}>{comment.author.emoji}</Text>
        <View style={styles.authorInfo}>
          <Text style={[styles.authorName, { color: textColor }]}>
            {comment.author.name}
          </Text>
          <Text style={[styles.badge, { color: subtextColor }]}>
            {comment.author.badge === 'gold' && '🥇'}
            {comment.author.badge === 'silver' && '🥈'}
            {comment.author.badge === 'bronze' && '🥉'}
            {comment.author.badge === 'platinum' && '💎'}
            {comment.author.badge === 'legend' && '👑'}{' '}
            {comment.author.badge.charAt(0).toUpperCase() +
              comment.author.badge.slice(1)}{' '}
            • {timeAgo}
          </Text>
        </View>
      </View>

      {/* Content */}
      <Text style={[styles.content, { color: textColor }]}>
        {comment.content}
      </Text>

      {/* Actions */}
      <View style={styles.actions}>
        {/* Reactions */}
        {comment.reactions.length > 0 && (
          <View style={styles.reactions}>
            {comment.reactions.map((reaction, index) => (
              <ReactionButton
                key={index}
                emoji={reaction.emoji}
                count={reaction.count}
                userReacted={reaction.userReacted}
                onPress={() => handleReaction(reaction.emoji)}
                isDarkMode={isDarkMode}
              />
            ))}
          </View>
        )}

        {/* Reply Button */}
        {onReply && !comment.isOfficialResponse && (
          <TouchableOpacity
            style={styles.replyButton}
            onPress={handleReply}
          >
            <Text style={[styles.replyText, { color: subtextColor }]}>
              💬 Répondre
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <View style={styles.repliesContainer}>
          {comment.replies.map(reply => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReaction={onReaction}
              onReply={onReply}
              isDarkMode={isDarkMode}
            />
          ))}
        </View>
      )}
    </View>
  );
};

// Helper function pour formater le temps
function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'À l\'instant';
  if (diffInSeconds < 3600)
    return `il y a ${Math.floor(diffInSeconds / 60)} min`;
  if (diffInSeconds < 86400)
    return `il y a ${Math.floor(diffInSeconds / 3600)}h`;
  if (diffInSeconds < 604800)
    return `il y a ${Math.floor(diffInSeconds / 86400)} jours`;
  return date.toLocaleDateString('fr-FR');
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  officialBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  officialBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  emoji: {
    fontSize: 28,
    marginRight: 8,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 15,
    fontWeight: '600',
  },
  badge: {
    fontSize: 11,
    marginTop: 2,
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 4,
  },
  reactions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  replyButton: {
    paddingVertical: 4,
  },
  replyText: {
    fontSize: 13,
    fontWeight: '600',
  },
  repliesContainer: {
    marginLeft: 36,
    marginTop: 8,
    paddingLeft: 12,
    borderLeftWidth: 2,
    borderLeftColor: '#E0E0E0',
  },
});
