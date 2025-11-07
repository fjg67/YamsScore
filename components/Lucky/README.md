# 🎲 Lucky - Mascotte 3D Ultra Premium

Lucky est la mascotte interactive 3D de l'application Yams Score. Un dé anthropomorphe adorable qui guide, célèbre et réagit à chaque moment du jeu.

## 📋 Table des matières

- [Fonctionnalités](#fonctionnalités)
- [Installation](#installation)
- [Utilisation de base](#utilisation-de-base)
- [Expressions](#expressions)
- [Animations](#animations)
- [Interactions](#interactions)
- [Intégration avec le jeu](#intégration-avec-le-jeu)
- [API](#api)

## ✨ Fonctionnalités

- **25+ expressions émotionnelles** : De neutre à épique victoire
- **20+ animations fluides** : Idle, entrées, célébrations, réactions
- **Rendu 3D temps réel** : Three.js avec shaders PBR
- **Interactions gestuelles** : Tap, long press, double tap, swipe
- **Réactions contextuelles** : S'adapte aux événements du jeu
- **Particules et effets** : Confetti, sparkles, auras, etc.
- **Performance optimisée** : Animations natives 60 FPS

## 🚀 Installation

Les dépendances sont déjà installées :
```json
{
  "three": "^0.180.0",
  "expo-three": "^8.0.0",
  "expo-gl": "^16.0.7",
  "@types/three": "^0.180.0"
}
```

## 📦 Utilisation de base

### Import

```tsx
import { LuckyMascot } from '@/components/Lucky';
```

### Exemple simple

```tsx
<LuckyMascot
  size={120}
  initialExpression="happy"
  initialAnimation="enter_pop"
  context={{ screen: 'home' }}
  position={{ x: 0, y: 0, placement: 'center' }}
/>
```

### Avec interactions

```tsx
<LuckyMascot
  size={140}
  initialExpression="neutral"
  context={{ screen: 'game' }}
  interactions={{
    onTap: () => console.log('Lucky tapped!'),
    onDoubleTap: () => console.log('Secret dance!'),
    onLongPress: () => showLuckyMenu(),
  }}
/>
```

## 😊 Expressions

Lucky dispose de 25+ expressions pour toutes les situations :

### Émotions basiques
- `neutral` - État par défaut
- `happy` - Content
- `very_happy` - Très content (yeux fermés)
- `excited` - Excité (yeux brillants)
- `sad` - Triste
- `disappointed` - Déçu
- `thinking` - Pensif
- `encouraging` - Encourageant

### Émotions avancées
- `surprised` - Surpris
- `proud` - Fier (avec couronne)
- `mischievous` - Espiègle (clin d'œil)
- `tired` - Fatigué
- `focused` - Concentré
- `epic_victory` - Victoire épique (confetti + aura)
- `defeated` - Défaite (tombé sur le côté)
- `love` - Amoureux (cœurs)
- `panic` - Paniqué
- `determined` - Déterminé (flammes)

### Contextuelles
- `tutorial` - Mode tutoriel (pointer)
- `waiting` - Attente (horloge)
- `celebration` - Célébration (chapeau de fête)
- `combo` - Combo (flammes oranges)
- `record` - Record battu (trophée)
- `sleeping` - Endormi (zzz)
- `error` - Erreur (confus)

### Utilisation

```tsx
import { LuckyExpressions } from '@/components/Lucky';

// Obtenir une expression
const expression = LuckyExpressions.getExpression('happy');

// Expression selon le score
const expr = LuckyExpressions.getExpressionForScore(50); // 'epic_victory'

// Expression aléatoire
const randomHappy = LuckyExpressions.getRandomExpression('happy');
```

## 🎬 Animations

### Idle (Repos)
- `idle` - Animation par défaut (respiration)
- `idle_look_around` - Regarde autour
- `idle_stretch` - S'étire
- `idle_bounce` - Petit rebond
- `idle_spin` - Rotation 360°

### Entrée
- `enter_pop` - Pop from below (par défaut)
- `enter_slide` - Glisse depuis le côté
- `enter_beam` - Téléportation
- `enter_roll` - Roule comme un dé
- `enter_fade` - Apparition progressive

### Réactions
- `celebrate_low` - Petit hochement
- `celebrate_medium` - Double saut
- `celebrate_high` - Saut + rotation
- `celebrate_epic` - Mega célébration (3s)
- `sad_droop` - S'affaisse
- `nod` - Hochement de tête
- `jump` - Saut simple
- `spin_jump` - Saut + rotation

### Tutoriel
- `point` - Pointe (loop)
- `wave` - Fait signe
- `bounce_attention` - Rebond pour attirer l'attention

### Micro-animations
- `blink` - Clignement
- `tilt_head` - Penche la tête
- `puff_chest` - Torse bombé
- `bounce_quick` - Petit rebond rapide

### Utilisation

```tsx
import { LuckyAnimations } from '@/components/Lucky';

// Obtenir une animation
const anim = LuckyAnimations.getAnimation('celebrate_epic');

// Animation selon le score
const animation = LuckyAnimations.getAnimationForScore(50); // 'celebrate_epic'

// Variation idle aléatoire
const idleVar = LuckyAnimations.getRandomIdleVariation();
```

## 🤝 Interactions

Lucky réagit aux gestes de l'utilisateur :

```tsx
<LuckyMascot
  interactions={{
    // Tap simple
    onTap: () => {
      console.log('Lucky fait un petit rebond');
      showQuickActions();
    },

    // Long press
    onLongPress: () => {
      console.log('Lucky se gonfle fièrement');
      showLuckyMenu();
    },

    // Double tap (Easter egg)
    onDoubleTap: () => {
      console.log('Lucky fait sa danse secrète !');
      unlockAchievement('secret_dance');
    },

    // Swipes
    onSwipeLeft: () => console.log('Lucky teleport left→right'),
    onSwipeRight: () => console.log('Lucky teleport right→left'),
    onSwipeUp: () => console.log('Lucky s\'envole'),
    onSwipeDown: () => console.log('Lucky se minimise'),
  }}
/>
```

## 🎮 Intégration avec le jeu

Lucky réagit automatiquement aux événements du jeu via le `context` :

```tsx
const [gameState, setGameState] = useState({
  currentScore: 0,
  lastAction: undefined,
  scoreValue: undefined,
});

<LuckyMascot
  context={{
    screen: 'game',
    gameState,
  }}
/>

// Déclencher une réaction
setGameState({
  currentScore: 150,
  lastAction: 'score',
  scoreValue: 50, // Yams !
});
// Lucky va automatiquement jouer 'epic_victory' et 'celebrate_epic'
```

### Réactions automatiques

- **Score 0** : `sad` + `sad_droop`
- **Score < 15** : `neutral` + `nod`
- **Score 15-24** : `happy` + `celebrate_medium`
- **Score 25-39** : `very_happy` + `celebrate_high`
- **Score ≥ 50** : `epic_victory` + `celebrate_epic` (YAMS!)

### Utilisation avec Ref

```tsx
const luckyRef = useRef<LuckyMascotRef>(null);

// Contrôle manuel
const celebrateScore = (score: number) => {
  luckyRef.current?.celebrate(score);
};

const changeMood = () => {
  luckyRef.current?.changeExpression('happy');
  luckyRef.current?.playAnimation('jump');
};
```

## 📚 API

### Props `LuckyMascot`

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `size` | `number` | `120` | Taille en pixels |
| `initialExpression` | `LuckyExpression` | `'neutral'` | Expression de départ |
| `initialAnimation` | `LuckyAnimation` | `'idle'` | Animation de départ |
| `context` | `LuckyContext` | required | Contexte écran et jeu |
| `position` | `LuckyPosition` | `{x:0, y:0}` | Position initiale |
| `interactions` | `LuckyInteraction` | - | Callbacks gestuels |
| `onExpressionChange` | `(expr) => void` | - | Callback changement expression |
| `onAnimationComplete` | `(anim) => void` | - | Callback fin animation |

### Types

```tsx
type LuckyContext = {
  screen: 'home' | 'playerSetup' | 'game' | 'results' | 'history';
  gameState?: {
    currentScore: number;
    lastAction?: 'roll' | 'score' | 'combo' | 'yams';
    scoreValue?: number;
    isAITurn?: boolean;
  };
};

type LuckyPosition = {
  x: number;
  y: number;
  placement?: 'center' | 'top-right' | 'top-left' | 'floating';
};

type LuckyInteraction = {
  onTap?: () => void;
  onLongPress?: () => void;
  onDoubleTap?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
};
```

### Méthodes Ref

```tsx
interface LuckyMascotRef {
  playAnimation: (animation: LuckyAnimation) => void;
  changeExpression: (expression: LuckyExpression) => void;
  celebrate: (scoreValue: number) => void;
}
```

## 🎨 Personnalisation

### Couleurs des expressions

Chaque expression peut avoir ses propres couleurs :

```tsx
{
  color: {
    body: '#F5F5DC',        // Ivoire
    dots: '#2C3E50',         // Bleu nuit
    emissive: '#FFD700',     // Or (glow)
  }
}
```

### Effets de particules

```tsx
{
  effects: {
    particles: [
      { type: 'confetti', count: 100, color: ['#FF6B6B', '#4ECDC4'] },
      { type: 'sparkle', count: 50, orbit: true },
    ],
    aura: {
      color: '#FFD700',
      intensity: 0.8,
      pulse: true,
      type: 'rainbow',
    },
    screenFlash: {
      color: '#FFD700',
      opacity: 0.3,
    },
  }
}
```

## 🔧 Détails techniques

### Architecture

```
components/Lucky/
├── index.ts                    # Point d'entrée
├── LuckyTypes.ts               # Types TypeScript
├── LuckyExpressions.ts         # Bibliothèque d'expressions
├── LuckyAnimations.ts          # Système d'animations
├── Lucky3DModel.tsx            # Modèle 3D Three.js
├── LuckyMascot.tsx             # Composant React Native principal
└── README.md                   # Documentation
```

### Performance

- **Rendu 3D** : 60 FPS via expo-three
- **Animations** : Native driver React Native
- **Mémoire** : ~15MB (modèle 3D + textures)
- **Batterie** : Optimisé pour mobile

### Shaders PBR

Lucky utilise le Physically Based Rendering pour un rendu réaliste :
- **Metalness** : 0.1
- **Roughness** : 0.3
- **Subsurface scattering** : Légère translucidité
- **Rim light** : Edge glow doré
- **Emissive** : Selon expression

## 🎯 Exemples d'utilisation

### Écran d'accueil

```tsx
<LuckyMascot
  size={140}
  initialExpression="happy"
  initialAnimation="enter_pop"
  context={{ screen: 'home' }}
  position={{ x: 0, y: 0, placement: 'center' }}
/>
```

### Pendant le jeu

```tsx
<LuckyMascot
  size={80}
  initialExpression="neutral"
  context={{
    screen: 'game',
    gameState: {
      currentScore: playerScore,
      lastAction: 'score',
      scoreValue: lastScoreValue,
    },
  }}
  position={{ x: 20, y: 20, placement: 'floating' }}
/>
```

### Tutoriel

```tsx
<LuckyMascot
  size={100}
  initialExpression="tutorial"
  initialAnimation="point"
  context={{ screen: 'playerSetup' }}
  position={{ x: targetX, y: targetY }}
/>
```

## 🤝 Contribution

Lucky est conçu pour être extensible :
- Ajouter de nouvelles expressions dans `LuckyExpressions.ts`
- Créer de nouvelles animations dans `LuckyAnimations.ts`
- Personnaliser le modèle 3D dans `Lucky3DModel.tsx`

## 📄 License

© 2025 Yams Score - Tous droits réservés

---

**Fait avec ❤️ et Three.js**
