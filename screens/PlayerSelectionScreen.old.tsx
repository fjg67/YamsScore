import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  StyleSheet,
  Dimensions,
  Alert
} from "react-native";
import { PlayerCard } from "../components/PlayerCard";
import { PlayerCardPremium } from "../components/PlayerCardPremium";
import { AISelector } from "../components/AISelector";
import { ModeSelector } from "../components/ModeSelector";
import { PlayerCustomizationModal } from "../components/PlayerCustomizationModal";
import { Player, GameMode, PlayerType } from "../types/player";
import { PlayerService } from "../services/playerService";
import { UNLOCKABLE_COLORS, UNLOCKABLE_AVATARS } from "../constants/playerConstants";

const { width } = Dimensions.get("window");

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
  
  const modeIndicatorAnim = useRef(new Animated.Value(0)).current;
  
  // Récupérer les unlocks du joueur (à adapter selon votre système de sauvegarde)
  const unlockedAIDifficulties = ["easy", "normal"]; // À charger depuis les stats du joueur

  const toggleGameMode = (newMode: GameMode) => {
    // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    Animated.spring(modeIndicatorAnim, {
      toValue: newMode === "multiplayer" ? 0 : 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true
    }).start();

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

        <View style={{ height: 120 }} />
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
    const newPlayer = PlayerService.createHumanPlayer(
      `Joueur ${players.length + 1}`,
      ["#4A90E2", "#50C878", "#FF6B6B", "#FFD93D"][players.length % 4],
      ["😀", "😎", "🤓", "😈"][players.length % 4]
    );
    setPlayers([...players, newPlayer]);
  };

  const handleRemovePlayer = (playerId: string) => {
    setPlayers(players.filter((p) => p.id !== playerId));
  };

  const handleEditPlayer = (playerId: string) => {
    // Navigation vers modal édition joueur
  };

  const handleStartGame = () => {
    if (gameMode === "multiplayer") {
      if (players.length >= 2) {
        onPlayersSelected(players);
      }
    } else {
      // Mode vs IA
      const humanPlayer = players[0] || PlayerService.createHumanPlayer(
        "Joueur",
        "#4A90E2",
        "😀"
      );
      const aiPlayer = PlayerService.createAIPlayer(selectedAIDifficulty);
      onPlayersSelected([humanPlayer, aiPlayer]);
    }
  };

  const canStartGame =
    gameMode === "vs_ai" ||
    (gameMode === "multiplayer" && players.length >= 2);

  const modeIndicatorX = modeIndicatorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [4, Dimensions.get("window").width / 2 - 2]
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sélection Joueurs</Text>
        <Text style={styles.playerCount}>
          {gameMode === "multiplayer" ? `${players.length}/6` : "vs IA"}
        </Text>
      </View>

      {/* Title */}
      <View style={styles.titleSection}>
        <Text style={styles.titleIcon}>🎲</Text>
        <Text style={styles.title}>
          {gameMode === "multiplayer"
            ? "Qui sont les joueurs ?"
            : "Qui es-tu ?"}
        </Text>
      </View>

      {/* Mode Selector */}
      <View style={styles.modeSelector}>
        <Animated.View
          style={[
            styles.modeIndicator,
            { transform: [{ translateX: modeIndicatorX }] }
          ]}
        />
        <TouchableOpacity
          style={styles.modeButton}
          onPress={() => toggleGameMode("multiplayer")}
        >
          <Text style={styles.modeIcon}>🎮</Text>
          <Text style={styles.modeLabel}>Multijoueur</Text>
          <Text style={styles.modeSubtext}>2-6 joueurs</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.modeButton}
          onPress={() => toggleGameMode("vs_ai")}
        >
          <Text style={styles.modeIcon}>🤖</Text>
          <Text style={styles.modeLabel}>vs IA</Text>
          <Text style={styles.modeSubtext}>Solo</Text>
        </TouchableOpacity>
      </View>

      {/* Contenu selon mode */}
      <ScrollView
        style={styles.contentScroll}
        showsVerticalScrollIndicator={false}
      >
        {gameMode === "multiplayer" ? (
          <>
            {/* Players List */}
            {players.map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                onEdit={() => handleEditPlayer(player.id)}
                onRemove={() => handleRemovePlayer(player.id)}
              />
            ))}

            {/* Add Player Button */}
            {players.length < 6 && (
              <TouchableOpacity
                style={styles.addPlayerButton}
                onPress={handleAddPlayer}
              >
                <Text style={styles.addPlayerIcon}>➕</Text>
                <Text style={styles.addPlayerLabel}>Ajouter un joueur</Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <>
            {/* Player Profile for vs AI */}
            {players.length > 0 && (
              <PlayerCard player={players[0]} onEdit={() => handleEditPlayer(players[0].id)} />
            )}

            {players.length === 0 && (
              <TouchableOpacity
                style={styles.createPlayerButton}
                onPress={handleAddPlayer}
              >
                <Text style={styles.createPlayerIcon}>👤</Text>
                <Text style={styles.createPlayerLabel}>Créer mon profil</Text>
              </TouchableOpacity>
            )}

            {/* AI Difficulty Selector */}
            <View style={styles.aiSelectorWrapper}>
              <AISelector
                onSelect={setSelectedAIDifficulty}
                selectedDifficulty={selectedAIDifficulty}
                unlockedDifficulties={unlockedAIDifficulties}
              />
            </View>
          </>
        )}
      </ScrollView>

      {/* Start Game Button */}
      <TouchableOpacity
        style={[
          styles.startGameButton,
          { opacity: canStartGame ? 1 : 0.5 }
        ]}
        onPress={handleStartGame}
        disabled={!canStartGame}
      >
        <Text style={styles.startGameIcon}>🎲</Text>
        <Text style={styles.startGameLabel}>
          {gameMode === "multiplayer"
            ? "LANCER LA PARTIE"
            : "AFFRONTER L'IA"}
        </Text>
        <Text style={styles.startGameIcon}>🎲</Text>
      </TouchableOpacity>
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
    borderBottomWidth: 1,
    borderBottomColor: "#E1E8ED"
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center"
  },
  backIcon: {
    fontSize: 24
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2C3E50"
  },
  playerCount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#7F8C8D"
  },
  titleSection: {
    alignItems: "center",
    paddingVertical: 20,
    gap: 8
  },
  titleIcon: {
    fontSize: 32
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#2C3E50"
  },
  modeSelector: {
    flexDirection: "row",
    backgroundColor: "#F8F9FA",
    borderRadius: 16,
    padding: 4,
    marginHorizontal: 20,
    marginBottom: 24,
    height: 100,
    position: "relative"
  },
  modeIndicator: {
    position: "absolute",
    left: 4,
    top: 4,
    bottom: 4,
    width: Dimensions.get("window").width / 2 - 28,
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3
  },
  modeButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1
  },
  modeIcon: {
    fontSize: 32,
    marginBottom: 4
  },
  modeLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2C3E50",
    marginBottom: 2
  },
  modeSubtext: {
    fontSize: 11,
    color: "#7F8C8D"
  },
  contentScroll: {
    flex: 1,
    paddingVertical: 8
  },
  addPlayerButton: {
    marginHorizontal: 20,
    marginVertical: 12,
    paddingVertical: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#4A90E2",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(74, 144, 226, 0.05)"
  },
  addPlayerIcon: {
    fontSize: 28,
    marginBottom: 8
  },
  addPlayerLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4A90E2"
  },
  createPlayerButton: {
    marginHorizontal: 20,
    marginTop: 16,
    paddingVertical: 24,
    borderRadius: 16,
    backgroundColor: "#F8F9FA",
    alignItems: "center",
    justifyContent: "center"
  },
  createPlayerIcon: {
    fontSize: 32,
    marginBottom: 8
  },
  createPlayerLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2C3E50"
  },
  aiSelectorWrapper: {
    flex: 1,
    marginTop: 16,
    marginBottom: 20
  },
  startGameButton: {
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: "#4A90E2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    shadowColor: "#4A90E2",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6
  },
  startGameIcon: {
    fontSize: 20
  },
  startGameLabel: {
    fontSize: 16,
    fontWeight: "800",
    color: "white",
    letterSpacing: 0.5
  }
});
