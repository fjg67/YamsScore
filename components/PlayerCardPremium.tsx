import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  TextInput
} from "react-native";
import { Player } from "../types/player";

interface PlayerCardPremiumProps {
  player: Player;
  onEdit?: () => void;
  onRemove?: () => void;
  onPress?: () => void;
  onLongPress?: () => void;
  onNameChange?: (newName: string) => void;
}

export const PlayerCardPremium: React.FC<PlayerCardPremiumProps> = ({
  player,
  onEdit,
  onRemove,
  onPress,
  onLongPress,
  onNameChange
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(player.name);
  const nameInputRef = useRef<TextInput>(null);

  useEffect(() => {
    // Animation flottante idle
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true
        })
      ])
    ).start();
  }, [floatAnim]);

  const floatTranslateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8]
  });

  const onPressHandle = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1.05,
        tension: 100,
        friction: 5,
        useNativeDriver: true
      }),
      Animated.spring(scaleAnim, {
        toValue: 1.0,
        tension: 100,
        friction: 7,
        useNativeDriver: true
      })
    ]).start();
    onPress?.();
  };

  const onAvatarTap = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1.15,
        tension: 100,
        friction: 5,
        useNativeDriver: true
      }),
      Animated.spring(scaleAnim, {
        toValue: 1.0,
        tension: 100,
        friction: 7,
        useNativeDriver: true
      })
    ]).start();
    onEdit?.();
  };

  const onNamePress = () => {
    setEditingName(true);
    setTimeout(() => {
      nameInputRef.current?.focus();
    }, 100);
  };

  const onNameBlur = () => {
    setEditingName(false);
    if (tempName.trim() && tempName !== player.name) {
      onNameChange?.(tempName);
    } else {
      setTempName(player.name);
    }
  };

  const winRate = player.stats.gamesPlayed > 0
    ? Math.round((player.stats.gamesWon / player.stats.gamesPlayed) * 100)
    : 0;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPressHandle}
      onLongPress={onLongPress}
      style={styles.container}
    >
      <View style={[styles.card, { backgroundColor: `${player.color}10`, borderColor: player.color }]}>
        {/* Avatar avec animation */}
        <TouchableOpacity onPress={onAvatarTap} activeOpacity={0.8}>
          <Animated.View
            style={[
              styles.avatarSection,
              {
                transform: [
                  { scale: scaleAnim },
                  { translateY: floatTranslateY }
                ]
              }
            ]}
          >
            <View
              style={[
                styles.avatar,
                { backgroundColor: player.color }
              ]}
            >
              <Text style={styles.avatarEmoji}>
                {player.avatar.emoji || player.avatar.initial}
              </Text>
            </View>
          </Animated.View>
        </TouchableOpacity>

        {/* Nom et édition inline */}
        <View style={styles.nameSection}>
          {editingName ? (
            <TextInput
              ref={nameInputRef}
              value={tempName}
              onChangeText={setTempName}
              onBlur={onNameBlur}
              style={styles.nameInput}
              maxLength={20}
              autoFocus
            />
          ) : (
            <TouchableOpacity onPress={onNamePress}>
              <View style={styles.nameRow}>
                <Text style={styles.playerName}>{player.name}</Text>
                <Text style={styles.editIcon}>✏️</Text>
              </View>
            </TouchableOpacity>
          )}
          {player.nickname && (
            <Text style={styles.nickname}>"{player.nickname}"</Text>
          )}
        </View>

        {/* Badge de niveau */}
        <View style={styles.levelSection}>
          <View style={styles.levelBadge}>
            <Text style={styles.levelIcon}>⭐</Text>
            <Text style={styles.levelText}>Niveau {player.level}</Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>🏆</Text>
            <Text style={styles.statText}>{player.title || "Champion"}</Text>
          </View>
          <View style={styles.statSeparator} />
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>🎯</Text>
            <Text style={styles.statText}>{winRate}% victoires</Text>
          </View>
        </View>

        {/* Barre XP */}
        {player.level && (
          <View style={styles.xpSection}>
            <View style={styles.xpBar}>
              <View
                style={[
                  styles.xpFill,
                  {
                    width: `${(player.xp / (100 * Math.pow(1.5, player.level - 1))) * 100}%`,
                    backgroundColor: player.color
                  }
                ]}
              />
            </View>
            <Text style={styles.xpText}>
              {Math.floor(player.xp)} / {Math.floor(100 * Math.pow(1.5, player.level - 1))} XP
            </Text>
          </View>
        )}

        {/* Badge si présent */}
        {player.badge && (
          <View style={styles.badgeSection}>
            <Text style={styles.badgeIcon}>{player.badge.icon}</Text>
            <Text style={styles.badgeTitle}>{player.badge.title}</Text>
          </View>
        )}

        {/* Actions */}
        {(onEdit || onRemove) && (
          <View style={styles.actions}>
            {onEdit && (
              <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
                <Text style={styles.actionIcon}>🎨</Text>
                <Text style={styles.actionText}>Style</Text>
              </TouchableOpacity>
            )}
            {onRemove && (
              <TouchableOpacity onPress={onRemove} style={[styles.actionButton, styles.removeButton]}>
                <Text style={styles.actionIcon}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 8
  },
  card: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 12
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.5)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8
  },
  avatarEmoji: {
    fontSize: 42
  },
  nameSection: {
    alignItems: "center",
    marginBottom: 12
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  playerName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#2C3E50",
    letterSpacing: 0.5
  },
  editIcon: {
    fontSize: 16,
    opacity: 0.6
  },
  nameInput: {
    fontSize: 24,
    fontWeight: "800",
    color: "#2C3E50",
    letterSpacing: 0.5,
    textAlign: "center",
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 2,
    borderColor: "#4A90E2",
    borderRadius: 8,
    backgroundColor: "rgba(74, 144, 226, 0.1)"
  },
  nickname: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#7F8C8D",
    marginTop: 4
  },
  levelSection: {
    alignItems: "center",
    marginBottom: 12
  },
  levelBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 215, 0, 0.15)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.3)"
  },
  levelIcon: {
    fontSize: 16,
    marginRight: 4
  },
  levelText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#E6A500"
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginBottom: 12
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4
  },
  statIcon: {
    fontSize: 14
  },
  statText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#5D6D7E"
  },
  statSeparator: {
    width: 1,
    height: 12,
    backgroundColor: "#BDC3C7"
  },
  xpSection: {
    marginBottom: 12
  },
  xpBar: {
    height: 8,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 4
  },
  xpFill: {
    height: "100%",
    borderRadius: 4
  },
  xpText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#7F8C8D",
    textAlign: "right"
  },
  badgeSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginBottom: 12
  },
  badgeIcon: {
    fontSize: 18
  },
  badgeTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4A90E2",
    textTransform: "uppercase",
    letterSpacing: 1
  },
  actions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginTop: 8
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "rgba(74, 144, 226, 0.1)"
  },
  removeButton: {
    backgroundColor: "rgba(255, 107, 107, 0.1)",
    paddingHorizontal: 12
  },
  actionIcon: {
    fontSize: 16
  },
  actionText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4A90E2"
  }
});

export default PlayerCardPremium;
