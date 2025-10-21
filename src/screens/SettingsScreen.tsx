/**
 * Settings Screen Ultra-Premium
 * Version 6.0 - Transformation complète de l'expérience Settings
 */

import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  StatusBar,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { getColors } from '../constants';
import { haptics } from '../utils/haptics';
import { setUserName, setUserEmoji } from '../store/slices/settingsSlice';

// Components
import HeroHeader from './SettingsScreen/components/HeroHeader';
import QuickActions from './SettingsScreen/components/QuickActions';
import ProfileEditModal from './SettingsScreen/components/ProfileEditModal';

// Sections
import AppearanceSection from './SettingsScreen/sections/AppearanceSection';
import SoundVibrationSection from './SettingsScreen/sections/SoundVibrationSection';
import GameSection from './SettingsScreen/sections/GameSection';
import SupportSection from './SettingsScreen/sections/SupportSection';
import AboutSection from './SettingsScreen/sections/AboutSection';

const SettingsScreenPremium: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.settings.theme);
  const userName = useAppSelector((state) => state.settings.userName);
  const userEmoji = useAppSelector((state) => state.settings.userEmoji);
  const colors = getColors(theme);

  const [profileModalVisible, setProfileModalVisible] = useState(false);

  // Mock stats - À remplacer par les vraies données
  const totalGames = 24;
  const totalWins = 18;
  const level = 5;

  const handleBack = () => {
    haptics.light();
    navigation.goBack();
  };

  const handleEditProfile = () => {
    haptics.light();
    setProfileModalVisible(true);
  };

  const handleSaveProfile = (name: string, emoji: string) => {
    dispatch(setUserName(name));
    dispatch(setUserEmoji(emoji));
  };

  const handleAchievements = () => {
    haptics.light();
    // @ts-ignore
    navigation.navigate('Achievements');
  };

  const handleEmojiTap = () => {
    haptics.light();
    setProfileModalVisible(true);
  };

  return (
    <View style={[styles.container, { backgroundColor: '#F5F5F5' }]}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Header */}
        <HeroHeader
          userName={userName}
          userEmoji={userEmoji}
          totalGames={totalGames}
          totalWins={totalWins}
          level={level}
          onEditProfile={handleEditProfile}
          onEmojiTap={handleEmojiTap}
        />

        {/* Quick Actions */}
        <QuickActions
          onEditProfile={handleEditProfile}
          onAchievements={handleAchievements}
          hasNewAchievements={false}
          newAchievementsCount={0}
        />

        {/* Settings Sections */}
        <View style={styles.sectionsContainer}>
          <AppearanceSection />
          <SoundVibrationSection />
          <GameSection />
          <SupportSection />
          <AboutSection />
        </View>

        {/* Spacing at bottom */}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Back Button - Floating */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={handleBack}
        activeOpacity={0.8}
      >
        <Text style={styles.backButtonText}>← Retour</Text>
      </TouchableOpacity>

      {/* Profile Edit Modal */}
      <ProfileEditModal
        visible={profileModalVisible}
        currentName={userName}
        currentEmoji={userEmoji}
        onClose={() => setProfileModalVisible(false)}
        onSave={handleSaveProfile}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  sectionsContainer: {
    paddingTop: 8,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default SettingsScreenPremium;
