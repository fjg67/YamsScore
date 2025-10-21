import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import {haptics} from '../../../utils/haptics';
import {shareUserData} from '../utils/dataExporter';
import {deleteAllUserData} from '../utils/dataEraser';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';

interface PrivacyControlProps {
  icon: string;
  title: string;
  description: string;
  type: 'toggle' | 'action';
  toggleValue?: boolean;
  onToggleChange?: (value: boolean) => void;
  buttonText?: string;
  buttonStyle?: 'primary' | 'secondary' | 'danger';
  onButtonPress?: () => void;
}

const PrivacyControl: React.FC<PrivacyControlProps> = ({
  icon,
  title,
  description,
  type,
  toggleValue,
  onToggleChange,
  buttonText,
  buttonStyle = 'secondary',
  onButtonPress,
}) => {
  return (
    <View style={styles.control}>
      <View style={styles.controlLeft}>
        <Text style={styles.controlIcon}>{icon}</Text>
        <View style={styles.controlText}>
          <Text style={styles.controlTitle}>{title}</Text>
          <Text style={styles.controlDescription}>{description}</Text>
        </View>
      </View>
      {type === 'toggle' && (
        <Switch
          value={toggleValue}
          onValueChange={onToggleChange}
          trackColor={{false: '#D1D1D6', true: '#4A90E2'}}
          thumbColor="#FFFFFF"
        />
      )}
      {type === 'action' && buttonText && (
        <TouchableOpacity
          style={[
            styles.actionButton,
            buttonStyle === 'danger' && styles.dangerButton,
            buttonStyle === 'primary' && styles.primaryButton,
          ]}
          onPress={onButtonPress}
          activeOpacity={0.7}>
          <Text
            style={[
              styles.actionButtonText,
              buttonStyle === 'danger' && styles.dangerButtonText,
              buttonStyle === 'primary' && styles.primaryButtonText,
            ]}>
            {buttonText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export const PrivacyControls: React.FC = () => {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [crashReportsEnabled, setCrashReportsEnabled] = useState(true);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteProgress, setDeleteProgress] = useState('');

  const handleAnalyticsToggle = (value: boolean) => {
    setAnalyticsEnabled(value);
    haptics.light();
    // TODO: Sauvegarder la préférence
  };

  const handleCrashReportsToggle = (value: boolean) => {
    setCrashReportsEnabled(value);
    haptics.light();
    // TODO: Sauvegarder la préférence
  };

  const handleExportData = async () => {
    try {
      haptics.light();
      await shareUserData();
      haptics.success();
    } catch (error) {
      haptics.error();
      Alert.alert(
        'Erreur',
        'Impossible d\'exporter les données. Réessaye plus tard.',
      );
    }
  };

  const handleDeleteRequest = () => {
    setDeleteModalVisible(true);
    haptics.warning();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmed) {
      Alert.alert('Confirmation', 'Coche la case pour continuer');
      return;
    }

    setDeleting(true);
    haptics.warning();

    try {
      await deleteAllUserData(progress => {
        setDeleteProgress(progress.step);
      });

      setDeleteModalVisible(false);
      setDeleting(false);
      setDeleteConfirmed(false);

      Alert.alert(
        'Données Supprimées',
        'Toutes tes données ont été supprimées avec succès.',
        [
          {
            text: 'OK',
            onPress: () => {
              // TODO: Réinitialiser l'app
            },
          },
        ],
      );
    } catch (error) {
      setDeleting(false);
      haptics.error();
      Alert.alert(
        'Erreur',
        'Une erreur est survenue lors de la suppression.',
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tes Contrôles</Text>
        <Text style={styles.headerIcon}>🎛️</Text>
      </View>
      <Text style={styles.subtitle}>Gère tes données en temps réel</Text>

      <View style={styles.card}>
        <PrivacyControl
          icon="📊"
          title="Analytics & Amélioration"
          description="Aide-nous à améliorer l'app"
          type="toggle"
          toggleValue={analyticsEnabled}
          onToggleChange={handleAnalyticsToggle}
        />

        <View style={styles.separator} />

        <PrivacyControl
          icon="🐛"
          title="Rapports de Crash"
          description="Aide-nous à corriger les bugs"
          type="toggle"
          toggleValue={crashReportsEnabled}
          onToggleChange={handleCrashReportsToggle}
        />

        <View style={styles.separator} />

        <PrivacyControl
          icon="📤"
          title="Exporter Mes Données"
          description="Télécharge tout en JSON"
          type="action"
          buttonText="Télécharger"
          buttonStyle="secondary"
          onButtonPress={handleExportData}
        />

        <View style={styles.separator} />

        <PrivacyControl
          icon="🗑️"
          title="Supprimer Mes Données"
          description="Efface tout définitivement"
          type="action"
          buttonText="Supprimer"
          buttonStyle="danger"
          onButtonPress={handleDeleteRequest}
        />
      </View>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={deleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => !deleting && setDeleteModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            style={styles.modalContent}>
            <Text style={styles.warningIcon}>⚠️</Text>
            <Text style={styles.modalTitle}>
              Supprimer Toutes Tes Données ?
            </Text>
            <Text style={styles.modalMessage}>
              Cette action est irréversible. Tout ton historique et tes stats
              seront perdus.
            </Text>

            {deleting ? (
              <View style={styles.progressContainer}>
                <ActivityIndicator size="large" color="#FF6B6B" />
                <Text style={styles.progressText}>{deleteProgress}</Text>
              </View>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.checkboxContainer}
                  onPress={() => {
                    setDeleteConfirmed(!deleteConfirmed);
                    haptics.light();
                  }}
                  activeOpacity={0.7}>
                  <View
                    style={[
                      styles.checkbox,
                      deleteConfirmed && styles.checkboxChecked,
                    ]}>
                    {deleteConfirmed && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>
                  <Text style={styles.checkboxLabel}>
                    Je comprends que c'est définitif
                  </Text>
                </TouchableOpacity>

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => {
                      setDeleteModalVisible(false);
                      setDeleteConfirmed(false);
                      haptics.light();
                    }}
                    activeOpacity={0.7}>
                    <Text style={styles.cancelButtonText}>Annuler</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.modalButton,
                      styles.deleteButton,
                      !deleteConfirmed && styles.disabledButton,
                    ]}
                    onPress={handleDeleteConfirm}
                    disabled={!deleteConfirmed}
                    activeOpacity={0.7}>
                    <Text style={styles.deleteButtonText}>Tout Supprimer</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerTitle: {
    fontFamily: 'SF Pro Display',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  headerIcon: {
    fontSize: 28,
  },
  subtitle: {
    fontFamily: 'SF Pro Text',
    fontSize: 16,
    color: '#666666',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 5,
  },
  control: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  controlLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    flex: 1,
  },
  controlIcon: {
    fontSize: 24,
    marginTop: 2,
  },
  controlText: {
    flex: 1,
  },
  controlTitle: {
    fontFamily: 'SF Pro Text',
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  controlDescription: {
    fontFamily: 'SF Pro Text',
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginVertical: 8,
  },
  actionButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  primaryButton: {
    backgroundColor: '#4A90E2',
  },
  dangerButton: {
    backgroundColor: 'rgba(255,107,107,0.1)',
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  actionButtonText: {
    fontFamily: 'SF Pro Text',
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  primaryButtonText: {
    color: '#FFFFFF',
  },
  dangerButtonText: {
    color: '#FF6B6B',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  warningIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  modalTitle: {
    fontFamily: 'SF Pro Display',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontFamily: 'SF Pro Text',
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#D1D1D6',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontFamily: 'SF Pro Text',
    fontSize: 14,
    color: '#333333',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
  },
  deleteButton: {
    backgroundColor: '#FF6B6B',
  },
  disabledButton: {
    opacity: 0.5,
  },
  cancelButtonText: {
    fontFamily: 'SF Pro Text',
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  deleteButtonText: {
    fontFamily: 'SF Pro Text',
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  progressContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  progressText: {
    fontFamily: 'SF Pro Text',
    fontSize: 14,
    color: '#666666',
    marginTop: 12,
  },
});
