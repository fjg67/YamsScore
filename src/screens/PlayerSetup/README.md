# 🎲 Player Setup Screen - Documentation

## Vue d'ensemble

L'écran de configuration des joueurs est une expérience multi-phases ultra premium qui transforme la phase de setup (souvent rébarbative) en une expérience ludique et excitante.

## Structure

```
PlayerSetup/
├── PlayerSetupScreen.tsx          # Composant principal orchestrant les phases
├── index.tsx                       # Export principal
├── constants.ts                    # Constantes (couleurs, suggestions noms)
├── hooks/
│   └── usePlayerSetup.ts          # Hook de gestion d'état
├── components/
│   ├── Phase1_NumberSelection/     # Sélection nombre de joueurs
│   │   ├── NumberSelector.tsx
│   │   └── PlayerCountCard.tsx
│   ├── Phase2_PlayersList/         # Configuration des joueurs
│   │   ├── PlayersList.tsx
│   │   └── PlayerCard.tsx
│   ├── Phase4_Summary/             # Récapitulatif final
│   │   └── SummaryScreen.tsx
│   └── Modals/
│       └── ColorPickerModal.tsx    # Sélection de couleur
└── README.md
```

## Les 4 Phases

### Phase 1: Sélection du nombre de joueurs (2-6)
- Cartes animées avec emojis de joueurs colorés
- Feedback visuel premium avec animations scale et shadow
- Auto-passage à la phase suivante

### Phase 2: Configuration des joueurs
- Cartes joueurs avec input de nom (2-15 caractères)
- Validation en temps réel
- Sélection de couleur via modal élégante
- Possibilité d'ajouter/supprimer des joueurs
- Indicateur de progression en haut à droite

### Phase 3: Personnalisation (À venir)
- Réorganisation par drag & drop
- Choix du mode de jeu
- Options avancées

### Phase 4: Récapitulatif et lancement
- Affichage de tous les joueurs configurés
- Bouton "LANCER LA PARTIE" ultra premium avec:
  - Gradient animé
  - Pulse continu
  - Shadow dynamique
  - Confettis au lancement (à venir)

## Fonctionnalités implémentées ✅

- ✅ Sélection dynamique du nombre de joueurs (2-6)
- ✅ Configuration des noms avec validation
- ✅ 12 couleurs premium disponibles
- ✅ Modal de sélection de couleur animée
- ✅ Ajout/suppression de joueurs
- ✅ Animations fluides partout
- ✅ Design responsive
- ✅ Support dark mode via LinearGradient
- ✅ Récapitulatif avant lancement

## À implémenter 🚧

- ⏳ Phase 3 complète (drag & drop)
- ⏳ Sauvegarde des configurations
- ⏳ Profils fréquents
- ⏳ Suggestions de noms intelligentes
- ⏳ Confettis à l'animation de lancement
- ⏳ Haptic feedback (iOS)
- ⏳ Sons d'interface

## Utilisation

```tsx
import PlayerSetupScreen from './src/screens/PlayerSetup';

<PlayerSetupScreen
  onGameStart={(players, gameConfig) => {
    // Démarrer la partie avec les joueurs configurés
    console.log('Players:', players);
    console.log('Config:', gameConfig);
  }}
/>
```

## Types

```typescript
interface Player {
  id: string;
  name: string;
  color: string;
  colorName: string;
  position: number;
}

interface GameConfig {
  mode: 'classic' | 'descendant';
  orderType: 'manual' | 'random';
  soundEnabled?: boolean;
}
```

## Animations

Toutes les animations utilisent `useNativeDriver: true` pour des performances optimales :
- Scale & rotation pour les cartes
- Slide pour les transitions
- Pulse pour le bouton de lancement
- Fade pour les apparitions/disparitions

## Couleurs disponibles

12 couleurs soigneusement sélectionnées :
- 🔵 Bleu Océan
- 🟢 Vert Émeraude
- 🔴 Rouge Corail
- 🟡 Jaune Soleil
- 🟠 Orange Mandarine
- 🟣 Violet Améthyste
- 💗 Rose Bonbon
- 🩵 Turquoise
- 💜 Indigo
- 💚 Lime
- 🧡 Ambre
- 🩵 Cyan

## Performance

- Utilisation de `React.memo` pour les composants optimisés
- Animations natives (GPU)
- Pas de re-renders inutiles
- Liste virtualisée prête (si > 6 joueurs)

---

**Créé avec ❤️ pour Yams Score**
