/**
 * Étape 3: Upload d'Images/Mockups
 * Avec Mockup Tool intégré
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { haptics } from '../../../../utils/haptics';
import { MockupToolModal } from '../mockup/MockupToolModal';

interface Props {
  hasImage: boolean;
  onAddImage: () => void;
  isDarkMode?: boolean;
}

export const Step3Image: React.FC<Props> = ({
  hasImage,
  onAddImage,
  isDarkMode = false,
}) => {
  const [showMockupTool, setShowMockupTool] = useState(false);

  const textColor = isDarkMode ? '#FFFFFF' : '#1A1A1A';
  const subtextColor = isDarkMode ? '#AAAAAA' : '#666666';
  const borderColor = isDarkMode ? '#3A3A3A' : '#E0E0E0';

  const handleAddImage = () => {
    haptics.light();
    // Dans une vraie app, on utiliserait react-native-image-picker
    Alert.alert(
      'Upload Image',
      'Choose an option',
      [
        { text: 'Camera', onPress: onAddImage },
        { text: 'Gallery', onPress: onAddImage },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleOpenMockupTool = () => {
    haptics.light();
    setShowMockupTool(true);
  };

  const handleCloseMockupTool = () => {
    haptics.light();
    setShowMockupTool(false);
  };

  const handleSaveMockup = (_imageData: string) => {
    haptics.success();
    onAddImage();
    Alert.alert('Success', 'Mockup saved successfully!');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>
          🎨 Illustrez votre idée (optionnel)
        </Text>
        <Text style={[styles.subtitle, { color: subtextColor }]}>
          Ajoutez une image ou un mockup pour mieux visualiser
        </Text>
      </View>

      {!hasImage ? (
        <>
          <TouchableOpacity
            style={[styles.uploadButton, { borderColor: borderColor }]}
            onPress={handleAddImage}
          >
            <Text style={styles.uploadIcon}>📸</Text>
            <Text style={[styles.uploadTitle, { color: textColor }]}>
              Ajouter une image
            </Text>
            <Text style={[styles.uploadSubtitle, { color: subtextColor }]}>
              Caméra, galerie ou mockup
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.uploadButton, { borderColor: borderColor }]}
            onPress={handleOpenMockupTool}
          >
            <Text style={styles.uploadIcon}>✏️</Text>
            <Text style={[styles.uploadTitle, { color: textColor }]}>
              Créer un mockup
            </Text>
            <Text style={[styles.uploadSubtitle, { color: subtextColor }]}>
              Outils de dessin intégrés
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={[styles.imagePreview, { borderColor: borderColor }]}>
          <Text style={styles.imageIcon}>🖼️</Text>
          <Text style={[styles.imageName, { color: textColor }]}>
            Image ajoutée
          </Text>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => {
              haptics.light();
              Alert.alert('Retirer', 'Image retirée', [{ text: 'OK' }]);
            }}
          >
            <Text style={styles.removeText}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={[styles.info, { backgroundColor: isDarkMode ? '#2A2A2A' : '#F8F8F8' }]}>
        <Text style={[styles.infoText, { color: subtextColor }]}>
          💡 Les suggestions avec images reçoivent 2x plus de votes !
        </Text>
      </View>

      {/* Mockup Tool Modal */}
      <MockupToolModal
        visible={showMockupTool}
        onClose={handleCloseMockupTool}
        onSave={handleSaveMockup}
        isDarkMode={isDarkMode}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  uploadButton: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  uploadTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  uploadSubtitle: {
    fontSize: 14,
  },
  imagePreview: {
    borderWidth: 2,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  imageIcon: {
    fontSize: 64,
    marginBottom: 12,
  },
  imageName: {
    fontSize: 16,
    fontWeight: '600',
  },
  removeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF6B6B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  info: {
    borderRadius: 12,
    padding: 16,
  },
  infoText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
