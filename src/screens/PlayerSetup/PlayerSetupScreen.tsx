import React, { useState } from 'react';
import { View, StyleSheet, useColorScheme, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { usePlayerSetup } from './hooks/usePlayerSetup';

// Phase components
import NumberSelectorPremium from './components/Phase1_NumberSelection/NumberSelectorPremium';
import DifficultyScreenPremium from './components/Phase1_5_Difficulty/DifficultyScreenPremium';
import PlayersListPremium from './components/Phase2_PlayersList/PlayersListPremium';
import SummaryScreenPremium from './components/Phase4_Summary/SummaryScreenPremium';

// Modals
import ColorPickerModal from './components/Modals/ColorPickerModal';
import WhoStartsModal from '../../../components/WhoStarts/WhoStartsModal';

interface PlayerSetupScreenProps {
  onGameStart?: (players: any[]) => void;
}

const PlayerSetupScreen: React.FC<PlayerSetupScreenProps> = ({ onGameStart }) => {
  const isDarkMode = useColorScheme() === 'dark';
  const {
    phase,
    playerCount,
    players,
    aiDifficulty,
    aiPersonality,
    selectPlayerCount,
    setAiDifficulty,
    selectAiDifficulty,
    selectAiPersonality,
    updatePlayerName,
    updatePlayerColor,
    deletePlayer,
    addPlayer,
    canProceed,
    nextPhase,
    prevPhase,
    goToPhase,
    getAllPlayers,
  } = usePlayerSetup();

  // Modal states
  const [colorModalVisible, setColorModalVisible] = useState(false);

  // Custom back handler for Phase 3 - always go to Phase 1
  const handleBackFromPlayersList = () => {
    goToPhase(1);
  };
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [whoStartsModalVisible, setWhoStartsModalVisible] = useState(false);

  const handleColorPress = (playerId: string) => {
    setSelectedPlayerId(playerId);
    setColorModalVisible(true);
  };

  const handleColorSelect = (color: string, colorName: string) => {
    if (selectedPlayerId) {
      updatePlayerColor(selectedPlayerId, color, colorName);
    }
    setColorModalVisible(false);
    setSelectedPlayerId(null);
  };

  const handleLaunchGame = () => {
    // Ouvrir le modal "Qui commence ?"
    setWhoStartsModalVisible(true);
  };

  const handleWhoStartsComplete = (winnerId: string) => {
    // Fermer le modal
    setWhoStartsModalVisible(false);

    // Obtenir tous les joueurs (incluant l'IA si mode solo)
    const allPlayers = getAllPlayers();

    // Réorganiser les joueurs pour que le gagnant soit en premier
    const winnerIndex = allPlayers.findIndex(p => p.id === winnerId);
    const reorderedPlayers = [
      ...allPlayers.slice(winnerIndex),
      ...allPlayers.slice(0, winnerIndex)
    ];

    // Lancer la partie avec l'ordre correct
    if (onGameStart) {
      onGameStart(reorderedPlayers);
    } else {
      Alert.alert(
        '🎲 Partie lancée !',
        `${allPlayers.length} joueurs sont prêts à jouer !`,
        [{ text: 'OK' }]
      );
    }
  };

  const renderPhase = () => {
    switch (phase) {
      case 1:
        // Phase 1 : Sélection du nombre de joueurs
        return (
          <NumberSelectorPremium
            selectedCount={playerCount}
            onSelectCount={selectPlayerCount}
          />
        );

      case 2:
        // Phase 2 : Sélection de la personnalité IA (mode solo uniquement)
        return (
          <DifficultyScreenPremium
            selectedPersonality={aiPersonality}
            onSelectPersonality={selectAiPersonality}
            onBack={prevPhase}
          />
        );

      case 3:
        // Phase 3 : Saisie des noms des joueurs
        return (
          <PlayersListPremium
            players={players}
            onNameChange={updatePlayerName}
            onColorPress={handleColorPress}
            onDeletePlayer={deletePlayer}
            onAddPlayer={addPlayer}
            onContinue={nextPhase}
            onBack={handleBackFromPlayersList}
            canProceed={canProceed()}
          />
        );

      case 4:
        // Phase 4 : Résumé et lancement
        return (
          <SummaryScreenPremium
            players={getAllPlayers()}
            gameConfig={{ mode: 'classic', orderType: 'random' }}
            onLaunch={handleLaunchGame}
            onBack={prevPhase}
          />
        );

      default:
        return null;
    }
  };

  const selectedPlayer = players.find(p => p.id === selectedPlayerId);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={
          isDarkMode
            ? ['#1E1E1E', '#252525', '#1A1A1A']
            : ['#F8F9FA', '#FFFFFF', '#F0F4F8']
        }
        locations={[0, 0.4, 1]}
        style={styles.gradient}
      >
        {renderPhase()}
      </LinearGradient>

      {/* Color Picker Modal */}
      <ColorPickerModal
        visible={colorModalVisible}
        currentColor={selectedPlayer?.color || '#4A90E2'}
        onSelectColor={handleColorSelect}
        onClose={() => {
          setColorModalVisible(false);
          setSelectedPlayerId(null);
        }}
      />

      {/* Who Starts Modal */}
      <WhoStartsModal
        visible={whoStartsModalVisible}
        players={getAllPlayers()}
        onComplete={handleWhoStartsComplete}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
});

export default PlayerSetupScreen;
