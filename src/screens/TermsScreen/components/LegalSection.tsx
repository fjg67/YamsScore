import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {haptics} from '../../../utils/haptics';

interface LegalSectionProps {
  id: string;
  number: string;
  icon: string;
  iconBackground: string;
  title: string;
  readTime?: string;
  children: React.ReactNode;
  important?: boolean;
}

export const LegalSection: React.FC<LegalSectionProps> = ({
  id,
  number,
  icon,
  iconBackground,
  title,
  readTime,
  children,
  important = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(important);

  const toggleExpand = () => {
    haptics.light();
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={styles.container} id={id}>
      <TouchableOpacity
        onPress={toggleExpand}
        activeOpacity={0.7}
        style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconContainer, {backgroundColor: iconBackground}]}>
            <Text style={styles.icon}>{icon}</Text>
          </View>
          <View style={styles.titleContainer}>
            <View style={styles.titleRow}>
              <Text style={styles.number}>{number}</Text>
              <Text style={styles.title}>{title}</Text>
              {important && <Text style={styles.importantBadge}>Important</Text>}
            </View>
            {readTime && (
              <Text style={styles.readTime}>⏱️ {readTime}</Text>
            )}
          </View>
        </View>
        <Text style={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</Text>
      </TouchableOpacity>

      {isExpanded && <View style={styles.content}>{children}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FAFAFA',
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 24,
  },
  titleContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  number: {
    fontFamily: 'SF Pro Display',
    fontSize: 18,
    fontWeight: '700',
    color: '#4A90E2',
    marginRight: 6,
  },
  title: {
    fontFamily: 'SF Pro Display',
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    flex: 1,
  },
  importantBadge: {
    fontFamily: 'SF Pro Text',
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginLeft: 8,
    overflow: 'hidden',
  },
  readTime: {
    fontFamily: 'SF Pro Text',
    fontSize: 13,
    fontWeight: '400',
    color: '#999999',
    marginTop: 4,
  },
  expandIcon: {
    fontSize: 16,
    color: '#4A90E2',
    marginLeft: 12,
  },
  content: {
    padding: 20,
  },
});
