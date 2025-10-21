/**
 * Hook de gestion des joueurs
 * Gère l'état et la logique des joueurs avec emojis et couleurs
 */

import { useState, useMemo } from 'react';
import { getPlayerColor } from '../utils/playerColors';
import { getDefaultEmoji } from '../utils/emojiAvatars';
import { PlayerColorConfig } from '../utils/playerColors';

export interface PlayerSetup {
  id: string;
  name: string;
  emoji: string;
  color: PlayerColorConfig;
}

export const usePlayerManagement = (initialPlayerCount: number = 2) => {
  const [players, setPlayers] = useState<PlayerSetup[]>(() => {
    return Array.from({ length: initialPlayerCount }, (_, index) => ({
      id: `player_${Date.now()}_${index}`,
      name: '',
      emoji: getDefaultEmoji(index),
      color: getPlayerColor(index),
    }));
  });

  /**
   * Ajouter un nouveau joueur
   */
  const addPlayer = () => {
    if (players.length < 6) {
      const newIndex = players.length;
      const newPlayer: PlayerSetup = {
        id: `player_${Date.now()}_${newIndex}`,
        name: '',
        emoji: getDefaultEmoji(newIndex),
        color: getPlayerColor(newIndex),
      };
      setPlayers([...players, newPlayer]);
      return newPlayer.id; // Retourne l'ID pour auto-focus
    }
    return null;
  };

  /**
   * Supprimer un joueur
   */
  const removePlayer = (id: string) => {
    if (players.length > 2) {
      setPlayers(players.filter((p) => p.id !== id));
    }
  };

  /**
   * Mettre à jour le nom d'un joueur
   */
  const updatePlayerName = (id: string, name: string) => {
    setPlayers(
      players.map((p) => (p.id === id ? { ...p, name } : p))
    );
  };

  /**
   * Mettre à jour l'emoji d'un joueur
   */
  const updatePlayerEmoji = (id: string, emoji: string) => {
    setPlayers(
      players.map((p) => (p.id === id ? { ...p, emoji } : p))
    );
  };

  /**
   * Mettre à jour la couleur d'un joueur
   */
  const updatePlayerColor = (id: string, color: PlayerColorConfig) => {
    setPlayers(
      players.map((p) => (p.id === id ? { ...p, color } : p))
    );
  };

  /**
   * Validation : vérifier les noms dupliqués
   */
  const duplicateNames = useMemo(() => {
    const nameCount = new Map<string, number>();
    const duplicates = new Set<string>();

    players.forEach((player) => {
      const trimmedName = player.name.trim().toLowerCase();
      if (trimmedName) {
        const count = (nameCount.get(trimmedName) || 0) + 1;
        nameCount.set(trimmedName, count);
        if (count > 1) {
          duplicates.add(trimmedName);
        }
      }
    });

    return duplicates;
  }, [players]);

  /**
   * Vérifier si un joueur a un nom dupliqué
   */
  const isDuplicate = (id: string): boolean => {
    const player = players.find((p) => p.id === id);
    if (!player || !player.name.trim()) return false;
    return duplicateNames.has(player.name.trim().toLowerCase());
  };

  /**
   * Validation complète
   */
  const validation = useMemo(() => {
    const errors: string[] = [];

    // Vérifier qu'il y a au moins 2 joueurs
    if (players.length < 2) {
      errors.push('Il faut au moins 2 joueurs');
    }

    // Vérifier que tous les joueurs ont un nom
    const emptyNames = players.filter((p) => !p.name.trim());
    if (emptyNames.length > 0) {
      errors.push('Tous les joueurs doivent avoir un nom');
    }

    // Vérifier les noms dupliqués
    if (duplicateNames.size > 0) {
      errors.push('Certains noms sont en double');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }, [players, duplicateNames]);

  return {
    players,
    addPlayer,
    removePlayer,
    updatePlayerName,
    updatePlayerEmoji,
    updatePlayerColor,
    isDuplicate,
    validation,
    canAddMore: players.length < 6,
    canRemove: players.length > 2,
  };
};
