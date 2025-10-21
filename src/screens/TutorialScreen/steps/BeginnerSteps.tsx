/**
 * Composants des étapes Niveau Débutant (10 étapes)
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { HotSpot } from '../components/HotSpot';

interface StepProps {
  onComplete: () => void;
}

// ============================================
// ÉTAPE 1 - Bienvenue Interactive
// ============================================
export const Step01Welcome: React.FC<StepProps> = ({ onComplete }) => {
  return (
    <View style={styles.stepContentContainer}>
      <Animated.Text entering={ZoomIn.duration(600)} style={styles.diceAvatar}>
        🎲
      </Animated.Text>
      <View style={styles.speechBubble}>
        <Text style={styles.speechText}>Salut ! Je suis Dédé, ton guide personnel ! 👋</Text>
        <Text style={styles.speechText}>
          Je vais t'apprendre à devenir un maître du Yams en quelques minutes.
        </Text>
      </View>

      <TouchableOpacity style={styles.bigActionButton} onPress={onComplete} activeOpacity={0.8}>
        <Text style={styles.bigActionButtonText}>Tape-moi pour commencer ! 🎯</Text>
      </TouchableOpacity>
    </View>
  );
};

// ============================================
// ÉTAPE 2 - Créer une Partie
// ============================================
export const Step02CreateGame: React.FC<StepProps> = ({ onComplete }) => {
  return (
    <View style={styles.stepContentContainer}>
      <Text style={styles.instructionText}>
        Pour commencer une partie de Yams, il faut d'abord la créer !
      </Text>

      <View style={styles.demoContainer}>
        <Text style={styles.demoTitle}>Où trouver le bouton ?</Text>
        <View style={styles.mockScreen}>
          <View style={styles.mockHeader}>
            <Text style={styles.mockTitle}>Yams Score</Text>
          </View>
          <HotSpot
            x={50}
            y={20}
            label="Nouvelle Partie"
            size={100}
            onPress={onComplete}
            color="#4ECDC4"
          />
        </View>
      </View>
    </View>
  );
};

// ============================================
// ÉTAPE 3 - Ajouter des Joueurs
// ============================================
export const Step03AddPlayers: React.FC<StepProps> = ({ onComplete }) => {
  const [selectedPlayers, setSelectedPlayers] = useState<number[]>([]);

  const togglePlayer = (num: number) => {
    if (selectedPlayers.includes(num)) {
      setSelectedPlayers(selectedPlayers.filter(p => p !== num));
    } else {
      setSelectedPlayers([...selectedPlayers, num]);
    }
  };

  const handleComplete = () => {
    if (selectedPlayers.length >= 2) {
      onComplete();
    }
  };

  return (
    <View style={styles.stepContentContainer}>
      <Text style={styles.instructionText}>Ajoute entre 2 et 4 joueurs à ta partie !</Text>

      <View style={styles.playerGrid}>
        {[1, 2, 3, 4].map(num => (
          <TouchableOpacity
            key={num}
            style={[
              styles.playerSlot,
              selectedPlayers.includes(num) && styles.playerSlotActive,
            ]}
            onPress={() => togglePlayer(num)}
            activeOpacity={0.7}
          >
            <Text style={styles.playerIcon}>
              {selectedPlayers.includes(num) ? '👤' : '➕'}
            </Text>
            <Text style={styles.playerLabel}>Joueur {num}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedPlayers.length > 0 && (
        <Text style={styles.feedbackText}>
          {selectedPlayers.length === 1 && '⚠️ Ajoute au moins 1 autre joueur'}
          {selectedPlayers.length >= 2 &&
            `✅ Super ! ${selectedPlayers.length} joueurs prêts`}
        </Text>
      )}

      <TouchableOpacity
        style={[
          styles.bigActionButton,
          selectedPlayers.length < 2 && styles.buttonDisabled,
        ]}
        onPress={handleComplete}
        disabled={selectedPlayers.length < 2}
      >
        <Text style={styles.bigActionButtonText}>
          {selectedPlayers.length < 2 ? 'Minimum 2 joueurs' : 'Continuer →'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// ============================================
// ÉTAPE 4 - Comprendre la Feuille de Score
// ============================================
export const Step04Scoresheet: React.FC<StepProps> = ({ onComplete }) => {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  const zones = [
    { id: 'upper', name: 'Section Supérieure', desc: 'As, 2, 3, 4, 5, 6', color: '#4ECDC4' },
    { id: 'bonus', name: 'Bonus', desc: '+35 points si ≥ 63', color: '#FFB347' },
    { id: 'lower', name: 'Section Inférieure', desc: 'Brelan, Carré, Full...', color: '#9B59B6' },
  ];

  return (
    <View style={styles.stepContentContainer}>
      <Text style={styles.instructionText}>
        La feuille de score a 3 zones principales. Tape sur chacune pour les découvrir !
      </Text>

      <View style={styles.zonesContainer}>
        {zones.map(zone => (
          <TouchableOpacity
            key={zone.id}
            style={[
              styles.zoneCard,
              selectedZone === zone.id && { borderColor: zone.color, borderWidth: 3 },
            ]}
            onPress={() => setSelectedZone(zone.id)}
          >
            <Text style={styles.zoneName}>{zone.name}</Text>
            <Text style={styles.zoneDesc}>{zone.desc}</Text>
            {selectedZone === zone.id && <Text style={styles.checkMark}>✓</Text>}
          </TouchableOpacity>
        ))}
      </View>

      {selectedZone && (
        <View style={styles.zoneExplanation}>
          <Text style={styles.explanationTitle}>
            {zones.find(z => z.id === selectedZone)?.name}
          </Text>
          <Text style={styles.explanationText}>
            {selectedZone === 'upper' &&
              'Dans cette section, tu additionnes tous les dés de même valeur. Par exemple, si tu as trois 4, tu marques 12 points.'}
            {selectedZone === 'bonus' &&
              'Si tu obtiens 63 points ou plus dans la section supérieure, tu gagnes un bonus de 35 points !'}
            {selectedZone === 'lower' &&
              'Ici, ce sont les combinaisons spéciales : Brelan, Carré, Full House, Suites et Yams !'}
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.bigActionButton, !selectedZone && styles.buttonDisabled]}
        onPress={onComplete}
        disabled={!selectedZone}
      >
        <Text style={styles.bigActionButtonText}>
          {selectedZone ? 'Compris ! →' : 'Explore les zones'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// ============================================
// ÉTAPE 5 - Premier Score
// ============================================
export const Step05FirstScore: React.FC<StepProps> = ({ onComplete }) => {
  const [score, setScore] = useState<number | null>(null);
  const diceValues = [4, 4, 4, 2, 2]; // Exemple: 3×4 + 2×2

  const handleScoreInput = (value: number) => {
    setScore(value);
  };

  return (
    <View style={styles.stepContentContainer}>
      <Text style={styles.instructionText}>
        Tu as lancé les dés ! Voici ton résultat :
      </Text>

      <View style={styles.diceDisplay}>
        {diceValues.map((value, index) => (
          <View key={index} style={styles.dice}>
            <Text style={styles.diceValue}>{value}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.questionText}>
        Tu as 3 dés avec des 4. Combien de points peux-tu marquer sur la ligne "4" ?
      </Text>

      <View style={styles.numberPad}>
        {[12, 8, 16, 4].map(num => (
          <TouchableOpacity
            key={num}
            style={[
              styles.numberButton,
              score === num && (num === 12 ? styles.numberButtonCorrect : styles.numberButtonWrong),
            ]}
            onPress={() => handleScoreInput(num)}
          >
            <Text style={styles.numberButtonText}>{num}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {score !== null && (
        <Text style={[styles.feedbackText, score === 12 ? styles.successText : styles.errorText]}>
          {score === 12 ? '✅ Parfait ! 3 × 4 = 12 points' : '❌ Réessaye ! (3 dés × 4)'}
        </Text>
      )}

      <TouchableOpacity
        style={[styles.bigActionButton, score !== 12 && styles.buttonDisabled]}
        onPress={onComplete}
        disabled={score !== 12}
      >
        <Text style={styles.bigActionButtonText}>
          {score === 12 ? 'Valider →' : 'Choisis la bonne réponse'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// ============================================
// ÉTAPE 6 - Le Bonus Magique
// ============================================
export const Step06Bonus: React.FC<StepProps> = ({ onComplete }) => {
  const [understood, setUnderstood] = useState(false);

  return (
    <View style={styles.stepContentContainer}>
      <Text style={styles.titleText}>🎁 Le Bonus de 35 Points</Text>

      <View style={styles.bonusExplanation}>
        <View style={styles.bonusCard}>
          <Text style={styles.bonusNumber}>63</Text>
          <Text style={styles.bonusLabel}>Points minimum</Text>
        </View>

        <Text style={styles.bonusArrow}>→</Text>

        <View style={styles.bonusCard}>
          <Text style={styles.bonusNumber}>+35</Text>
          <Text style={styles.bonusLabel}>Bonus !</Text>
        </View>
      </View>

      <Text style={styles.instructionText}>
        Pour obtenir le bonus, tu dois marquer au moins 63 points dans la section supérieure
        (As à 6).
      </Text>

      <View style={styles.exampleBox}>
        <Text style={styles.exampleTitle}>💡 Astuce</Text>
        <Text style={styles.exampleText}>
          Pour atteindre 63, essaie de marquer au moins 3 fois chaque numéro.
        </Text>
        <Text style={styles.exampleText}>Exemple: 3×1 + 3×2 + 3×3 + 3×4 + 3×5 + 3×6 = 63</Text>
      </View>

      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => setUnderstood(!understood)}
      >
        <View style={[styles.checkbox, understood && styles.checkboxChecked]}>
          {understood && <Text style={styles.checkboxMark}>✓</Text>}
        </View>
        <Text style={styles.checkboxLabel}>J'ai compris le bonus !</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.bigActionButton, !understood && styles.buttonDisabled]}
        onPress={onComplete}
        disabled={!understood}
      >
        <Text style={styles.bigActionButtonText}>
          {understood ? 'Continuer →' : 'Coche la case'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// ============================================
// ÉTAPE 7 - Brelan & Carré
// ============================================
export const Step07BrelanCarre: React.FC<StepProps> = ({ onComplete }) => {
  const [selected, setSelected] = useState<'brelan' | 'carre' | null>(null);

  const examples = {
    brelan: [5, 5, 5, 2, 3],
    carre: [6, 6, 6, 6, 1],
  };

  return (
    <View style={styles.stepContentContainer}>
      <Text style={styles.titleText}>🎲 Brelan & Carré</Text>

      <View style={styles.combinationGrid}>
        <TouchableOpacity
          style={[styles.combinationCard, selected === 'brelan' && styles.combinationCardActive]}
          onPress={() => setSelected('brelan')}
        >
          <Text style={styles.combinationEmoji}>🎯</Text>
          <Text style={styles.combinationName}>Brelan</Text>
          <Text style={styles.combinationDesc}>3 dés identiques</Text>
          <View style={styles.diceExample}>
            {examples.brelan.map((val, i) => (
              <Text key={i} style={[styles.miniDice, val === 5 && styles.miniDiceHighlight]}>
                {val}
              </Text>
            ))}
          </View>
          <Text style={styles.combinationScore}>= Somme de tous les dés</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.combinationCard, selected === 'carre' && styles.combinationCardActive]}
          onPress={() => setSelected('carre')}
        >
          <Text style={styles.combinationEmoji}>🎲</Text>
          <Text style={styles.combinationName}>Carré</Text>
          <Text style={styles.combinationDesc}>4 dés identiques</Text>
          <View style={styles.diceExample}>
            {examples.carre.map((val, i) => (
              <Text key={i} style={[styles.miniDice, val === 6 && styles.miniDiceHighlight]}>
                {val}
              </Text>
            ))}
          </View>
          <Text style={styles.combinationScore}>= Somme de tous les dés</Text>
        </TouchableOpacity>
      </View>

      {selected && (
        <View style={styles.exampleBox}>
          <Text style={styles.exampleTitle}>
            {selected === 'brelan' ? 'Exemple Brelan' : 'Exemple Carré'}
          </Text>
          <Text style={styles.exampleText}>
            {selected === 'brelan'
              ? 'Avec 5+5+5+2+3, tu marques 20 points au Brelan'
              : 'Avec 6+6+6+6+1, tu marques 25 points au Carré'}
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.bigActionButton, !selected && styles.buttonDisabled]}
        onPress={onComplete}
        disabled={!selected}
      >
        <Text style={styles.bigActionButtonText}>
          {selected ? 'Compris ! →' : 'Explore les combinaisons'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// ============================================
// ÉTAPE 8 - Full House
// ============================================
export const Step08FullHouse: React.FC<StepProps> = ({ onComplete }) => {
  const [dragging, setDragging] = useState(false);
  const fullHouseExample = [3, 3, 3, 5, 5];

  return (
    <View style={styles.stepContentContainer}>
      <Text style={styles.titleText}>🏠 Full House</Text>

      <Text style={styles.instructionText}>Un Brelan + Une Paire = 25 points</Text>

      <View style={styles.fullHouseDemo}>
        <View style={styles.fullHouseSection}>
          <Text style={styles.sectionLabel}>Brelan (3×)</Text>
          <View style={styles.diceRow}>
            {[3, 3, 3].map((val, i) => (
              <View key={i} style={[styles.dice, styles.diceBrelan]}>
                <Text style={styles.diceValue}>{val}</Text>
              </View>
            ))}
          </View>
        </View>

        <Text style={styles.plusSign}>+</Text>

        <View style={styles.fullHouseSection}>
          <Text style={styles.sectionLabel}>Paire (2×)</Text>
          <View style={styles.diceRow}>
            {[5, 5].map((val, i) => (
              <View key={i} style={[styles.dice, styles.dicePaire]}>
                <Text style={styles.diceValue}>{val}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.resultBox}>
        <Text style={styles.resultText}>= 25 points</Text>
      </View>

      <View style={styles.exampleBox}>
        <Text style={styles.exampleTitle}>⚠️ Important</Text>
        <Text style={styles.exampleText}>
          Peu importe les valeurs, un Full House vaut toujours 25 points fixes !
        </Text>
      </View>

      <TouchableOpacity style={styles.bigActionButton} onPress={onComplete}>
        <Text style={styles.bigActionButtonText}>J'ai compris →</Text>
      </TouchableOpacity>
    </View>
  );
};

// ============================================
// ÉTAPE 9 - Les Suites
// ============================================
export const Step09Suites: React.FC<StepProps> = ({ onComplete }) => {
  const [selectedSuite, setSelectedSuite] = useState<'petite' | 'grande' | null>(null);

  return (
    <View style={styles.stepContentContainer}>
      <Text style={styles.titleText}>📊 Les Suites</Text>

      <View style={styles.combinationGrid}>
        <TouchableOpacity
          style={[
            styles.combinationCard,
            selectedSuite === 'petite' && styles.combinationCardActive,
          ]}
          onPress={() => setSelectedSuite('petite')}
        >
          <Text style={styles.combinationEmoji}>📈</Text>
          <Text style={styles.combinationName}>Petite Suite</Text>
          <Text style={styles.combinationDesc}>4 dés consécutifs</Text>
          <View style={styles.diceExample}>
            {[1, 2, 3, 4, 6].map((val, i) => (
              <Text
                key={i}
                style={[styles.miniDice, val !== 6 && styles.miniDiceHighlight]}
              >
                {val}
              </Text>
            ))}
          </View>
          <Text style={styles.combinationScore}>= 30 points</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.combinationCard,
            selectedSuite === 'grande' && styles.combinationCardActive,
          ]}
          onPress={() => setSelectedSuite('grande')}
        >
          <Text style={styles.combinationEmoji}>📊</Text>
          <Text style={styles.combinationName}>Grande Suite</Text>
          <Text style={styles.combinationDesc}>5 dés consécutifs</Text>
          <View style={styles.diceExample}>
            {[2, 3, 4, 5, 6].map((val, i) => (
              <Text key={i} style={[styles.miniDice, styles.miniDiceHighlight]}>
                {val}
              </Text>
            ))}
          </View>
          <Text style={styles.combinationScore}>= 40 points</Text>
        </TouchableOpacity>
      </View>

      {selectedSuite && (
        <View style={styles.exampleBox}>
          <Text style={styles.exampleTitle}>💡 Astuce</Text>
          <Text style={styles.exampleText}>
            {selectedSuite === 'petite'
              ? 'Exemples: 1-2-3-4, 2-3-4-5, ou 3-4-5-6'
              : 'Seulement 2 possibles: 1-2-3-4-5 ou 2-3-4-5-6'}
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.bigActionButton, !selectedSuite && styles.buttonDisabled]}
        onPress={onComplete}
        disabled={!selectedSuite}
      >
        <Text style={styles.bigActionButtonText}>
          {selectedSuite ? 'Compris ! →' : 'Explore les suites'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// ============================================
// ÉTAPE 10 - Le YAMS !
// ============================================
export const Step10Yams: React.FC<StepProps> = ({ onComplete }) => {
  const [celebrated, setCelebrated] = useState(false);

  const handleCelebrate = () => {
    setCelebrated(true);
    setTimeout(onComplete, 2000);
  };

  return (
    <View style={styles.stepContentContainer}>
      <Animated.Text entering={ZoomIn.duration(800).delay(200)} style={styles.yamsTitle}>
        👑 LE YAMS ! 👑
      </Animated.Text>

      <Text style={styles.instructionText}>La combinaison ultime du jeu !</Text>

      <View style={styles.yamsDemo}>
        <View style={styles.diceRow}>
          {[6, 6, 6, 6, 6].map((val, i) => (
            <Animated.View
              key={i}
              entering={ZoomIn.duration(400).delay(i * 100)}
              style={[styles.dice, styles.diceYams]}
            >
              <Text style={styles.diceValue}>{val}</Text>
            </Animated.View>
          ))}
        </View>

        <Text style={styles.yamsLabel}>5 dés identiques</Text>
      </View>

      <View style={styles.yamsScore}>
        <Text style={styles.yamsScoreText}>= 50 POINTS</Text>
      </View>

      <View style={styles.exampleBox}>
        <Text style={styles.exampleTitle}>🎊 Fun Fact</Text>
        <Text style={styles.exampleText}>
          Le Yams est très rare ! La probabilité de l'obtenir en un lancer est de 0.08% (1 sur
          1296).
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.bigActionButton, styles.yamsButton]}
        onPress={handleCelebrate}
      >
        <LinearGradient
          colors={['#FFD700', '#FFA500']}
          style={styles.yamsButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.yamsButtonText}>
            {celebrated ? '🎉 NIVEAU COMPLÉTÉ ! 🎉' : '🎊 Célébrer le Yams !'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      {celebrated && (
        <Text style={styles.congratsText}>
          Bravo ! Tu as terminé le niveau Débutant ! 🏆
        </Text>
      )}
    </View>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  stepContentContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    width: '100%',
  },
  // Avatar & Speech
  diceAvatar: {
    fontSize: 100,
    marginBottom: 20,
  },
  speechBubble: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    borderWidth: 3,
    borderColor: '#4ECDC4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  speechText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  // Instructions
  titleText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  instructionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    textAlign: 'center',
    marginBottom: 25,
    paddingHorizontal: 10,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4ECDC4',
    textAlign: 'center',
    marginBottom: 20,
  },
  // Buttons
  bigActionButton: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 16,
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 5,
    marginTop: 20,
  },
  bigActionButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#D0D0D0',
    shadowOpacity: 0,
  },
  // Mock Screen
  demoContainer: {
    width: '100%',
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  mockScreen: {
    backgroundColor: '#fff',
    borderRadius: 16,
    height: 300,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    position: 'relative',
    overflow: 'hidden',
  },
  mockHeader: {
    backgroundColor: '#4ECDC4',
    padding: 15,
    alignItems: 'center',
  },
  mockTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  // Player Grid
  playerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
    marginBottom: 20,
  },
  playerSlot: {
    width: 140,
    height: 140,
    backgroundColor: '#F0F0F0',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  playerSlotActive: {
    backgroundColor: '#E8F9F7',
    borderColor: '#4ECDC4',
    borderWidth: 3,
  },
  playerIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  playerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  // Zones
  zonesContainer: {
    width: '100%',
    gap: 12,
    marginBottom: 20,
  },
  zoneCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    position: 'relative',
  },
  zoneName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 5,
  },
  zoneDesc: {
    fontSize: 14,
    color: '#999',
  },
  checkMark: {
    position: 'absolute',
    top: 15,
    right: 15,
    fontSize: 24,
    color: '#4ECDC4',
  },
  zoneExplanation: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
  },
  // Dice Display
  diceDisplay: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 25,
  },
  dice: {
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  diceValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#333',
  },
  // Number Pad
  numberPad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
    marginBottom: 20,
  },
  numberButton: {
    width: 70,
    height: 70,
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  numberButtonText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  numberButtonCorrect: {
    backgroundColor: '#D4EDDA',
    borderColor: '#28A745',
  },
  numberButtonWrong: {
    backgroundColor: '#F8D7DA',
    borderColor: '#DC3545',
  },
  // Feedback
  feedbackText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 15,
  },
  successText: {
    color: '#28A745',
  },
  errorText: {
    color: '#DC3545',
  },
  // Bonus
  bonusExplanation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
    marginBottom: 25,
  },
  bonusCard: {
    backgroundColor: '#FFF9E6',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  bonusNumber: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFB347',
  },
  bonusLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginTop: 5,
  },
  bonusArrow: {
    fontSize: 32,
    color: '#FFB347',
  },
  // Example Box
  exampleBox: {
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#4ECDC4',
  },
  exampleTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  exampleText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
    marginBottom: 5,
  },
  // Checkbox
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 20,
  },
  checkbox: {
    width: 30,
    height: 30,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#4ECDC4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4ECDC4',
  },
  checkboxMark: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '900',
  },
  checkboxLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  // Combinations
  combinationGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  combinationCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  combinationCardActive: {
    borderColor: '#4ECDC4',
    borderWidth: 3,
    backgroundColor: '#F0F8FF',
  },
  combinationEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },
  combinationName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 5,
  },
  combinationDesc: {
    fontSize: 12,
    color: '#999',
    marginBottom: 10,
    textAlign: 'center',
  },
  diceExample: {
    flexDirection: 'row',
    gap: 5,
    marginBottom: 10,
  },
  miniDice: {
    width: 24,
    height: 24,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 24,
  },
  miniDiceHighlight: {
    backgroundColor: '#4ECDC4',
    color: '#fff',
  },
  combinationScore: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  // Full House
  fullHouseDemo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginBottom: 20,
  },
  fullHouseSection: {
    alignItems: 'center',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
    marginBottom: 8,
  },
  diceRow: {
    flexDirection: 'row',
    gap: 5,
  },
  diceBrelan: {
    borderColor: '#4ECDC4',
    backgroundColor: '#E8F9F7',
  },
  dicePaire: {
    borderColor: '#FFB347',
    backgroundColor: '#FFF5E6',
  },
  plusSign: {
    fontSize: 24,
    fontWeight: '900',
    color: '#666',
  },
  resultBox: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  resultText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
  },
  // Yams
  yamsTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  yamsDemo: {
    alignItems: 'center',
    marginBottom: 25,
  },
  diceYams: {
    borderColor: '#FFD700',
    backgroundColor: '#FFF9E6',
    borderWidth: 3,
  },
  yamsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
    marginTop: 15,
  },
  yamsScore: {
    backgroundColor: '#FFD700',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 40,
    marginBottom: 20,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 5,
  },
  yamsScoreText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
  },
  yamsButton: {
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  yamsButtonGradient: {
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 16,
  },
  yamsButtonText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
  },
  congratsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4ECDC4',
    textAlign: 'center',
    marginTop: 15,
  },
});
