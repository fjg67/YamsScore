import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert
} from "react-native";
import PlayerCardPremium from "../components/PlayerCardPremium";
import { AISelector } from "../components/AISelector";
import { ModeSelector } from "../components/ModeSelector";
import { PlayerCustomizationModal } from "../components/PlayerCustomizationModal";
import { Player, GameMode } from "../types/player";
import { PlayerService } from "../services/playerService";
import { UNLOCKABLE_COLORS, UNLOCKABLE_AVATARS } from "../constants/playerConstants";

interface PlayerSelectionScreenProps {
  onPlayersSelected: (players: Player[]) => void;
  onBack: () => void;
}

export const PlayerSelectionScreen: React.FC<PlayerSelectionScreenProps> = ({
  onPlayersSelected,
  onBack
}) => {
  const [gameMode, setGameMode] = useState<GameMode>("multiplayer");
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedAIDifficulty, setSelectedAIDifficulty] = useState<
    "easy" | "normal" | "hard"
  >("easy");
  const [customizingPlayer, setCustomizingPlayer] = useState<Player | null>(null);
  const [showCustomizationModal, setShowCustomizationModal] = useState(false);
  
  // Récupérer les unlocks du joueur (à adapter selon votre système de sauvegarde)
  const unlockedAIDifficulties = ["easy", "normal"]; // À charger depuis les stats du joueur

  const toggleGameMode = (newMode: GameMode) => {
    setGameMode(newMode);
    setPlayers([]); // Reset joueurs quand on change de mode
  };

  const handleAddPlayer = () => {
    if (gameMode === "vs_ai" && players.length >= 1) {
      Alert.alert("Mode Solo", "En mode vs IA, un seul joueur humain est autorisé.");
      return;
    }

    if (players.length >= 6) {
      Alert.alert("Maximum atteint", "Vous ne pouvez pas ajouter plus de 6 joueurs.");
      return;
    }

    // Créer un nouveau joueur avec les paramètres par défaut
    const defaultColors = UNLOCKABLE_COLORS.filter(c => c.level === 1);
    const defaultAvatars = UNLOCKABLE_AVATARS.filter(a => a.level === 1);
    
    const randomColor = defaultColors[players.length % defaultColors.length].color;
    const randomEmoji = defaultAvatars[players.length % defaultAvatars.length].emoji;
    
    const newPlayer = PlayerService.createHumanPlayer(
      `Joueur ${players.length + 1}`,
      randomColor,
      randomEmoji
    );

    setPlayers([...players, newPlayer]);
    
    // Ouvrir la modal de personnalisation pour le nouveau joueur
    setCustomizingPlayer(newPlayer);
    setShowCustomizationModal(true);
  };

  const handleEditPlayer = (player: Player) => {
    setCustomizingPlayer(player);
    setShowCustomizationModal(true);
  };

  const handleRemovePlayer = (playerId: string) => {
    Alert.alert(
      "Retirer le joueur",
      "Voulez-vous vraiment retirer ce joueur de la partie ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Retirer",
          style: "destructive",
          onPress: () => {
            setPlayers(players.filter(p => p.id !== playerId));
          }
        }
      ]
    );
  };

  const handleSaveCustomization = (updatedPlayer: Player) => {
    setPlayers(players.map(p => p.id === updatedPlayer.id ? updatedPlayer : p));
    setShowCustomizationModal(false);
    setCustomizingPlayer(null);
  };

  const handlePlayerNameChange = (playerId: string, newName: string) => {
    setPlayers(players.map(p => 
      p.id === playerId ? { ...p, name: newName } : p
    ));
  };

  const handleAISelect = (difficulty: "easy" | "normal" | "hard") => {
    setSelectedAIDifficulty(difficulty);
  };

  const handleStartGame = () => {
    if (gameMode === "multiplayer") {
      if (players.length < 2) {
        Alert.alert("Pas assez de joueurs", "Ajoutez au moins 2 joueurs pour commencer.");
        return;
      }
      onPlayersSelected(players);
    } else {
      if (players.length === 0) {
        Alert.alert("Aucun joueur", "Ajoutez un joueur pour affronter l'IA.");
        return;
      }
      
      // Créer le joueur IA
      const aiPlayer = PlayerService.createAIPlayer(selectedAIDifficulty);
      onPlayersSelected([players[0], aiPlayer]);
    }
  };

  const canStart = gameMode === "multiplayer" 
    ? players.length >= 2 
    : players.length === 1;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.playerCount}>
          {players.length}/{gameMode === "vs_ai" ? "1" : "6"}
        </Text>
      </View>

      {/* Titre */}
      <View style={styles.titleSection}>
        <Text style={styles.titleEmoji}>🎲</Text>
        <Text style={styles.title}>Qui sont les joueurs ?</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Mode Selector */}
        <ModeSelector
          gameMode={gameMode}
          onModeChange={toggleGameMode}
        />

        {/* Liste des joueurs ou sélecteur IA */}
        {gameMode === "vs_ai" ? (
          <>
            {/* Joueur humain */}
            {players.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>👤</Text>
                <Text style={styles.emptyText}>Ajoute ton profil</Text>
                <Text style={styles.emptySubtext}>pour affronter l'IA</Text>
              </View>
            )}
            
            {players.map((player) => (
              <PlayerCardPremium
                key={player.id}
                player={player}
                onEdit={() => handleEditPlayer(player)}
                onRemove={() => handleRemovePlayer(player.id)}
                onNameChange={(newName) => handlePlayerNameChange(player.id, newName)}
              />
            ))}

            {players.length > 0 && (
              <>
                <View style={styles.separator}>
                  <Text style={styles.separatorText}>VS</Text>
                </View>

                {/* Sélecteur IA */}
                <AISelector
                  onSelect={handleAISelect}
                  selectedDifficulty={selectedAIDifficulty}
                  unlockedDifficulties={unlockedAIDifficulties}
                />
              </>
            )}
          </>
        ) : (
          <>
            {/* Mode multijoueur */}
            {players.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>👥</Text>
                <Text style={styles.emptyText}>Aucun joueur</Text>
                <Text style={styles.emptySubtext}>Ajoutez au moins 2 joueurs</Text>
              </View>
            )}

            {players.map((player) => (
              <PlayerCardPremium
                key={player.id}
                player={player}
                onEdit={() => handleEditPlayer(player)}
                onRemove={() => handleRemovePlayer(player.id)}
                onNameChange={(newName) => handlePlayerNameChange(player.id, newName)}
              />
            ))}
          </>
        )}

        {/* Bouton Ajouter Joueur */}
        {(gameMode === "multiplayer" && players.length < 6) || 
         (gameMode === "vs_ai" && players.length === 0) ? (
          <TouchableOpacity
            onPress={handleAddPlayer}
            style={styles.addButton}
            activeOpacity={0.7}
          >
            <Text style={styles.addButtonIcon}>➕</Text>
            <Text style={styles.addButtonText}>Ajouter un joueur</Text>
          </TouchableOpacity>
        ) : null}

        <View style={styles.spacer} />
      </ScrollView>

      {/* CTA Button */}
      {canStart && (
        <View style={styles.ctaContainer}>
          <TouchableOpacity
            onPress={handleStartGame}
            style={styles.ctaButton}
            activeOpacity={0.8}
          >
            <Text style={styles.ctaText}>🎲 LANCER LA PARTIE 🎲</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal de personnalisation */}
      {customizingPlayer && (
        <PlayerCustomizationModal
          player={customizingPlayer}
          visible={showCustomizationModal}
          onClose={() => {
            setShowCustomizationModal(false);
            setCustomizingPlayer(null);
          }}
          onSave={handleSaveCustomization}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF"
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 50
  },
  backButton: {
    padding: 8
  },
  backText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4A90E2"
  },
  playerCount: {
    fontSize: 14,
    fontWeight: "700",
    color: "#7F8C8D"
  },
  titleSection: {
    alignItems: "center",
    paddingVertical: 20,
    gap: 8
  },
  titleEmoji: {
    fontSize: 48
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#2C3E50",
    textAlign: "center"
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    paddingBottom: 20
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 40
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
    opacity: 0.5
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2C3E50",
    marginBottom: 8
  },
  emptySubtext: {
    fontSize: 14,
    color: "#7F8C8D",
    textAlign: "center"
  },
  separator: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20
  },
  separatorText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#4A90E2",
    backgroundColor: "#F8F9FA",
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20
  },
  addButton: {
    marginHorizontal: 20,
    marginVertical: 16,
    paddingVertical: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#4A90E2",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(74, 144, 226, 0.05)"
  },
  addButtonIcon: {
    fontSize: 32,
    marginBottom: 8
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4A90E2"
  },
  ctaContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 30,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8
  },
  ctaButton: {
    paddingVertical: 18,
    borderRadius: 16,
    backgroundColor: "#4A90E2",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#4A90E2",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6
  },
  ctaText: {
    fontSize: 18,
    fontWeight: "800",
    color: "white",
    letterSpacing: 1
  },
  spacer: {
    height: 120
  }
});
