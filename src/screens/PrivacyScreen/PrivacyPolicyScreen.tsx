import React from 'react';
import {ScrollView, StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {HeroSection} from './components/HeroSection';
import {TLDRCard} from './components/TLDRCard';
import {DataCollectionCard} from './components/DataCollectionCard';
import {PrivacyControls} from './components/PrivacyControls';
import {ThirdPartyCard} from './components/ThirdPartyCard';
import {RetentionTimeline} from './components/RetentionTimeline';
import {RightsCard} from './components/RightsCard';
import {NutritionLabel} from './components/NutritionLabel';
import {haptics} from '../../utils/haptics';

export const PrivacyPolicyScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleGoBack = () => {
    haptics.light();
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header avec bouton retour */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleGoBack}
          style={styles.backButton}
          activeOpacity={0.7}>
          <Text style={styles.backIcon}>←</Text>
          <Text style={styles.backText}>Retour</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Hero Section avec gradient et animation */}
        <HeroSection />

        {/* TL;DR - Résumé en 30 secondes */}
        <TLDRCard />

        {/* Ce qu'on collecte (et pourquoi) */}
        <DataCollectionCard />

        {/* Contrôles de confidentialité */}
        <PrivacyControls />

        {/* Services tiers */}
        <ThirdPartyCard />

        {/* Timeline de rétention */}
        <RetentionTimeline />

        {/* Tes droits RGPD */}
        <RightsCard />

        {/* Privacy Nutrition Label */}
        <NutritionLabel />

        {/* Spacing bottom */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  bottomSpacing: {
    height: 40,
  },
});
