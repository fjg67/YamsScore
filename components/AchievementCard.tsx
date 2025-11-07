import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface AchievementCardProps {
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({
  title,
  description,
  icon,
  unlocked,
  progress = 0,
  maxProgress = 1
}) => {
  const progressPercent = (progress / maxProgress) * 100;

  return (
    <View style={[styles.container, { opacity: unlocked ? 1 : 0.6 }]}>
      <View
        style={[
          styles.iconBox,
          { backgroundColor: unlocked ? "#FFD700" : "#E1E8ED" }
        ]}
      >
        <Text style={styles.icon}>{icon}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>

        {maxProgress > 1 && (
          <>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(progressPercent, 100)}%`,
                    backgroundColor: unlocked ? "#50C878" : "#4A90E2"
                  }
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {progress} / {maxProgress}
            </Text>
          </>
        )}
      </View>

      {unlocked && (
        <View style={styles.unlockedBadge}>
          <Text style={styles.unlockedText}>✓</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E1E8ED"
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12
  },
  icon: {
    fontSize: 24
  },
  content: {
    flex: 1
  },
  title: {
    fontSize: 13,
    fontWeight: "700" as const,
    color: "#2C3E50",
    marginBottom: 2
  },
  description: {
    fontSize: 11,
    color: "#7F8C8D",
    marginBottom: 6
  },
  progressBar: {
    height: 4,
    backgroundColor: "#E1E8ED",
    borderRadius: 2,
    overflow: "hidden"
  },
  progressFill: {
    height: "100%",
    borderRadius: 2
  },
  progressText: {
    fontSize: 10,
    color: "#7F8C8D",
    marginTop: 4,
    textAlign: "right" as const
  },
  unlockedBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#50C878",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8
  },
  unlockedText: {
    fontSize: 16,
    color: "white",
    fontWeight: "700" as const
  }
});
