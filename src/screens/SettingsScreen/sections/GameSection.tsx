/**
 * Game Settings Section
 */

import React from 'react';
import { View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  toggleAutoSave,
  toggleConfirmActions,
  toggleShowHints,
  toggleTutorialMode,
  toggleQuickInput,
  setCelebrationLevel,
  type CelebrationLevel,
} from '../../../store/slices/settingsSlice';
import SettingCard from '../components/SettingCard';
import ToggleSetting from '../components/ToggleSetting';
import SelectorSetting from '../components/SelectorSetting';

const GameSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const autoSaveEnabled = useAppSelector(
    (state) => state.settings.autoSaveEnabled
  );
  const confirmActionsEnabled = useAppSelector(
    (state) => state.settings.confirmActionsEnabled
  );
  const showHintsEnabled = useAppSelector(
    (state) => state.settings.showHintsEnabled
  );
  const tutorialModeEnabled = useAppSelector(
    (state) => state.settings.tutorialModeEnabled
  );
  const quickInputEnabled = useAppSelector(
    (state) => state.settings.quickInputEnabled
  );
  const celebrationLevel = useAppSelector(
    (state) => state.settings.celebrationLevel
  );

  return (
    <SettingCard title="Paramètres de Jeu 🎮">
      {/* Sauvegarde automatique */}
      <ToggleSetting
        icon="💾"
        title="Sauvegarde automatique"
        description="Sauvegarde après chaque tour"
        value={autoSaveEnabled}
        onValueChange={() => dispatch(toggleAutoSave())}
        color="#50C878"
      />

      {/* Confirmer les actions */}
      <ToggleSetting
        icon="✅"
        title="Confirmer les actions"
        description="Demande confirmation avant de barrer"
        value={confirmActionsEnabled}
        onValueChange={() => dispatch(toggleConfirmActions())}
        color="#F39C12"
      />

      {/* Afficher les astuces */}
      <ToggleSetting
        icon="💡"
        title="Afficher les astuces"
        description="Suggestions de stratégie"
        value={showHintsEnabled}
        onValueChange={() => dispatch(toggleShowHints())}
        color="#9B59B6"
      />

      {/* Mode tutoriel */}
      <ToggleSetting
        icon="🎓"
        title="Mode tutoriel"
        description="Aide contextuelle pour débutants"
        value={tutorialModeEnabled}
        onValueChange={() => dispatch(toggleTutorialMode())}
        color="#00BCD4"
      />

      {/* Saisie rapide */}
      <ToggleSetting
        icon="⚡"
        title="Saisie rapide"
        description="Valeurs suggérées en premier"
        value={quickInputEnabled}
        onValueChange={() => dispatch(toggleQuickInput())}
        color="#FF6B6B"
      />

      {/* Niveau de célébration */}
      <SelectorSetting<CelebrationLevel>
        icon="🎉"
        title="Niveau de célébration"
        description="Intensité des animations de victoire"
        options={[
          { id: 'minimal', label: 'Minimal', icon: '·' },
          { id: 'normal', label: 'Normal', icon: '··' },
          { id: 'epic', label: 'Épique', icon: '···' },
        ]}
        value={celebrationLevel}
        onValueChange={(value) => dispatch(setCelebrationLevel(value))}
      />
    </SettingCard>
  );
};

export default GameSection;
