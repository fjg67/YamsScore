/**
 * AvatarPicker - Bottom Sheet Premium
 * Permet de choisir un emoji et une couleur pour le joueur
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
} from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import LinearGradient from 'react-native-linear-gradient';
import { EMOJI_CATEGORIES } from '../utils/emojiAvatars';
import { getAllColors, PlayerColorConfig } from '../utils/playerColors';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface AvatarPickerProps {
  visible: boolean;
  currentEmoji: string;
  currentColor: PlayerColorConfig;
  onClose: () => void;
  onSelectEmoji: (emoji: string) => void;
  onSelectColor: (color: PlayerColorConfig) => void;
}

const AvatarPicker: React.FC<AvatarPickerProps> = ({
  visible,
  currentEmoji,
  currentColor,
  onClose,
  onSelectEmoji,
  onSelectColor,
}) => {
  const [activeTab, setActiveTab] = useState<'emoji' | 'color'>('emoji');
  const allColors = getAllColors();

  const handleSelectEmoji = (emoji: string) => {
    ReactNativeHapticFeedback.trigger('impactLight');
    onSelectEmoji(emoji);
    // Auto-close après sélection
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const handleSelectColor = (color: PlayerColorConfig) => {
    ReactNativeHapticFeedback.trigger('impactLight');
    onSelectColor(color);
    // Auto-close après sélection
    setTimeout(() => {
      onClose();
    }, 200);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(200)}
        style={styles.backdrop}
      >
        <TouchableOpacity
          style={styles.backdropTouchable}
          activeOpacity={1}
          onPress={onClose}
        />

        <Animated.View
          entering={SlideInDown.duration(400).springify().damping(20)}
          exiting={SlideOutDown.duration(300)}
          style={styles.sheet}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Choisis ton avatar</Text>
              <Text style={styles.subtitle}>Emoji ou couleur</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Tabs */}
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'emoji' && styles.tabActive]}
              onPress={() => {
                setActiveTab('emoji');
                ReactNativeHapticFeedback.trigger('impactLight');
              }}
            >
              <Text style={[styles.tabText, activeTab === 'emoji' && styles.tabTextActive]}>
                😀 Emoji
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'color' && styles.tabActive]}
              onPress={() => {
                setActiveTab('color');
                ReactNativeHapticFeedback.trigger('impactLight');
              }}
            >
              <Text style={[styles.tabText, activeTab === 'color' && styles.tabTextActive]}>
                🎨 Couleur
              </Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {activeTab === 'emoji' ? (
              <View style={styles.emojiContent}>
                {EMOJI_CATEGORIES.map((category, catIndex) => (
                  <View key={catIndex} style={styles.categorySection}>
                    <Text style={styles.categoryTitle}>{category.name}</Text>
                    <View style={styles.emojiGrid}>
                      {category.emojis.map((emoji, emojiIndex) => (
                        <TouchableOpacity
                          key={emojiIndex}
                          style={[
                            styles.emojiButton,
                            emoji === currentEmoji && styles.emojiButtonSelected,
                          ]}
                          onPress={() => handleSelectEmoji(emoji)}
                        >
                          <Text style={styles.emojiText}>{emoji}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.colorContent}>
                <View style={styles.colorGrid}>
                  {allColors.map((color, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleSelectColor(color)}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={color.gradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[
                          styles.colorButton,
                          color.hex === currentColor.hex && styles.colorButtonSelected,
                        ]}
                      >
                        {color.hex === currentColor.hex && (
                          <Text style={styles.checkmark}>✓</Text>
                        )}
                      </LinearGradient>
                      <Text style={styles.colorName}>{color.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  backdropTouchable: {
    flex: 1,
  },
  sheet: {
    height: SCREEN_HEIGHT * 0.65,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.15,
    shadowRadius: 32,
    elevation: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    fontSize: 24,
    color: '#999999',
  },
  tabs: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#4A90E2',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emojiContent: {
    paddingBottom: 20,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  emojiButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(74, 144, 226, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiButtonSelected: {
    backgroundColor: '#4A90E2',
    borderWidth: 3,
    borderColor: '#4A90E2',
    transform: [{ scale: 1.1 }],
  },
  emojiText: {
    fontSize: 28,
  },
  colorContent: {
    paddingVertical: 20,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  colorButton: {
    width: 64,
    height: 64,
    borderRadius: 16,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  colorButtonSelected: {
    transform: [{ scale: 1.1 }],
    borderColor: '#4A90E2',
  },
  checkmark: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  colorName: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    marginTop: 4,
  },
});

export default AvatarPicker;
