/**
 * Composants des étapes Niveau Expert (7 étapes)
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { ZoomIn } from 'react-native-reanimated';

interface StepProps {
  onComplete: () => void;
}

// ÉTAPE 19 - Optimisation Stratégique
export const Step19Optimization: React.FC<StepProps> = ({ onComplete }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎯 Optimisation IA</Text>
      <Text style={styles.text}>
        L'IA analyse tes lancers et te suggère les meilleurs choix stratégiques !
      </Text>
      <View style={styles.heatmap}>
        <Text style={styles.heatmapTitle}>Heatmap des coups optimaux</Text>
        <View style={styles.heatmapGrid}>
          {['Yams', 'Grande Suite', 'Carré', 'Brelan'].map((combo, i) => (
            <View key={combo} style={[styles.heatmapCell, { opacity: 1 - i * 0.2 }]}>
              <Text style={styles.heatmapText}>{combo}</Text>
              <Text style={styles.heatmapValue}>{90 - i * 15}%</Text>
            </View>
          ))}
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={onComplete}>
        <Text style={styles.buttonText}>Utiliser l'IA →</Text>
      </TouchableOpacity>
    </View>
  );
};

// ÉTAPE 20 - Mode Speedrun
export const Step20Speedrun: React.FC<StepProps> = ({ onComplete }) => {
  const [time, setTime] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚡ Mode Speedrun</Text>
      <Text style={styles.text}>
        Défie les meilleurs joueurs du monde et grimpe dans le leaderboard !
      </Text>
      <View style={styles.timerBox}>
        <Text style={styles.timerLabel}>Ton meilleur temps</Text>
        <Text style={styles.timerValue}>8:23</Text>
        <Text style={styles.timerRank}>Rang mondial: #47</Text>
      </View>
      <View style={styles.topPlayers}>
        <Text style={styles.topTitle}>Top 3 Mondial</Text>
        {[
          { name: 'ProGamer_42', time: '8:23' },
          { name: 'YamsMaster', time: '8:45' },
          { name: 'QuickDice', time: '9:01' },
        ].map((player, i) => (
          <View key={player.name} style={styles.topRow}>
            <Text style={styles.topMedal}>{['🥇', '🥈', '🥉'][i]}</Text>
            <Text style={styles.topName}>{player.name}</Text>
            <Text style={styles.topTime}>{player.time}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.button} onPress={onComplete}>
        <Text style={styles.buttonText}>Lancer un Speedrun →</Text>
      </TouchableOpacity>
    </View>
  );
};

// ÉTAPE 21 - Combos Avancés
export const Step21Combos: React.FC<StepProps> = ({ onComplete }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔥 Combos Avancés</Text>
      <Text style={styles.text}>
        Enchaîne les combinaisons pour maximiser tes points !
      </Text>
      <View style={styles.comboChain}>
        <View style={styles.comboStep}>
          <Text style={styles.comboIcon}>🎲</Text>
          <Text style={styles.comboName}>Brelan</Text>
          <Text style={styles.comboPoints}>+18pts</Text>
        </View>
        <Text style={styles.comboArrow}>→</Text>
        <View style={styles.comboStep}>
          <Text style={styles.comboIcon}>🎯</Text>
          <Text style={styles.comboName}>Carré</Text>
          <Text style={styles.comboPoints}>+24pts</Text>
        </View>
        <Text style={styles.comboArrow}>→</Text>
        <View style={styles.comboStep}>
          <Text style={styles.comboIcon}>👑</Text>
          <Text style={styles.comboName}>YAMS</Text>
          <Text style={styles.comboPoints}>+50pts</Text>
        </View>
      </View>
      <View style={styles.comboTotal}>
        <Text style={styles.comboTotalText}>Total Combo: +92 points ! 🔥</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={onComplete}>
        <Text style={styles.buttonText}>Maîtriser les combos →</Text>
      </TouchableOpacity>
    </View>
  );
};

// ÉTAPE 22 - Mode Compétitif
export const Step22Competitive: React.FC<StepProps> = ({ onComplete }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏆 Mode Compétitif</Text>
      <Text style={styles.text}>
        Participe aux tournois et affrontements en ligne !
      </Text>
      <View style={styles.tournamentCard}>
        <Text style={styles.tournamentBadge}>🏆 TOURNOI EN COURS</Text>
        <Text style={styles.tournamentName}>Championship Yams 2025</Text>
        <Text style={styles.tournamentInfo}>156 joueurs • Se termine dans 2h</Text>
        <View style={styles.prizeBox}>
          <Text style={styles.prizeLabel}>1er Prix:</Text>
          <Text style={styles.prizeValue}>Thème Exclusif "Or" 🏆</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={onComplete}>
        <Text style={styles.buttonText}>Rejoindre →</Text>
      </TouchableOpacity>
    </View>
  );
};

// ÉTAPE 23 - Analyse Prédictive
export const Step23Predictions: React.FC<StepProps> = ({ onComplete }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔮 Analyse Prédictive</Text>
      <Text style={styles.text}>
        Utilise les probabilités pour anticiper les meilleurs coups !
      </Text>
      <View style={styles.predictionBox}>
        <Text style={styles.predictionTitle}>Prédiction IA</Text>
        <Text style={styles.predictionText}>
          Avec ces dés, tu as 68% de chance d'obtenir un Full House au prochain lancer.
        </Text>
        <View style={styles.probabilityBar}>
          <View style={[styles.probabilityFill, { width: '68%' }]} />
          <Text style={styles.probabilityText}>68%</Text>
        </View>
      </View>
      <View style={styles.recommendationBox}>
        <Text style={styles.recommendationTitle}>💡 Recommandation</Text>
        <Text style={styles.recommendationText}>
          Garde les trois 4 et relance les deux autres dés.
        </Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={onComplete}>
        <Text style={styles.buttonText}>Utiliser les prédictions →</Text>
      </TouchableOpacity>
    </View>
  );
};

// ÉTAPE 24 - Création de Tournois
export const Step24Tournament: React.FC<StepProps> = ({ onComplete }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎪 Créateur de Tournois</Text>
      <Text style={styles.text}>
        Organise tes propres compétitions avec tes amis !
      </Text>
      <View style={styles.tournamentForm}>
        <View style={styles.formItem}>
          <Text style={styles.formLabel}>Nom du tournoi</Text>
          <View style={styles.formInput}>
            <Text style={styles.formPlaceholder}>Ex: "Tournoi de Pâques"</Text>
          </View>
        </View>
        <View style={styles.formItem}>
          <Text style={styles.formLabel}>Nombre de joueurs</Text>
          <View style={styles.formOptions}>
            {['4', '8', '16'].map(num => (
              <View key={num} style={styles.formOption}>
                <Text style={styles.formOptionText}>{num}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.formItem}>
          <Text style={styles.formLabel}>Format</Text>
          <View style={styles.formOption}>
            <Text style={styles.formOptionText}>Élimination directe</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={onComplete}>
        <Text style={styles.buttonText}>Créer le tournoi →</Text>
      </TouchableOpacity>
    </View>
  );
};

// ÉTAPE 25 - Master Class Finale
export const Step25MasterClass: React.FC<StepProps> = ({ onComplete }) => {
  const [celebrating, setCelebrating] = useState(false);

  const handleComplete = () => {
    setCelebrating(true);
    setTimeout(onComplete, 3000);
  };

  return (
    <View style={styles.container}>
      <Animated.Text entering={ZoomIn.duration(800)} style={styles.masterTitle}>
        👑 MASTER CLASS FINALE 👑
      </Animated.Text>
      <Text style={styles.text}>
        Félicitations ! Tu as complété TOUS les niveaux du tutoriel !
      </Text>

      <View style={styles.achievementBox}>
        <Text style={styles.achievementTitle}>🏆 Accomplissements débloqués</Text>
        <View style={styles.achievementList}>
          <Text style={styles.achievementItem}>✓ Badge "Grand Maître Yams"</Text>
          <Text style={styles.achievementItem}>✓ Thème "Or 24 carats"</Text>
          <Text style={styles.achievementItem}>✓ Avatar "Légende Vivante"</Text>
          <Text style={styles.achievementItem}>✓ Accès Beta Features</Text>
          <Text style={styles.achievementItem}>✓ Certificat de Maîtrise</Text>
        </View>
      </View>

      <View style={styles.statsBox}>
        <Text style={styles.statsTitle}>Tes Statistiques</Text>
        <Text style={styles.statsText}>25 étapes complétées ✅</Text>
        <Text style={styles.statsText}>36 badges débloqués 🏅</Text>
        <Text style={styles.statsText}>Niveau Légende (21+) 👑</Text>
      </View>

      <TouchableOpacity
        style={[styles.button, styles.masterButton]}
        onPress={handleComplete}
      >
        <LinearGradient
          colors={['#FFD700', '#FFA500']}
          style={styles.masterButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.masterButtonText}>
            {celebrating ? '🎉 TU ES UN MAÎTRE ! 🎉' : '🎊 CÉLÉBRER LA VICTOIRE !'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      {celebrating && (
        <Text style={styles.congratsText}>
          Bienvenue dans le Club des 1% ! 💎
        </Text>
      )}
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
    color: '#9B59B6',
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
    backgroundColor: '#9B59B6',
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
  // Heatmap
  heatmap: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  heatmapTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 15,
  },
  heatmapGrid: {
    gap: 10,
  },
  heatmapCell: {
    backgroundColor: '#E8D5F2',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heatmapText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  heatmapValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#9B59B6',
  },
  // Timer
  timerBox: {
    backgroundColor: '#9B59B6',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  timerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  timerValue: {
    fontSize: 48,
    fontWeight: '900',
    color: '#fff',
    marginVertical: 10,
  },
  timerRank: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  // Top Players
  topPlayers: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
  },
  topTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  topMedal: {
    fontSize: 24,
    marginRight: 10,
  },
  topName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  topTime: {
    fontSize: 14,
    fontWeight: '700',
    color: '#9B59B6',
  },
  // Combos
  comboChain: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  comboStep: {
    alignItems: 'center',
  },
  comboIcon: {
    fontSize: 32,
    marginBottom: 5,
  },
  comboName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  comboPoints: {
    fontSize: 14,
    fontWeight: '900',
    color: '#9B59B6',
  },
  comboArrow: {
    fontSize: 20,
    color: '#9B59B6',
    marginHorizontal: 10,
  },
  comboTotal: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    padding: 15,
    width: '100%',
  },
  comboTotalText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
  },
  // Tournament
  tournamentCard: {
    backgroundColor: '#9B59B6',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginBottom: 20,
  },
  tournamentBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFD700',
    marginBottom: 10,
  },
  tournamentName: {
    fontSize: 20,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 5,
  },
  tournamentInfo: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 15,
  },
  prizeBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    padding: 12,
  },
  prizeLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  prizeValue: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFD700',
  },
  // Predictions
  predictionBox: {
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    padding: 15,
    width: '100%',
    marginBottom: 15,
  },
  predictionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  predictionText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
    marginBottom: 15,
  },
  probabilityBar: {
    height: 30,
    backgroundColor: '#E0E0E0',
    borderRadius: 15,
    overflow: 'hidden',
    position: 'relative',
  },
  probabilityFill: {
    height: '100%',
    backgroundColor: '#9B59B6',
  },
  probabilityText: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    textAlign: 'center',
    lineHeight: 30,
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  recommendationBox: {
    backgroundColor: '#E8D5F2',
    borderRadius: 12,
    padding: 15,
    width: '100%',
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
  },
  // Tournament Form
  tournamentForm: {
    width: '100%',
    gap: 15,
    marginBottom: 20,
  },
  formItem: {
    width: '100%',
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    padding: 12,
  },
  formPlaceholder: {
    fontSize: 14,
    color: '#999',
  },
  formOptions: {
    flexDirection: 'row',
    gap: 10,
  },
  formOption: {
    backgroundColor: '#E8D5F2',
    borderRadius: 8,
    padding: 12,
    flex: 1,
    alignItems: 'center',
  },
  formOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9B59B6',
  },
  // Master Class
  masterTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFD700',
    marginBottom: 15,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  achievementBox: {
    backgroundColor: '#FFF9E6',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  achievementList: {
    gap: 8,
  },
  achievementItem: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  statsBox: {
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    padding: 15,
    width: '100%',
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  statsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    marginBottom: 5,
  },
  masterButton: {
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  masterButtonGradient: {
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 12,
  },
  masterButtonText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
  },
  congratsText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#9B59B6',
    textAlign: 'center',
    marginTop: 15,
  },
});
