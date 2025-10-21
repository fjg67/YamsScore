/**
 * Wizard de Création de Nouvelle Suggestion Ultra-Premium
 * 6 Étapes avec Navigation, Validation, et Animations
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Animated,
} from 'react-native';
import { haptics } from '../../../utils/haptics';
import { Step1Category } from './wizard/Step1Category';
import { Step2Description } from './wizard/Step2Description';
import { Step3Image } from './wizard/Step3Image';
import { Step4Impact } from './wizard/Step4Impact';
import { Step5Duplicates } from './wizard/Step5Duplicates';
import { Step6Preview } from './wizard/Step6Preview';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (suggestionData: SuggestionFormData) => void;
  isDarkMode?: boolean;
}

export interface SuggestionFormData {
  category: string;
  title: string;
  description: string;
  hasImage: boolean;
  audience: string;
  frequency: number;
  importance: number;
}

export const NewSuggestionWizard: React.FC<Props> = ({
  visible,
  onClose,
  onSubmit,
  isDarkMode = false,
}) => {
  // Step state
  const [currentStep, setCurrentStep] = useState(1);
  const TOTAL_STEPS = 6;

  // Form data state
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hasImage, setHasImage] = useState(false);
  const [audience, setAudience] = useState('');
  const [frequency, setFrequency] = useState(0);
  const [importance, setImportance] = useState(0);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Animation
  const [slideAnim] = useState(new Animated.Value(0));

  const bgColor = isDarkMode ? '#0A0A0A' : '#F5F5F5';
  const cardBgColor = isDarkMode ? '#1A1A1A' : '#FFFFFF';
  const textColor = isDarkMode ? '#FFFFFF' : '#1A1A1A';
  const subtextColor = isDarkMode ? '#AAAAAA' : '#666666';
  const borderColor = isDarkMode ? '#3A3A3A' : '#E0E0E0';

  const stepTitles = [
    'Catégorie',
    'Description',
    'Illustration',
    'Impact',
    'Doublons',
    'Aperçu',
  ];

  const handleClose = () => {
    haptics.light();
    if (currentStep > 1 || title.length > 0 || description.length > 0) {
      Alert.alert(
        'Abandonner la création ?',
        'Votre progression sera perdue.',
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Abandonner',
            style: 'destructive',
            onPress: () => {
              resetForm();
              onClose();
            },
          },
        ]
      );
    } else {
      onClose();
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setCategory('');
    setTitle('');
    setDescription('');
    setHasImage(false);
    setAudience('');
    setFrequency(0);
    setImportance(0);
    setTermsAccepted(false);
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!category) {
          haptics.warning();
          Alert.alert('Catégorie requise', 'Veuillez sélectionner une catégorie');
          return false;
        }
        return true;

      case 2:
        if (!title.trim()) {
          haptics.warning();
          Alert.alert('Titre requis', 'Veuillez saisir un titre pour votre suggestion');
          return false;
        }
        if (title.trim().length < 10) {
          haptics.warning();
          Alert.alert('Titre trop court', 'Le titre doit contenir au moins 10 caractères');
          return false;
        }
        if (!description.trim()) {
          haptics.warning();
          Alert.alert('Description requise', 'Veuillez décrire votre suggestion');
          return false;
        }
        if (description.trim().length < 20) {
          haptics.warning();
          Alert.alert('Description trop courte', 'La description doit contenir au moins 20 caractères');
          return false;
        }
        return true;

      case 3:
        // Image is optional
        return true;

      case 4:
        if (!audience) {
          haptics.warning();
          Alert.alert('Audience requise', 'Pour qui est-ce utile ?');
          return false;
        }
        if (frequency === 0) {
          haptics.warning();
          Alert.alert('Fréquence requise', 'À quelle fréquence utiliseriez-vous cette fonctionnalité ?');
          return false;
        }
        if (importance === 0) {
          haptics.warning();
          Alert.alert('Importance requise', 'Quelle est l\'importance de cette suggestion pour vous ?');
          return false;
        }
        return true;

      case 5:
        // Duplicate check is informational
        return true;

      case 6:
        if (!termsAccepted) {
          haptics.warning();
          Alert.alert(
            'Conditions requises',
            'Veuillez accepter que votre suggestion soit publique'
          );
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      return;
    }

    haptics.light();

    if (currentStep < TOTAL_STEPS) {
      // Animate transition
      Animated.sequence([
        Animated.timing(slideAnim, {
          toValue: -50,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();

      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    haptics.light();
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleEditStep = (step: number) => {
    haptics.light();
    setCurrentStep(step);
  };

  const handleSubmit = () => {
    if (!validateStep(6)) {
      return;
    }

    haptics.success();

    const suggestionData: SuggestionFormData = {
      category,
      title,
      description,
      hasImage,
      audience,
      frequency,
      importance,
    };

    // Show success animation
    Alert.alert(
      '🎉 Suggestion publiée !',
      `Vous avez gagné +50 XP !\n\nVotre suggestion "${title}" est maintenant visible par la communauté.`,
      [
        {
          text: 'Super !',
          onPress: () => {
            resetForm();
            onSubmit(suggestionData);
          },
        },
      ]
    );
  };

  const renderStep = () => {
    const animatedStyle = {
      transform: [{ translateX: slideAnim }],
    };

    switch (currentStep) {
      case 1:
        return (
          <Animated.View style={[styles.stepContainer, animatedStyle]}>
            <Step1Category
              selectedCategory={category}
              onSelectCategory={setCategory}
              isDarkMode={isDarkMode}
            />
          </Animated.View>
        );

      case 2:
        return (
          <Animated.View style={[styles.stepContainer, animatedStyle]}>
            <Step2Description
              title={title}
              description={description}
              onChangeTitle={setTitle}
              onChangeDescription={setDescription}
              isDarkMode={isDarkMode}
            />
          </Animated.View>
        );

      case 3:
        return (
          <Animated.View style={[styles.stepContainer, animatedStyle]}>
            <Step3Image
              hasImage={hasImage}
              onAddImage={() => setHasImage(true)}
              isDarkMode={isDarkMode}
            />
          </Animated.View>
        );

      case 4:
        return (
          <Animated.View style={[styles.stepContainer, animatedStyle]}>
            <Step4Impact
              audience={audience}
              frequency={frequency}
              importance={importance}
              onChangeAudience={setAudience}
              onChangeFrequency={setFrequency}
              onChangeImportance={setImportance}
              isDarkMode={isDarkMode}
            />
          </Animated.View>
        );

      case 5:
        return (
          <Animated.View style={[styles.stepContainer, animatedStyle]}>
            <Step5Duplicates
              title={title}
              description={description}
              isDarkMode={isDarkMode}
            />
          </Animated.View>
        );

      case 6:
        return (
          <Animated.View style={[styles.stepContainer, animatedStyle]}>
            <Step6Preview
              category={category}
              title={title}
              description={description}
              hasImage={hasImage}
              audience={audience}
              frequency={frequency}
              importance={importance}
              onEdit={handleEditStep}
              onAcceptTermsChange={setTermsAccepted}
              termsAccepted={termsAccepted}
              isDarkMode={isDarkMode}
            />
          </Animated.View>
        );

      default:
        return null;
    }
  };

  const getNextButtonText = () => {
    if (currentStep === TOTAL_STEPS) {
      return '🚀 Publier';
    }
    if (currentStep === 5) {
      return 'Continuer quand même';
    }
    return 'Suivant';
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
        <View style={[styles.header, { backgroundColor: cardBgColor, borderBottomColor: borderColor }]}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Text style={[styles.closeText, { color: subtextColor }]}>
              ✕
            </Text>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={[styles.headerTitle, { color: textColor }]}>
              Nouvelle Suggestion
            </Text>
            <Text style={[styles.headerSubtitle, { color: subtextColor }]}>
              Étape {currentStep}/{TOTAL_STEPS}: {stepTitles[currentStep - 1]}
            </Text>
          </View>
          <View style={styles.closeButton} />
        </View>

        {/* Progress Indicator */}
        <View style={[styles.progressContainer, { backgroundColor: cardBgColor }]}>
          <View style={styles.progressDots}>
            {Array.from({ length: TOTAL_STEPS }).map((_, index) => (
              <View
                key={index}
                style={[
                  styles.progressDot,
                  {
                    backgroundColor:
                      index < currentStep
                        ? '#10B981'
                        : index === currentStep - 1
                        ? '#4A90E2'
                        : isDarkMode
                        ? '#3A3A3A'
                        : '#E0E0E0',
                  },
                ]}
              />
            ))}
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${(currentStep / TOTAL_STEPS) * 100}%`,
                  backgroundColor: '#4A90E2',
                },
              ]}
            />
          </View>
        </View>

        {/* Step Content */}
        <View style={styles.content}>{renderStep()}</View>

        {/* Navigation Buttons */}
        <View style={[styles.footer, { backgroundColor: cardBgColor, borderTopColor: borderColor }]}>
          <TouchableOpacity
            style={[
              styles.navButton,
              styles.backButton,
              {
                backgroundColor: isDarkMode ? '#2A2A2A' : '#F0F0F0',
                opacity: currentStep === 1 ? 0.5 : 1,
              },
            ]}
            onPress={handleBack}
            disabled={currentStep === 1}
          >
            <Text style={[styles.backButtonText, { color: textColor }]}>
              ← Retour
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, styles.nextButton]}
            onPress={currentStep === TOTAL_STEPS ? handleSubmit : handleNext}
          >
            <Text style={styles.nextButtonText}>{getNextButtonText()}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
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
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 24,
    fontWeight: '300',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  headerSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  progressContainer: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  progressDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  content: {
    flex: 1,
  },
  stepContainer: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    borderTopWidth: 1,
  },
  navButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    borderWidth: 1,
    borderColor: 'transparent',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: '#4A90E2',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
