import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';

interface ComparisonRow {
  category: string;
  yamsScore: string;
  you: string;
}

export const ComparisonTable: React.FC = () => {
  const rows: ComparisonRow[] = [
    {
      category: 'Fonctionnement App',
      yamsScore: '✅ On développe et maintient',
      you: '✅ Tu utilises correctement',
    },
    {
      category: 'Correction Bugs',
      yamsScore: '✅ On corrige rapidement',
      you: '✅ Tu signales les problèmes',
    },
    {
      category: 'Sauvegarde Données',
      yamsScore: '⚠️ On facilite l\'export',
      you: '✅ Tu exportes régulièrement',
    },
    {
      category: 'Sécurité App',
      yamsScore: '✅ On sécurise le code',
      you: '✅ Tu protèges ton appareil',
    },
    {
      category: 'Respect Conditions',
      yamsScore: '✅ On applique équitablement',
      you: '✅ Tu les respectes',
    },
    {
      category: 'Support Utilisateur',
      yamsScore: '✅ On répond < 48h',
      you: '✅ Tu fournis les détails',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>📊</Text>
        <Text style={styles.title}>Nous vs Toi : Tableau Récap</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.tableContainer}>
          {/* Header Row */}
          <View style={styles.tableHeader}>
            <View style={[styles.tableCell, styles.categoryCell]}>
              <Text style={styles.tableHeaderText}>Responsabilité</Text>
            </View>
            <View style={[styles.tableCell, styles.companyCell]}>
              <Text style={[styles.tableHeaderText, styles.companyText]}>
                Yams Score 🏢
              </Text>
            </View>
            <View style={[styles.tableCell, styles.userCell]}>
              <Text style={[styles.tableHeaderText, styles.userText]}>
                Toi 👤
              </Text>
            </View>
          </View>

          {/* Data Rows */}
          {rows.map((row, index) => (
            <View
              key={index}
              style={[
                styles.tableRow,
                index % 2 === 0 && styles.tableRowEven,
              ]}>
              <View style={[styles.tableCell, styles.categoryCell]}>
                <Text style={styles.categoryText}>{row.category}</Text>
              </View>
              <View style={[styles.tableCell, styles.companyCell]}>
                <Text style={styles.cellText}>{row.yamsScore}</Text>
              </View>
              <View style={[styles.tableCell, styles.userCell]}>
                <Text style={styles.cellText}>{row.you}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerEmoji: {
    fontSize: 28,
    marginRight: 10,
  },
  title: {
    fontFamily: 'SF Pro Display',
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  tableContainer: {
    minWidth: 600,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#E0E0E0',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tableRowEven: {
    backgroundColor: '#FAFAFA',
  },
  tableCell: {
    padding: 12,
    justifyContent: 'center',
  },
  categoryCell: {
    width: 200,
  },
  companyCell: {
    width: 200,
    backgroundColor: 'rgba(74, 144, 226, 0.05)',
  },
  userCell: {
    width: 200,
    backgroundColor: 'rgba(80, 200, 120, 0.05)',
  },
  tableHeaderText: {
    fontFamily: 'SF Pro Text',
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  companyText: {
    color: '#4A90E2',
  },
  userText: {
    color: '#50C878',
  },
  categoryText: {
    fontFamily: 'SF Pro Text',
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  cellText: {
    fontFamily: 'SF Pro Text',
    fontSize: 14,
    fontWeight: '400',
    color: '#333333',
    lineHeight: 20,
  },
});
