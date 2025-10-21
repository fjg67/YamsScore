/**
 * Sound and Vibration Section
 */

import React from 'react';
import { View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  toggleSound,
  toggleMusic,
  toggleVibration,
  setHapticIntensity,
  toggleVoiceFeedback,
  setSoundVolume,
  setMusicVolume,
  type HapticIntensity,
} from '../../../store/slices/settingsSlice';
import SettingCard from '../components/SettingCard';
import ToggleSetting from '../components/ToggleSetting';
import SelectorSetting from '../components/SelectorSetting';
import VolumeSlider from '../components/VolumeSlider';

const SoundVibrationSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const soundEnabled = useAppSelector((state) => state.settings.soundEnabled);
  const soundVolume = useAppSelector((state) => state.settings.soundVolume);
  const musicEnabled = useAppSelector((state) => state.settings.musicEnabled);
  const musicVolume = useAppSelector((state) => state.settings.musicVolume);
  const vibrationEnabled = useAppSelector(
    (state) => state.settings.vibrationEnabled
  );
  const hapticIntensity = useAppSelector(
    (state) => state.settings.hapticIntensity
  );
  const voiceFeedbackEnabled = useAppSelector(
    (state) => state.settings.voiceFeedbackEnabled
  );

  return (
    <SettingCard title="Son et Vibration 🔊">
      {/* Effets sonores */}
      <ToggleSetting
        icon="🔊"
        title="Effets sonores"
        value={soundEnabled}
        onValueChange={() => dispatch(toggleSound())}
        color="#4A90E2"
      />

      {/* Volume des effets sonores */}
      {soundEnabled && (
        <VolumeSlider
          icon="🎚️"
          title="Volume des sons"
          value={soundVolume}
          onValueChange={(value) => dispatch(setSoundVolume(value))}
          color="#4A90E2"
        />
      )}

      {/* Musique d'ambiance */}
      <ToggleSetting
        icon="🎵"
        title="Musique d'ambiance"
        description="Pendant les parties"
        value={musicEnabled}
        onValueChange={() => dispatch(toggleMusic())}
        color="#9B59B6"
      />

      {/* Volume de la musique */}
      {musicEnabled && (
        <VolumeSlider
          icon="🎼"
          title="Volume de la musique"
          value={musicVolume}
          onValueChange={(value) => dispatch(setMusicVolume(value))}
          color="#9B59B6"
        />
      )}

      {/* Vibrations */}
      <ToggleSetting
        icon="📳"
        title="Vibrations"
        description="Retour tactile"
        value={vibrationEnabled}
        onValueChange={() => dispatch(toggleVibration())}
        color="#50C878"
      />

      {/* Intensité des vibrations */}
      <SelectorSetting<HapticIntensity>
        icon="💪"
        title="Intensité des vibrations"
        options={[
          { id: 'light', label: 'Légère', icon: '·' },
          { id: 'medium', label: 'Moyenne', icon: '··' },
          { id: 'heavy', label: 'Forte', icon: '···' },
        ]}
        value={hapticIntensity}
        onValueChange={(value) => dispatch(setHapticIntensity(value))}
        disabled={!vibrationEnabled}
      />

      {/* Retour vocal */}
      <ToggleSetting
        icon="🗣️"
        title="Retour vocal"
        description="Annonces vocales des scores (Beta)"
        value={voiceFeedbackEnabled}
        onValueChange={() => dispatch(toggleVoiceFeedback())}
        color="#00BCD4"
      />
    </SettingCard>
  );
};

export default SoundVibrationSection;
