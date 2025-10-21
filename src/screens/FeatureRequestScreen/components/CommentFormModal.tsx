/**
 * Formulaire de Commentaire Ultra-Premium
 * Support Markdown, Preview, Mentions
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { haptics } from '../../../utils/haptics';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (content: string) => void;
  replyTo?: {
    id: string;
    authorName: string;
  };
  isDarkMode?: boolean;
}

export const CommentFormModal: React.FC<Props> = ({
  visible,
  onClose,
  onSubmit,
  replyTo,
  isDarkMode = false,
}) => {
  const [content, setContent] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const bgColor = isDarkMode ? '#0A0A0A' : '#F5F5F5';
  const cardBgColor = isDarkMode ? '#1A1A1A' : '#FFFFFF';
  const textColor = isDarkMode ? '#FFFFFF' : '#1A1A1A';
  const subtextColor = isDarkMode ? '#AAAAAA' : '#666666';
  const inputBgColor = isDarkMode ? '#2A2A2A' : '#F8F8F8';
  const borderColor = isDarkMode ? '#3A3A3A' : '#E0E0E0';

  const handleClose = () => {
    haptics.light();
    if (content.trim().length > 0) {
      Alert.alert(
        'Abandonner le commentaire ?',
        'Votre commentaire sera perdu.',
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Abandonner',
            style: 'destructive',
            onPress: () => {
              setContent('');
              onClose();
            },
          },
        ]
      );
    } else {
      onClose();
    }
  };

  const handleSubmit = () => {
    if (content.trim().length === 0) {
      haptics.warning();
      Alert.alert('Erreur', 'Le commentaire ne peut pas être vide');
      return;
    }

    haptics.success();
    onSubmit(content);
    setContent('');
    onClose();
  };

  const handleTogglePreview = () => {
    haptics.light();
    setShowPreview(!showPreview);
  };

  // Markdown helpers
  const insertMarkdown = (type: 'bold' | 'italic' | 'code' | 'link') => {
    haptics.light();
    let before = '';
    let after = '';
    let placeholder = '';

    switch (type) {
      case 'bold':
        before = '**';
        after = '**';
        placeholder = 'texte en gras';
        break;
      case 'italic':
        before = '_';
        after = '_';
        placeholder = 'texte en italique';
        break;
      case 'code':
        before = '`';
        after = '`';
        placeholder = 'code';
        break;
      case 'link':
        before = '[';
        after = '](url)';
        placeholder = 'texte du lien';
        break;
    }

    setContent(content + before + placeholder + after);
  };

  // Note: Preview rendering would be handled by a markdown library in production

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          {/* Header */}
          <View style={[styles.header, { backgroundColor: cardBgColor, borderBottomColor: borderColor }]}>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={[styles.closeText, { color: subtextColor }]}>
                Annuler
              </Text>
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: textColor }]}>
              {replyTo ? `Répondre à @${replyTo.authorName}` : 'Nouveau commentaire'}
            </Text>
            <TouchableOpacity
              onPress={handleSubmit}
              style={styles.submitButton}
              disabled={content.trim().length === 0}
            >
              <Text
                style={[
                  styles.submitText,
                  {
                    color:
                      content.trim().length > 0 ? '#4A90E2' : subtextColor,
                  },
                ]}
              >
                Publier
              </Text>
            </TouchableOpacity>
          </View>

          {/* Reply To Banner */}
          {replyTo && (
            <View style={[styles.replyBanner, { backgroundColor: isDarkMode ? '#2A2A2A' : '#F0F0F0' }]}>
              <Text style={[styles.replyText, { color: subtextColor }]}>
                En réponse à <Text style={[styles.replyAuthor, { color: textColor }]}>@{replyTo.authorName}</Text>
              </Text>
            </View>
          )}

          {/* Tabs */}
          <View style={[styles.tabs, { backgroundColor: cardBgColor, borderBottomColor: borderColor }]}>
            <TouchableOpacity
              style={[
                styles.tab,
                !showPreview && styles.tabActive,
              ]}
              onPress={() => setShowPreview(false)}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: !showPreview ? '#4A90E2' : subtextColor },
                ]}
              >
                ✏️ Écrire
              </Text>
              {!showPreview && <View style={styles.tabIndicator} />}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tab,
                showPreview && styles.tabActive,
              ]}
              onPress={handleTogglePreview}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: showPreview ? '#4A90E2' : subtextColor },
                ]}
              >
                👁️ Aperçu
              </Text>
              {showPreview && <View style={styles.tabIndicator} />}
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            keyboardShouldPersistTaps="handled"
          >
            {!showPreview ? (
              <>
                {/* Markdown Toolbar */}
                <View style={styles.toolbar}>
                  <TouchableOpacity
                    style={[styles.toolButton, { backgroundColor: inputBgColor }]}
                    onPress={() => insertMarkdown('bold')}
                  >
                    <Text style={styles.toolIcon}>𝐁</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.toolButton, { backgroundColor: inputBgColor }]}
                    onPress={() => insertMarkdown('italic')}
                  >
                    <Text style={styles.toolIcon}>𝐼</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.toolButton, { backgroundColor: inputBgColor }]}
                    onPress={() => insertMarkdown('code')}
                  >
                    <Text style={styles.toolIcon}>{'<>'}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.toolButton, { backgroundColor: inputBgColor }]}
                    onPress={() => insertMarkdown('link')}
                  >
                    <Text style={styles.toolIcon}>🔗</Text>
                  </TouchableOpacity>
                </View>

                {/* Text Input */}
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: inputBgColor,
                      color: textColor,
                      borderColor: borderColor,
                    },
                  ]}
                  value={content}
                  onChangeText={setContent}
                  placeholder="Partagez votre avis, posez une question..."
                  placeholderTextColor={subtextColor}
                  multiline
                  textAlignVertical="top"
                  autoFocus
                />

                {/* Character Count */}
                <Text style={[styles.charCount, { color: subtextColor }]}>
                  {content.length}/500 caractères
                </Text>

                {/* Helper Text */}
                <View style={[styles.helper, { backgroundColor: inputBgColor }]}>
                  <Text style={[styles.helperTitle, { color: textColor }]}>
                    💡 Conseils de formatage
                  </Text>
                  <Text style={[styles.helperText, { color: subtextColor }]}>
                    **gras** _italique_ `code` [lien](url)
                  </Text>
                </View>
              </>
            ) : (
              /* Preview */
              <View style={[styles.preview, { backgroundColor: inputBgColor }]}>
                <Text style={[styles.previewTitle, { color: textColor }]}>
                  Aperçu du commentaire
                </Text>
                {content.trim().length > 0 ? (
                  <Text style={[styles.previewText, { color: textColor }]}>
                    {content}
                  </Text>
                ) : (
                  <Text style={[styles.previewEmpty, { color: subtextColor }]}>
                    Écrivez quelque chose pour voir l'aperçu...
                  </Text>
                )}
              </View>
            )}
          </ScrollView>

          {/* Footer Tips */}
          <View style={[styles.footer, { backgroundColor: cardBgColor, borderTopColor: borderColor }]}>
            <Text style={[styles.footerText, { color: subtextColor }]}>
              💬 Soyez respectueux et constructif
            </Text>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: 4,
  },
  closeText: {
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  submitButton: {
    padding: 4,
  },
  submitText: {
    fontSize: 16,
    fontWeight: '600',
  },
  replyBanner: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  replyText: {
    fontSize: 14,
  },
  replyAuthor: {
    fontWeight: '600',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  tabActive: {
    // Active styling handled by indicator
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#4A90E2',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  toolbar: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  toolButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolIcon: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    minHeight: 200,
    maxHeight: 400,
  },
  charCount: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 8,
  },
  helper: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
  },
  helperTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  helperText: {
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  preview: {
    padding: 16,
    borderRadius: 12,
    minHeight: 200,
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  previewText: {
    fontSize: 15,
    lineHeight: 22,
  },
  previewEmpty: {
    fontSize: 15,
    fontStyle: 'italic',
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  footerText: {
    fontSize: 13,
    textAlign: 'center',
  },
});
