import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import HeroSection from './sections/HeroSection';
import MissionSection from './sections/MissionSection';
import StatsShowcase from './sections/StatsShowcase';
import TeamSection from './sections/TeamSection';
import UserStories from './sections/UserStories';
import RoadmapSection from './sections/RoadmapSection';
import ValuesSection from './sections/ValuesSection';
import CommunitySection from './sections/CommunitySection';
import CTASection from './sections/CTASection';
import LegalFooter from './sections/LegalFooter';
import { haptics } from '../../utils/haptics';

const AboutScreen = () => {
  const navigation = useNavigation();

  const handleGoBack = () => {
    haptics.light();
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header avec bouton retour */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleGoBack}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>←</Text>
          <Text style={styles.backText}>Accueil</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <HeroSection />
        <View style={styles.content}>
          <MissionSection />
          <StatsShowcase />
          <TeamSection />
          <UserStories />
          <RoadmapSection />
          <ValuesSection />
          <CommunitySection />
          <CTASection />
          <LegalFooter />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    alignSelf: 'flex-start',
  },
  backIcon: {
    fontSize: 24,
    color: '#4A90E2',
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A90E2',
  },
  container: {
    flex: 1,
  },
  content: {
    backgroundColor: '#F8F9FA',
  },
});

export default AboutScreen;
