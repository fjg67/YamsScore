/**
 * Appearance Section - Theme, Colors, Dice Style
 */

import React from 'react';
import { View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  setThemeMode,
  setAccentColor,
  setDiceStyle,
  toggleAnimations,
  toggleReduceMotion,
  type ThemeMode,
  type AccentColor,
  type DiceStyle,
} from '../../../store/slices/settingsSlice';
import SettingCard from '../components/SettingCard';
import SelectorSetting from '../components/SelectorSetting';
import ColorPicker from '../components/ColorPicker';
import ToggleSetting from '../components/ToggleSetting';

const AppearanceSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector((state) => state.settings.themeMode);
  const accentColor = useAppSelector((state) => state.settings.accentColor);
  const diceStyle = useAppSelector((state) => state.settings.diceStyle);
  const animationsEnabled = useAppSelector(
    (state) => state.settings.animationsEnabled
  );
  const reduceMotion = useAppSelector((state) => state.settings.reduceMotion);

  return (
    <SettingCard title="Apparence 🎨">
      {/* Thème */}
      <SelectorSetting<ThemeMode>
        icon="🌓"
        title="Thème"
        options={[
          { id: 'light', label: 'Clair', icon: '☀️' },
          { id: 'dark', label: 'Sombre', icon: '🌙' },
          { id: 'auto', label: 'Auto', icon: '🔄' },
        ]}
        value={themeMode}
        onValueChange={(value) => dispatch(setThemeMode(value))}
      />

      {/* Couleur d'accent */}
      <ColorPicker
        icon="🎨"
        title="Couleur d'accent"
        description="Personnalise l'interface"
        value={accentColor}
        onValueChange={(value) => dispatch(setAccentColor(value))}
        userLevel={5} // TODO: Get from user level
      />

      {/* Style des dés */}
      <SelectorSetting<DiceStyle>
        icon="🎲"
        title="Style des dés"
        options={[
          { id: 'classic', label: 'Classique', icon: '⚀' },
          { id: 'modern', label: 'Moderne', icon: '🎲' },
          { id: '3d', label: '3D', icon: '🧊' },
        ]}
        value={diceStyle}
        onValueChange={(value) => dispatch(setDiceStyle(value))}
      />

      {/* Animations */}
      <ToggleSetting
        icon="✨"
        title="Animations"
        description="Effets visuels et transitions"
        value={animationsEnabled}
        onValueChange={() => dispatch(toggleAnimations())}
        color="#50C878"
      />

      {/* Réduire les animations */}
      <ToggleSetting
        icon="♿"
        title="Réduire les animations"
        description="Mode accessibilité"
        value={reduceMotion}
        onValueChange={() => dispatch(toggleReduceMotion())}
        color="#4A90E2"
      />
    </SettingCard>
  );
};

export default AppearanceSection;
