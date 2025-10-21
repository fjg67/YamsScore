import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface TimelineEvent {
  period: string;
  icon: string;
  color: string;
  title: string;
  items: string[];
  storage: string;
  autoDelete?: boolean;
  control?: string;
}

const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    period: 'En temps réel',
    icon: '⚡',
    color: '#50C878',
    title: 'Données Actives',
    items: ['Parties en cours', 'Préférences', 'Achievements'],
    storage: 'Sur ton appareil',
  },
  {
    period: '90 jours',
    icon: '📊',
    color: '#4A90E2',
    title: 'Analytics',
    items: ['Événements d\'usage', 'Rapports de crash'],
    storage: 'Firebase',
    autoDelete: true,
  },
  {
    period: 'Indéfiniment',
    icon: '♾️',
    color: '#9B59B6',
    title: 'Historique Personnel',
    items: ['Tes parties', 'Tes stats', 'Ton profil'],
    storage: 'Local',
    control: 'TU choisis quand supprimer',
  },
];

export const RetentionTimeline: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Combien de Temps On Garde Tes Données
        </Text>
        <Text style={styles.headerIcon}>⏳</Text>
      </View>

      <View style={styles.timeline}>
        {TIMELINE_EVENTS.map((event, index) => (
          <View key={index} style={styles.timelineItem}>
            {/* Line connector (except for last item) */}
            {index < TIMELINE_EVENTS.length - 1 && (
              <View style={[styles.connector, {backgroundColor: event.color}]} />
            )}

            {/* Event */}
            <View style={styles.eventContainer}>
              <View
                style={[styles.iconCircle, {backgroundColor: event.color}]}>
                <Text style={styles.eventIcon}>{event.icon}</Text>
              </View>

              <View style={styles.eventContent}>
                <Text style={styles.period}>{event.period}</Text>
                <Text style={styles.eventTitle}>{event.title}</Text>

                <View style={styles.itemsList}>
                  {event.items.map((item, idx) => (
                    <Text key={idx} style={styles.item}>
                      • {item}
                    </Text>
                  ))}
                </View>

                <View style={styles.storageInfo}>
                  <Text style={styles.storageLabel}>Stocké :</Text>
                  <Text style={styles.storageValue}>{event.storage}</Text>
                </View>

                {event.autoDelete && (
                  <View style={styles.autoDeleteBadge}>
                    <Text style={styles.autoDeleteText}>
                      🗑️ Suppression automatique
                    </Text>
                  </View>
                )}

                {event.control && (
                  <View style={styles.controlBadge}>
                    <Text style={styles.controlText}>{event.control}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.note}>
        <Text style={styles.noteIcon}>ℹ️</Text>
        <Text style={styles.noteText}>
          Après suppression, tes données sont{' '}
          <Text style={styles.bold}>définitivement effacées</Text> sous 48h
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerTitle: {
    fontFamily: 'SF Pro Display',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    flex: 1,
  },
  headerIcon: {
    fontSize: 28,
  },
  timeline: {
    paddingLeft: 8,
  },
  timelineItem: {
    position: 'relative',
    marginBottom: 24,
  },
  connector: {
    position: 'absolute',
    left: 27,
    top: 56,
    width: 3,
    height: '100%',
    borderRadius: 2,
    opacity: 0.3,
  },
  eventContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  eventIcon: {
    fontSize: 28,
  },
  eventContent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  period: {
    fontFamily: 'SF Pro Text',
    fontSize: 12,
    fontWeight: '600',
    color: '#666666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  eventTitle: {
    fontFamily: 'SF Pro Display',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  itemsList: {
    marginBottom: 12,
  },
  item: {
    fontFamily: 'SF Pro Text',
    fontSize: 14,
    color: '#333333',
    lineHeight: 22,
    marginBottom: 4,
  },
  storageInfo: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  storageLabel: {
    fontFamily: 'SF Pro Text',
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  storageValue: {
    fontFamily: 'SF Pro Text',
    fontSize: 14,
    color: '#333333',
  },
  autoDeleteBadge: {
    backgroundColor: 'rgba(243,156,18,0.1)',
    borderRadius: 8,
    padding: 8,
    marginTop: 4,
  },
  autoDeleteText: {
    fontFamily: 'SF Pro Text',
    fontSize: 13,
    color: '#F39C12',
    textAlign: 'center',
  },
  controlBadge: {
    backgroundColor: 'rgba(155,89,182,0.1)',
    borderRadius: 8,
    padding: 8,
    marginTop: 4,
  },
  controlText: {
    fontFamily: 'SF Pro Text',
    fontSize: 13,
    color: '#9B59B6',
    textAlign: 'center',
    fontWeight: '600',
  },
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: 'rgba(74,144,226,0.1)',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  noteIcon: {
    fontSize: 16,
  },
  noteText: {
    fontFamily: 'SF Pro Text',
    fontSize: 14,
    color: '#333333',
    flex: 1,
    lineHeight: 20,
  },
  bold: {
    fontWeight: 'bold',
  },
});
