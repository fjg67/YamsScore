import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet
} from "react-native";
import { Player } from "../types/player";
import { PlayerService } from "../services/playerService";
import { AchievementCard } from "../components/AchievementCard";
import { PlayerCustomizationModal } from "../components/PlayerCustomizationModal";
import { getXPForLevel } from "../constants/playerConstants";

interface ProfileScreenProps {
  player: Player;
  onPlayerUpdate: (player: Player) => void;
  onBack: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  player,
  onPlayerUpdate,
  onBack
}) => {
  const [customizationVisible, setCustomizationVisible] = useState(false);
  const [achievements, setAchievements] = useState<any[]>([]);

  useEffect(() => {
    // Charger les achievements
    const nextAchievements = PlayerService.getNextAchievements(player);
    setAchievements(nextAchievements);
  }, [player]);

  const nextLevelXP = getXPForLevel(player.level + 1);
  const xpPercent = (player.xp / nextLevelXP) * 100;
  const winRate = player.stats.gamesPlayed > 0 
    ? Math.round((player.stats.gamesWon / player.stats.gamesPlayed) * 100)
    : 0;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mon Profil</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View
            style={[
              styles.profileAvatar,
              { backgroundColor: player.color }
            ]}
          >
            <Text style={styles.profileEmoji}>
              {player.avatar.emoji || player.avatar.initial}
            </Text>
          </View>

          <Text style={styles.profileName}>{player.name}</Text>
          {player.nickname && (
            <Text style={styles.profileNickname}>"{player.nickname}"</Text>
          )}
          {player.title && (
            <Text style={styles.profileTitle}>{player.title}</Text>
          )}

          <View style={styles.levelSection}>
            <Text style={styles.levelLabel}>NIVEAU</Text>
            <Text style={styles.levelValue}>{player.level}</Text>
          </View>

          {/* XP Bar */}
          <View style={styles.xpBarContainer}>
            <View style={styles.xpBar}>
              <View
                style={[
                  styles.xpBarFill,
                  {
                    width: `${xpPercent}%`,
                    backgroundColor: player.color
                  }
                ]}
              />
            </View>
            <Text style={styles.xpText}>
              {player.xp} / {nextLevelXP} XP
            </Text>
          </View>

          {/* Edit Button */}
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setCustomizationVisible(true)}
          >
            <Text style={styles.editButtonText}>✏️ PERSONNALISER</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>📊 STATISTIQUES</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{player.stats.gamesPlayed}</Text>
              <Text style={styles.statLabel}>Parties</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{player.stats.gamesWon}</Text>
              <Text style={styles.statLabel}>Victoires</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{winRate}%</Text>
              <Text style={styles.statLabel}>Taux</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {player.stats.bestScore}
              </Text>
              <Text style={styles.statLabel}>Meilleur</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {player.stats.averageScore}
              </Text>
              <Text style={styles.statLabel}>Moyenne</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {player.stats.yamsScored}
              </Text>
              <Text style={styles.statLabel}>Yams</Text>
            </View>
          </View>
        </View>

        {/* AI Stats */}
        {(player.stats.aiEasyWins > 0 || player.stats.aiNormalWins > 0 || player.stats.aiHardWins > 0) && (
          <View style={styles.aiStatsSection}>
            <Text style={styles.sectionTitle}>🤖 AFFRONTEMENTS IA</Text>
            <View style={styles.aiStatsRow}>
              <View style={[styles.aiStat, { borderLeftColor: "#50C878" }]}>
                <Text style={styles.aiStatLabel}>Débutant</Text>
                <Text style={styles.aiStatValue}>
                  {player.stats.aiEasyWins}
                </Text>
              </View>
              <View style={[styles.aiStat, { borderLeftColor: "#FFD93D" }]}>
                <Text style={styles.aiStatLabel}>Normal</Text>
                <Text style={styles.aiStatValue}>
                  {player.stats.aiNormalWins}
                </Text>
              </View>
              <View style={[styles.aiStat, { borderLeftColor: "#FF6B6B" }]}>
                <Text style={styles.aiStatLabel}>Difficile</Text>
                <Text style={styles.aiStatValue}>
                  {player.stats.aiHardWins}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Achievements Section */}
        <View style={styles.achievementsSection}>
          <Text style={styles.sectionTitle}>🏆 OBJECTIFS</Text>
          {achievements.map((achievement) => (
            <AchievementCard
              key={achievement.id}
              title={achievement.title}
              description={achievement.description}
              icon="⭐"
              unlocked={achievement.progress >= achievement.maxProgress}
              progress={achievement.progress}
              maxProgress={achievement.maxProgress}
            />
          ))}
        </View>

        {/* Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => PlayerService.exportPlayerData(player)}
          >
            <Text style={styles.actionButtonText}>📤 EXPORTER</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonDanger]}
            onPress={() => {
              // À implémenter: reset progression
            }}
          >
            <Text style={styles.actionButtonText}>🔄 RÉINITIALISER</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Customization Modal */}
      <PlayerCustomizationModal
        player={player}
        visible={customizationVisible}
        onClose={() => setCustomizationVisible(false)}
        onSave={(updatedPlayer) => {
          PlayerService.savePlayer(updatedPlayer);
          onPlayerUpdate(updatedPlayer);
        }}
      />
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
    fontSize: 24,
    fontWeight: "700"
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#2C3E50"
  },
  profileCard: {
    backgroundColor: "#F8F9FA",
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: "center"
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4
  },
  profileEmoji: {
    fontSize: 48
  },
  profileName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#2C3E50"
  },
  profileNickname: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#7F8C8D",
    marginTop: 4
  },
  profileTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4A90E2",
    textTransform: "uppercase",
    marginTop: 8,
    letterSpacing: 0.5
  },
  levelSection: {
    marginTop: 16,
    alignItems: "center"
  },
  levelLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#7F8C8D",
    textTransform: "uppercase",
    letterSpacing: 1
  },
  levelValue: {
    fontSize: 32,
    fontWeight: "800",
    color: "#E6A500"
  },
  xpBarContainer: {
    marginTop: 16,
    width: "100%"
  },
  xpBar: {
    height: 8,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 6
  },
  xpBarFill: {
    height: "100%",
    borderRadius: 4
  },
  xpText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#7F8C8D",
    textAlign: "right"
  },
  editButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#4A90E2"
  },
  editButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "white"
  },
  statsSection: {
    paddingHorizontal: 20,
    marginVertical: 16
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#2C3E50",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12
  },
  statCard: {
    width: "31%",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center"
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#4A90E2",
    marginBottom: 4
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#7F8C8D"
  },
  aiStatsSection: {
    paddingHorizontal: 20,
    marginVertical: 16
  },
  aiStatsRow: {
    flexDirection: "row",
    gap: 12
  },
  aiStat: {
    flex: 1,
    borderLeftWidth: 4,
    paddingLeft: 12,
    paddingVertical: 12
  },
  aiStatLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#7F8C8D",
    marginBottom: 4
  },
  aiStatValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#2C3E50"
  },
  achievementsSection: {
    paddingHorizontal: 20,
    marginVertical: 16
  },
  actionsSection: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    marginVertical: 20
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#4A90E2",
    alignItems: "center"
  },
  actionButtonDanger: {
    backgroundColor: "#FF6B6B"
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "white"
  }
});
