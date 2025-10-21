/**
 * Profile Edit Modal - Edit Name & Emoji
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { haptics } from '../../../utils/haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Emojis populaires pour avatar
const EMOJI_OPTIONS = [
  '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂',
  '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩',
  '😎', '🤓', '🧐', '🤠', '🥳', '🤡', '🤖', '👻',
  '👽', '🎃', '😺', '😸', '😹', '😻', '😼', '😽',
  '🦁', '🐯', '🦊', '🐻', '🐼', '🐨', '🐸', '🐵',
  '🙈', '🙉', '🙊', '🦄', '🐲', '🐉', '🦖', '🦕',
  '⚡', '🔥', '✨', '⭐', '🌟', '💫', '🌈', '☀️',
  '🌙', '💎', '👑', '🏆', '🎯', '🎲', '🎮', '🎸',
];

interface ProfileEditModalProps {
  visible: boolean;
  currentName: string;
  currentEmoji: string;
  onClose: () => void;
  onSave: (name: string, emoji: string) => void;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  visible,
  currentName,
  currentEmoji,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(currentName);
  const [selectedEmoji, setSelectedEmoji] = useState(currentEmoji);

  const handleEmojiSelect = (emoji: string) => {
    haptics.light();
    setSelectedEmoji(emoji);
  };

  const handleSave = () => {
    if (name.trim().length === 0) {
      haptics.error();
      return;
    }

    haptics.success();
    onSave(name, selectedEmoji);
    onClose();
  };

  const handleCancel = () => {
    haptics.light();
    // Reset to current values
    setName(currentName);
    setSelectedEmoji(currentEmoji);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Modifier le profil</Text>
          </View>

          {/* Current Avatar Preview */}
          <View style={styles.previewContainer}>
            <View style={styles.avatarPreview}>
              <Text style={styles.previewEmoji}>{selectedEmoji}</Text>
            </View>
            <Text style={styles.previewName}>{name || 'Ton nom'}</Text>
          </View>

          {/* Name Input */}
          <View style={styles.section}>
            <Text style={styles.label}>Nom</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Entre ton nom"
              placeholderTextColor="#999999"
              maxLength={20}
              autoCapitalize="words"
              autoCorrect={false}
            />
            <Text style={styles.charCount}>{name.length}/20</Text>
          </View>

          {/* Emoji Picker */}
          <View style={styles.section}>
            <Text style={styles.label}>Avatar Emoji</Text>
            <ScrollView
              style={styles.emojiScroll}
              contentContainerStyle={styles.emojiGrid}
              showsVerticalScrollIndicator={false}
            >
              {EMOJI_OPTIONS.map((emoji, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.emojiButton,
                    selectedEmoji === emoji && styles.emojiButtonSelected,
                  ]}
                  onPress={() => handleEmojiSelect(emoji)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.emoji}>{emoji}</Text>
                  {selectedEmoji === emoji && (
                    <View style={styles.selectedIndicator}>
                      <Text style={styles.checkmark}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.saveButton,
                name.trim().length === 0 && styles.saveButtonDisabled,
              ]}
              onPress={handleSave}
              activeOpacity={0.8}
              disabled={name.trim().length === 0}
            >
              <Text style={styles.saveButtonText}>Sauvegarder</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: SCREEN_WIDTH - 40,
    maxHeight: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  previewContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarPreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  previewEmoji: {
    fontSize: 50,
  },
  previewName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1A1A1A',
  },
  charCount: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'right',
    marginTop: 4,
  },
  emojiScroll: {
    maxHeight: 200,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  emojiButton: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  emojiButtonSelected: {
    backgroundColor: '#4A90E2',
  },
  emoji: {
    fontSize: 32,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    fontSize: 12,
    color: '#4A90E2',
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#F0F0F0',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },
  saveButton: {
    backgroundColor: '#4A90E2',
  },
  saveButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default ProfileEditModal;
