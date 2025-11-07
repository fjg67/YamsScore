import { useState, useCallback } from 'react';
import { Player, GameConfig, SetupPhase } from '../../../types';
import { PLAYER_COLORS } from '../constants';
import { AIPersonality, getAIDisplayName } from '../../../../types/aiPersonality';

const generateId = () => `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const usePlayerSetup = () => {
  const [phase, setPhase] = useState<SetupPhase>(1);
  const [playerCount, setPlayerCount] = useState<number>(0);
  const [players, setPlayers] = useState<Player[]>([]);
  const [aiPersonality, setAiPersonality] = useState<AIPersonality>('prudent');
  // Keep for backward compatibility
  const [aiDifficulty, setAiDifficulty] = useState<'easy' | 'normal' | 'hard'>('normal');
  const [gameConfig, setGameConfig] = useState<GameConfig>({
    mode: 'classic',
    orderType: 'manual',
    soundEnabled: true,
  });

  // Sélection nombre de joueurs
  const selectPlayerCount = useCallback((count: number) => {
    setPlayerCount(count);

    // Initialiser tableau joueurs
    const initialPlayers: Player[] = Array.from({ length: count }, (_, i) => ({
      id: generateId(),
      name: '',
      color: PLAYER_COLORS[i].hex,
      colorName: PLAYER_COLORS[i].name,
      position: i + 1,
    }));

    setPlayers(initialPlayers);

    // Si mode solo (1 joueur), aller à la phase de sélection de difficulté (2)
    // Sinon, aller directement à la phase de saisie des noms (3)
    if (count === 1) {
      setPhase(2); // Phase difficulté
    } else {
      setPhase(3); // Phase noms
    }
  }, []);

  // Mise à jour nom joueur
  const updatePlayerName = useCallback((playerId: string, name: string) => {
    setPlayers(prev =>
      prev.map(p => p.id === playerId ? { ...p, name } : p)
    );
  }, []);

  // Mise à jour couleur joueur
  const updatePlayerColor = useCallback((playerId: string, color: string, colorName: string) => {
    setPlayers(prev =>
      prev.map(p => p.id === playerId ? { ...p, color, colorName } : p)
    );
  }, []);

  // Suppression joueur
  const deletePlayer = useCallback((playerId: string) => {
    setPlayers(prev => {
      const filtered = prev.filter(p => p.id !== playerId);
      // Réajuster positions
      return filtered.map((p, i) => ({ ...p, position: i + 1 }));
    });
    setPlayerCount(prev => prev - 1);
  }, []);

  // Ajout joueur
  const addPlayer = useCallback(() => {
    const newPlayer: Player = {
      id: generateId(),
      name: '',
      color: PLAYER_COLORS[players.length % PLAYER_COLORS.length].hex,
      colorName: PLAYER_COLORS[players.length % PLAYER_COLORS.length].name,
      position: players.length + 1,
    };
    setPlayers(prev => [...prev, newPlayer]);
    setPlayerCount(prev => prev + 1);
  }, [players.length]);

  // Réorganisation (drag & drop)
  const reorderPlayers = useCallback((fromIndex: number, toIndex: number) => {
    setPlayers(prev => {
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);

      // Réajuster positions
      return updated.map((p, i) => ({ ...p, position: i + 1 }));
    });
  }, []);

  // Validation formulaire
  const canProceed = useCallback(() => {
    if (phase === 1) {
      // Phase 1 : sélection du nombre de joueurs
      return playerCount > 0;
    }
    if (phase === 2) {
      // Phase 2 : sélection de la difficulté (mode solo uniquement)
      return aiDifficulty !== undefined;
    }
    if (phase === 3) {
      // Phase 3 : saisie des noms
      const minPlayers = playerCount === 1 ? 1 : 2;
      return players.every(p =>
        p.name.length >= 2 && p.name.length <= 15
      ) && players.length >= minPlayers;
    }
    return true;
  }, [phase, playerCount, players, aiDifficulty]);

  // Navigation phases
  const nextPhase = useCallback(() => {
    if (canProceed()) {
      setPhase(prev => Math.min(4, prev + 1) as SetupPhase);
    }
  }, [canProceed]);

  const prevPhase = useCallback(() => {
    setPhase(prev => {
      // Si on est en phase 3 (liste joueurs) et mode solo, revenir à phase 1
      if (prev === 3 && playerCount === 1) {
        return 1;
      }
      // Sinon, décrémenter normalement
      return Math.max(1, prev - 1) as SetupPhase;
    });
  }, [playerCount]);

  // Skip à une phase spécifique
  const goToPhase = useCallback((targetPhase: SetupPhase) => {
    setPhase(targetPhase);
  }, []);

  // Update game config
  const updateGameConfig = useCallback((updates: Partial<GameConfig>) => {
    setGameConfig(prev => ({ ...prev, ...updates }));
  }, []);

  // Lancement partie
  const launchGame = useCallback(() => {
    // Si mode Solo, ajouter un joueur IA
    let finalPlayers = [...players];
    if (playerCount === 1) {
      const aiPlayer: Player = {
        id: generateId(),
        name: aiDifficulty === 'easy' ? '🤖 IA Facile' : aiDifficulty === 'normal' ? '🤖 IA Normal' : '🤖 IA Difficile',
        color: '#FF5722',
        colorName: 'Rouge IA',
        position: 2,
        isAI: true,
        aiDifficulty: aiDifficulty,
      };
      finalPlayers = [...players, aiPlayer];
    }

    const finalConfig = {
      players: finalPlayers,
      gameConfig,
      timestamp: Date.now(),
    };

    return finalConfig;
  }, [players, gameConfig, playerCount, aiDifficulty]);

  // Sélection de la difficulté avec navigation automatique
  const selectAiDifficulty = useCallback((difficulty: 'easy' | 'normal' | 'hard') => {
    setAiDifficulty(difficulty);
    // Passer automatiquement à la phase suivante (saisie des noms)
    setPhase(3);
  }, []);

  // Sélection de la personnalité IA avec navigation automatique
  const selectAiPersonality = useCallback((personality: AIPersonality) => {
    setAiPersonality(personality);
    // Map personality to old difficulty for backward compatibility
    const difficultyMap: Record<AIPersonality, 'easy' | 'normal' | 'hard'> = {
      aggressive: 'hard',
      prudent: 'easy',
      unpredictable: 'normal',
      perfect: 'hard',
    };
    setAiDifficulty(difficultyMap[personality]);
    // Passer automatiquement à la phase suivante (saisie des noms)
    setPhase(3);
  }, []);

  // Fonction pour obtenir tous les joueurs incluant l'IA (pour l'affichage)
  const getAllPlayers = useCallback(() => {
    if (playerCount === 1) {
      const aiPlayer: Player = {
        id: 'ai_player',
        name: getAIDisplayName(aiPersonality),
        color: '#FF5722',
        colorName: 'Rouge IA',
        position: 2,
        isAI: true,
        aiDifficulty: aiDifficulty,
        aiPersonality: aiPersonality,
      };
      return [...players, aiPlayer];
    }
    return players;
  }, [players, playerCount, aiDifficulty, aiPersonality]);

  return {
    phase,
    playerCount,
    players,
    gameConfig,
    aiDifficulty,
    aiPersonality,
    selectPlayerCount,
    setAiDifficulty,
    selectAiDifficulty,
    selectAiPersonality,
    updatePlayerName,
    updatePlayerColor,
    deletePlayer,
    addPlayer,
    reorderPlayers,
    canProceed,
    nextPhase,
    prevPhase,
    goToPhase,
    getAllPlayers,
    updateGameConfig,
    launchGame,
  };
};
