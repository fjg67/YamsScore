/**
 * Composants des étapes Niveau Intermédiaire (8 étapes)
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface StepProps {
  onComplete: () => void;
}

// ÉTAPE 11 - Mode Statistiques
export const Step11Stats: React.FC<StepProps> = ({ onComplete }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 Mode Statistiques</Text>
      <Text style={styles.text}>
        Consulte tes performances, tes moyennes et ton évolution !
      </Text>
      <View style={styles.statsDemo}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>247</Text>
          <Text style={styles.statLabel}>Score moyen</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>15</Text>
          <Text style={styles.statLabel}>Parties jouées</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={onComplete}>
        <Text style={styles.buttonText}>Compris →</Text>
      </TouchableOpacity>
    </View>
  );
};

// ÉTAPE 12 - Raccourcis Secrets
export const Step12Shortcuts: React.FC<StepProps> = ({ onComplete }) => {
  const [discovered, setDiscovered] = useState<string[]>([]);

  const shortcuts = [
    { id: 'swipe', name: 'Swipe gauche', desc: 'Annuler le dernier score' },
    { id: 'longpress', name: 'Long press', desc: 'Éditer un score' },
    { id: 'doubletap', name: 'Double tap', desc: 'Supprimer une ligne' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚡ Raccourcis Secrets</Text>
      <Text style={styles.text}>Découvre les gestes cachés de l'app !</Text>

      {shortcuts.map(shortcut => (
        <TouchableOpacity
          key={shortcut.id}
          style={[
            styles.shortcutCard,
            discovered.includes(shortcut.id) && styles.shortcutCardActive
          ]}
          onPress={() => setDiscovered([...discovered, shortcut.id])}
        >
          <Text style={styles.shortcutName}>{shortcut.name}</Text>
          <Text style={styles.shortcutDesc}>{shortcut.desc}</Text>
          {discovered.includes(shortcut.id) && <Text style={styles.check}>✓</Text>}
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={[styles.button, discovered.length < 3 && styles.buttonDisabled]}
        onPress={onComplete}
        disabled={discovered.length < 3}
      >
        <Text style={styles.buttonText}>
          {discovered.length < 3 ? `Découvre-les tous (${discovered.length}/3)` : 'Super ! →'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// ÉTAPE 13 - Gestion Multi-joueurs
export const Step13Multiplayer: React.FC<StepProps> = ({ onComplete }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>👥 Gestion Multi-joueurs</Text>
      <Text style={styles.text}>
        Organise des parties jusqu'à 4 joueurs et suis le classement en direct !
      </Text>
      <View style={styles.leaderboard}>
        {[
          { name: 'Alice', score: 287, rank: 1 },
          { name: 'Bob', score: 251, rank: 2 },
          { name: 'Charlie', score: 189, rank: 3 },
        ].map(player => (
          <View key={player.name} style={styles.playerRow}>
            <Text style={styles.rank}>#{player.rank}</Text>
            <Text style={styles.playerName}>{player.name}</Text>
            <Text style={styles.score}>{player.score}pts</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.button} onPress={onComplete}>
        <Text style={styles.buttonText}>Compris →</Text>
      </TouchableOpacity>
    </View>
  );
};

// ÉTAPE 14 - Personnalisation Avancée
export const Step14Customization: React.FC<StepProps> = ({ onComplete }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎨 Personnalisation</Text>
      <Text style={styles.text}>
        Change les thèmes, couleurs et avatars pour personnaliser ton expérience !
      </Text>
      <View style={styles.themesGrid}>
        {['🌊 Ocean', '🌲 Forest', '🌙 Night', '🔥 Fire'].map(theme => (
          <View key={theme} style={styles.themeCard}>
            <Text style={styles.themeText}>{theme}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.button} onPress={onComplete}>
        <Text style={styles.buttonText}>Explorer →</Text>
      </TouchableOpacity>
    </View>
  );
};

// ÉTAPE 15 - Partage de Résultats
export const Step15Sharing: React.FC<StepProps> = ({ onComplete }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📤 Partage tes Victoires</Text>
      <Text style={styles.text}>
        Crée de beaux visuels et partage tes meilleurs scores sur les réseaux sociaux !
      </Text>
      <View style={styles.sharePreview}>
        <Text style={styles.shareTitle}>🏆 Mon Record !</Text>
        <Text style={styles.shareScore}>347 points</Text>
        <Text style={styles.shareSubtext}>avec 2 Yams ! 🎲🎲</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={onComplete}>
        <Text style={styles.buttonText}>Partager →</Text>
      </TouchableOpacity>
    </View>
  );
};

// ÉTAPE 16 - Navigation Historique
export const Step16History: React.FC<StepProps> = ({ onComplete }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📚 Historique</Text>
      <Text style={styles.text}>
        Retrouve toutes tes parties passées et analyse tes performances !
      </Text>
      <ScrollView style={styles.historyList}>
        {['Hier - 287pts', 'Il y a 2j - 251pts', 'Il y a 5j - 302pts'].map((game, i) => (
          <View key={i} style={styles.historyItem}>
            <Text style={styles.historyText}>{game}</Text>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.button} onPress={onComplete}>
        <Text style={styles.buttonText}>Compris →</Text>
      </TouchableOpacity>
    </View>
  );
};

// ÉTAPE 17 - Calcul Mental
export const Step17MentalMath: React.FC<StepProps> = ({ onComplete }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧮 Calcul Mental</Text>
      <Text style={styles.text}>
        Astuces pour calculer rapidement tes scores sans erreur !
      </Text>
      <View style={styles.tipBox}>
        <Text style={styles.tipTitle}>💡 Astuce Pro</Text>
        <Text style={styles.tipText}>
          Pour la section supérieure, multiplie le nombre de dés par la valeur.
        </Text>
        <Text style={styles.tipExample}>Exemple: 3 dés × 4 = 12 points</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={onComplete}>
        <Text style={styles.buttonText}>Noté ! →</Text>
      </TouchableOpacity>
    </View>
  );
};

// ÉTAPE 18 - Analyse de Parties
export const Step18Analysis: React.FC<StepProps> = ({ onComplete }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📈 Analyse IA</Text>
      <Text style={styles.text}>
        L'IA analyse tes parties et te donne des conseils pour t'améliorer !
      </Text>
      <View style={styles.analysisBox}>
        <Text style={styles.analysisTitle}>💡 Conseil IA</Text>
        <Text style={styles.analysisText}>
          Tu pourrais améliorer ta stratégie de Brelan en gardant plus souvent les dés élevés.
        </Text>
        <Text style={styles.analysisImpact}>Impact: +15 points en moyenne</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={onComplete}>
        <Text style={styles.buttonText}>Niveau Intermédiaire Terminé ! 🎉</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
  },
  button: {
    backgroundColor: '#FFB347',
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 12,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  buttonDisabled: {
    backgroundColor: '#D0D0D0',
  },
  // Stats
  statsDemo: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF5E6',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFB347',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFB347',
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  // Shortcuts
  shortcutCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    position: 'relative',
  },
  shortcutCardActive: {
    borderColor: '#FFB347',
    backgroundColor: '#FFF5E6',
  },
  shortcutName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  shortcutDesc: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
  check: {
    position: 'absolute',
    top: 15,
    right: 15,
    fontSize: 20,
    color: '#FFB347',
  },
  // Leaderboard
  leaderboard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  rank: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFB347',
    width: 40,
  },
  playerName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  score: {
    fontSize: 16,
    fontWeight: '700',
    color: '#666',
  },
  // Themes
  themesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  themeCard: {
    width: '47%',
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFB347',
  },
  themeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  // Share Preview
  sharePreview: {
    backgroundColor: '#FFD700',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    width: '100%',
  },
  shareTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#fff',
  },
  shareScore: {
    fontSize: 48,
    fontWeight: '900',
    color: '#fff',
    marginVertical: 10,
  },
  shareSubtext: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  // History
  historyList: {
    width: '100%',
    maxHeight: 200,
  },
  historyItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FFB347',
  },
  historyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  // Tips
  tipBox: {
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    padding: 15,
    width: '100%',
    borderLeftWidth: 4,
    borderLeftColor: '#FFB347',
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
    marginBottom: 8,
  },
  tipExample: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFB347',
  },
  // Analysis
  analysisBox: {
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    padding: 20,
    width: '100%',
  },
  analysisTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  analysisText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#666',
    marginBottom: 10,
  },
  analysisImpact: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4ECDC4',
  },
});
