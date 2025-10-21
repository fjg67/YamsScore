/**
 * StreakCalendar Component
 * Display 30-day streak calendar with activity visualization
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../../../hooks/useTheme';
import type { StreakDay } from '../../data/gamification';

interface Props {
  calendar: StreakDay[];
  currentStreak: number;
  longestStreak: number;
}

export const StreakCalendar: React.FC<Props> = ({
  calendar,
  currentStreak,
  longestStreak,
}) => {
  const { isDarkMode } = useTheme();

  const bgColor = isDarkMode ? '#2A2A2A' : '#F8F8F8';
  const textColor = isDarkMode ? '#FFFFFF' : '#1A1A1A';
  const subtextColor = isDarkMode ? '#A0A0A0' : '#666666';
  const borderColor = isDarkMode ? '#3A3A3A' : '#E0E0E0';

  // Get day of month from date string
  const getDayOfMonth = (dateString: string): number => {
    const date = new Date(dateString);
    return date.getDate();
  };

  return (
    <View style={styles.container}>
      {/* Stats */}
      <View style={[styles.statsContainer, { backgroundColor: bgColor }]}>
        <View style={styles.statBox}>
          <Text style={styles.streakIcon}>🔥</Text>
          <Text style={[styles.statValue, { color: textColor }]}>
            {currentStreak}
          </Text>
          <Text style={[styles.statLabel, { color: subtextColor }]}>
            Série actuelle
          </Text>
        </View>

        <View style={[styles.divider, { backgroundColor: borderColor }]} />

        <View style={styles.statBox}>
          <Text style={styles.streakIcon}>🏆</Text>
          <Text style={[styles.statValue, { color: textColor }]}>
            {longestStreak}
          </Text>
          <Text style={[styles.statLabel, { color: subtextColor }]}>
            Meilleure série
          </Text>
        </View>
      </View>

      {/* Calendar Grid */}
      <View style={styles.calendarContainer}>
        <Text style={[styles.calendarTitle, { color: textColor }]}>
          30 Derniers Jours
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.calendar}>
            {/* Week days labels */}
            <View style={styles.weekLabels}>
              {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((day, index) => (
                <Text
                  key={index}
                  style={[styles.weekLabel, { color: subtextColor }]}
                >
                  {day}
                </Text>
              ))}
            </View>

            {/* Days grid */}
            <View style={styles.daysGrid}>
              {calendar.map((day, index) => {
                const dayOfMonth = getDayOfMonth(day.date);
                const isToday = index === calendar.length - 1;

                return (
                  <View key={day.date} style={styles.dayColumn}>
                    <View
                      style={[
                        styles.dayCell,
                        {
                          backgroundColor: day.active
                            ? '#10B981'
                            : isDarkMode
                            ? '#3A3A3A'
                            : '#E0E0E0',
                        },
                        isToday && styles.todayCell,
                      ]}
                    >
                      {day.active && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </View>
                    <Text
                      style={[
                        styles.dayNumber,
                        { color: subtextColor },
                        isToday && styles.todayNumber,
                      ]}
                    >
                      {dayOfMonth}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </ScrollView>

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendBox,
                { backgroundColor: isDarkMode ? '#3A3A3A' : '#E0E0E0' },
              ]}
            />
            <Text style={[styles.legendText, { color: subtextColor }]}>
              Inactif
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, { backgroundColor: '#10B981' }]} />
            <Text style={[styles.legendText, { color: subtextColor }]}>
              Actif
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  streakIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  divider: {
    width: 1,
    marginHorizontal: 16,
  },
  calendarContainer: {
    marginBottom: 12,
  },
  calendarTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  scrollContent: {
    paddingRight: 16,
  },
  calendar: {
    paddingHorizontal: 4,
  },
  weekLabels: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekLabel: {
    width: 32,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '600',
    marginRight: 4,
  },
  daysGrid: {
    flexDirection: 'row',
  },
  dayColumn: {
    alignItems: 'center',
    marginRight: 4,
  },
  dayCell: {
    width: 32,
    height: 32,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  todayCell: {
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  checkmark: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  dayNumber: {
    fontSize: 10,
    textAlign: 'center',
  },
  todayNumber: {
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    gap: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendBox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
  },
});
