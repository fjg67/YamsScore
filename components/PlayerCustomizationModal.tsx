import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  TextInput
} from "react-native";
import { Player } from "../types/player";
import { PlayerService } from "../services/playerService";
import {
  UNLOCKABLE_COLORS,
  UNLOCKABLE_AVATARS,
  UNLOCKABLE_TITLES
} from "../constants/playerConstants";

interface PlayerCustomizationModalProps {
  player: Player;
  visible: boolean;
  onClose: () => void;
  onSave: (updatedPlayer: Player) => void;
}

type TabType = "identity" | "colors" | "avatars" | "titles";

export const PlayerCustomizationModal: React.FC<PlayerCustomizationModalProps> = ({
  player,
  visible,
  onClose,
  onSave
}) => {
  const [tempName, setTempName] = useState(player.name);
  const [tempNickname, setTempNickname] = useState(player.nickname || "");
  const [selectedColor, setSelectedColor] = useState(player.color);
  const [selectedAvatar, setSelectedAvatar] = useState(
    player.avatar.emoji || player.avatar.initial
  );
  const [selectedTitle, setSelectedTitle] = useState(player.title);
  const [activeTab, setActiveTab] = useState<TabType>("identity");

  const unlockedColors = PlayerService.getUnlockedColors(player);
  const unlockedAvatars = PlayerService.getUnlockedAvatars(player);
  const unlockedTitles = PlayerService.getUnlockedTitles(player);

  const handleSave = () => {
    if (!tempName.trim()) return;

    const updated = PlayerService.updatePlayerWithValidation(player, {
      name: tempName,
      nickname: tempNickname || undefined,
      color: selectedColor,
      avatar: {
        ...player.avatar,
        emoji: selectedAvatar,
        color: selectedColor
      },
      title: selectedTitle,
      theme: {
        primary: selectedColor,
        secondary: `${selectedColor}80`,
        accent: "#FFD93D"
      }
    });

    onSave(updated);
    onClose();
  };

  const handleClose = () => {
    setTempName(player.name);
    setTempNickname(player.nickname || "");
    setSelectedColor(player.color);
    setSelectedAvatar(player.avatar.emoji || player.avatar.initial);
    setSelectedTitle(player.title);
    onClose();
  };

  const tabs: Array<{ key: TabType; label: string; icon: string }> = [
    { key: "identity", label: "👤 Identité", icon: "👤" },
    { key: "colors", label: "🎨 Couleurs", icon: "🎨" },
    { key: "avatars", label: "🎭 Avatars", icon: "🎭" },
    { key: "titles", label: "🏆 Titres", icon: "🏆" }
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.modalContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose}>
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mon Profil</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>✓</Text>
          </TouchableOpacity>
        </View>

        {/* Current Preview */}
        <View style={styles.previewSection}>
          <View
            style={[styles.previewAvatar, { backgroundColor: selectedColor }]}
          >
            <Text style={styles.previewEmoji}>{selectedAvatar}</Text>
          </View>
          <Text style={styles.previewName}>{tempName}</Text>
          {tempNickname && (
            <Text style={styles.previewNickname}>"{tempNickname}"</Text>
          )}
          <Text style={styles.previewLevel}>Level {player.level}</Text>
          {selectedTitle && (
            <Text style={styles.previewTitle}>{selectedTitle}</Text>
          )}
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tab,
                activeTab === tab.key && styles.tabActive
              ]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text style={styles.tabIcon}>{tab.icon}</Text>
              <Text style={styles.tabLabel}>{tab.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Identité Tab */}
          {activeTab === "identity" && (
            <View style={styles.tabContent}>
              <Text style={styles.sectionTitle}>Nom</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Ton nom"
                value={tempName}
                onChangeText={setTempName}
                placeholderTextColor="#BDC3C7"
              />

              <Text style={styles.sectionTitle}>Surnom (optionnel)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Ton surnom"
                value={tempNickname}
                onChangeText={setTempNickname}
                placeholderTextColor="#BDC3C7"
              />

              <Text style={styles.infoText}>
                💡 Le surnom s'affiche sur ta carte joueur
              </Text>
            </View>
          )}

          {/* Couleurs Tab */}
          {activeTab === "colors" && (
            <View style={styles.tabContent}>
              <Text style={styles.sectionTitle}>Choisis ta couleur</Text>
              <View style={styles.colorGrid}>
                {UNLOCKABLE_COLORS.map((colorOption) => {
                  const isUnlocked = unlockedColors.includes(colorOption.color);
                  const isSelected = selectedColor === colorOption.color;

                  return (
                    <TouchableOpacity
                      key={`color_${colorOption.color}`}
                      disabled={!isUnlocked}
                      onPress={() => setSelectedColor(colorOption.color)}
                      style={styles.colorOptionWrapper}
                    >
                      <View
                        style={[
                          styles.colorOption,
                          {
                            backgroundColor: colorOption.color,
                            borderWidth: isSelected ? 4 : 2,
                            borderColor: isSelected ? "white" : "transparent",
                            opacity: isUnlocked ? 1 : 0.5
                          }
                        ]}
                      />
                      {!isUnlocked && (
                        <Text style={styles.lockIcon}>🔒</Text>
                      )}
                      <Text style={styles.colorName}>
                        {colorOption.name}
                      </Text>
                      {!isUnlocked && (
                        <Text style={styles.unlockLevel}>
                          Lvl {colorOption.level}
                        </Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Avatars Tab */}
          {activeTab === "avatars" && (
            <View style={styles.tabContent}>
              <Text style={styles.sectionTitle}>Choisis ton avatar</Text>
              <View style={styles.avatarGrid}>
                {UNLOCKABLE_AVATARS.map((avatarOption) => {
                  const isUnlocked = unlockedAvatars.includes(
                    avatarOption.emoji
                  );
                  const isSelected = selectedAvatar === avatarOption.emoji;

                  return (
                    <TouchableOpacity
                      key={`avatar_${avatarOption.emoji}`}
                      disabled={!isUnlocked}
                      onPress={() => setSelectedAvatar(avatarOption.emoji)}
                      style={styles.avatarOptionWrapper}
                    >
                      <View
                        style={[
                          styles.avatarOption,
                          {
                            borderWidth: isSelected ? 3 : 2,
                            borderColor: isSelected ? selectedColor : "#E1E8ED",
                            opacity: isUnlocked ? 1 : 0.5
                          }
                        ]}
                      >
                        <Text style={styles.avatarEmoji}>
                          {avatarOption.emoji}
                        </Text>
                      </View>
                      {!isUnlocked && (
                        <Text style={styles.smallLockIcon}>🔒</Text>
                      )}
                      <Text style={styles.avatarName}>
                        {avatarOption.name}
                      </Text>
                      {!isUnlocked && (
                        <Text style={styles.smallUnlockLevel}>
                          Lvl {avatarOption.level}
                        </Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Titres Tab */}
          {activeTab === "titles" && (
            <View style={styles.tabContent}>
              <Text style={styles.sectionTitle}>Choisis ton titre</Text>

              <TouchableOpacity
                onPress={() => setSelectedTitle(undefined)}
                style={[
                  styles.titleOption,
                  !selectedTitle && styles.titleOptionSelected
                ]}
              >
                <Text style={styles.titleOptionText}>Aucun titre</Text>
              </TouchableOpacity>

              {UNLOCKABLE_TITLES.map((titleOption) => {
                const isUnlocked = unlockedTitles.includes(titleOption.title);
                const isSelected = selectedTitle === titleOption.title;

                return (
                  <TouchableOpacity
                    key={`title_${titleOption.title}`}
                    disabled={!isUnlocked}
                    onPress={() => setSelectedTitle(titleOption.title)}
                    style={[
                      styles.titleOption,
                      isSelected && styles.titleOptionSelected,
                      !isUnlocked && styles.titleOptionLocked
                    ]}
                  >
                    {!isUnlocked && (
                      <Text style={styles.titleLockIcon}>🔒</Text>
                    )}
                    <Text style={styles.titleOptionText}>
                      {titleOption.title}
                    </Text>
                    {isUnlocked && (
                      <Text style={styles.titleLevel}>
                        Lvl {titleOption.level}
                      </Text>
                    )}
                    {!isUnlocked && (
                      <Text style={styles.titleUnlockLevel}>
                        Débloque au Lvl {titleOption.level}
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </ScrollView>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButtonLarge} onPress={handleSave}>
          <Text style={styles.saveButtonLargeText}>💾 ENREGISTRER</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
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
  closeButton: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: "#7F8C8D"
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800" as const,
    color: "#2C3E50"
  },
  saveButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#50C878",
    alignItems: "center",
    justifyContent: "center"
  },
  saveButtonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "700" as const
  },
  previewSection: {
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#F8F9FA"
  },
  previewAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4
  },
  previewEmoji: {
    fontSize: 42
  },
  previewName: {
    fontSize: 20,
    fontWeight: "800" as const,
    color: "#2C3E50"
  },
  previewNickname: {
    fontSize: 14,
    fontStyle: "italic" as const,
    color: "#7F8C8D",
    marginTop: 4
  },
  previewLevel: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: "#E6A500",
    marginTop: 4
  },
  previewTitle: {
    fontSize: 12,
    fontWeight: "700" as const,
    color: "#4A90E2",
    marginTop: 4,
    textTransform: "uppercase" as const
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#F8F9FA",
    borderBottomWidth: 1,
    borderBottomColor: "#E1E8ED"
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 3,
    borderBottomColor: "transparent"
  },
  tabActive: {
    borderBottomColor: "#4A90E2"
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 4
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "600" as const,
    color: "#7F8C8D"
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16
  },
  tabContent: {
    paddingBottom: 20
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: "#2C3E50",
    marginBottom: 12,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5
  },
  textInput: {
    borderWidth: 2,
    borderColor: "#E1E8ED",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#2C3E50",
    marginBottom: 16
  },
  infoText: {
    fontSize: 12,
    color: "#7F8C8D",
    fontStyle: "italic" as const,
    marginTop: 8
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20
  },
  colorOptionWrapper: {
    width: "48%",
    alignItems: "center"
  },
  colorOption: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  lockIcon: {
    position: "absolute" as const,
    fontSize: 24,
    top: 20
  },
  colorName: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: "#2C3E50",
    textAlign: "center" as const
  },
  unlockLevel: {
    fontSize: 10,
    color: "#7F8C8D",
    marginTop: 2
  },
  avatarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20
  },
  avatarOptionWrapper: {
    width: "30%",
    alignItems: "center"
  },
  avatarOption: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8
  },
  avatarEmoji: {
    fontSize: 32
  },
  smallLockIcon: {
    position: "absolute" as const,
    fontSize: 20,
    top: 20
  },
  avatarName: {
    fontSize: 11,
    fontWeight: "600" as const,
    color: "#2C3E50",
    textAlign: "center" as const
  },
  smallUnlockLevel: {
    fontSize: 9,
    color: "#7F8C8D",
    marginTop: 2
  },
  titleOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E1E8ED",
    marginBottom: 8,
    backgroundColor: "white"
  },
  titleOptionSelected: {
    borderColor: "#4A90E2",
    backgroundColor: "rgba(74, 144, 226, 0.05)"
  },
  titleOptionLocked: {
    opacity: 0.6
  },
  titleLockIcon: {
    fontSize: 16,
    marginRight: 8
  },
  titleOptionText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#2C3E50"
  },
  titleLevel: {
    fontSize: 11,
    color: "#7F8C8D"
  },
  titleUnlockLevel: {
    fontSize: 11,
    color: "#FF6B6B"
  },
  saveButtonLarge: {
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#4A90E2",
    alignItems: "center"
  },
  saveButtonLargeText: {
    fontSize: 16,
    fontWeight: "800" as const,
    color: "white"
  }
});
