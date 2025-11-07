# 🎲 Animations Thème Yams - Lucky

## Animations Ajoutées/Modifiées

### 1. **enter_pop** (Modifiée)
- **Durée**: 1200ms (au lieu de 800ms)
- **Effet**: Lucky apparaît comme un dé qui rebondit sur la table
- **Rotations**: Rotations 3D complètes (X, Y, Z) simulant un dé qui roule
- **Keyframes**: 4 étapes avec rebonds réalistes
- **Son**: `dice-roll.mp3`
- **Usage**: Écran d'accueil, apparition initiale

### 2. **enter_roll** (Améliorée)
- **Durée**: 1500ms
- **Effet**: Dé qui roule depuis la gauche de l'écran
- **Keyframes**: 4 étapes montrant le dé en mouvement avec rebonds
- **Rotations**: 6 tours complets (Math.PI * 6)
- **Son**: `dice-roll.mp3`
- **Usage**: Transitions entre écrans

### 3. **idle_spin** (Améliorée)
- **Durée**: 2500ms
- **Effet**: Rotation 3D complète du dé sur tous les axes
- **Keyframes**: 5 étapes montrant toutes les faces du dé
- **Rotations**: Rotation complète sur X, Y et Z
- **Usage**: Animation d'inactivité variée

### 4. **celebrate_epic** (Renforcée)
- **Durée**: 3500ms (au lieu de 3000ms)
- **Effet**: Célébration explosive pour Yams (50 points)
- **Keyframes**: 7 étapes avec sauts et rotations multiples
- **Rotations**: 6 tours complets (Math.PI * 6)
- **Échelle**: Jusqu'à 1.6x la taille normale
- **Son**: `yams-celebration.mp3`
- **Usage**: Quand le joueur fait un Yams

### 5. **mega_celebration** (Améliorée)
- **Durée**: 4000ms
- **Effet**: Shake violent puis explosion de joie
- **Keyframes**: 8 étapes
  - 0-0.3: Shake rapide (vibration du dé)
  - 0.4-1.0: Explosion vers le haut avec rotations folles
- **Rotations**: 8 tours complets (Math.PI * 8)
- **Échelle**: Jusqu'à 1.8x
- **Son**: `mega-yams.mp3`
- **Usage**: Victoire, bonus obtenu, record battu

### 6. **spin_jump** (Améliorée)
- **Durée**: 1800ms
- **Effet**: Saut avec rotation 3D du dé
- **Keyframes**: 4 étapes
- **Rotations**: 3 tours complets sur tous les axes
- **Son**: `dice-tumble.mp3`
- **Usage**: Bon score (25-40 points)

## 🆕 Nouvelles Animations Yams

### 7. **dice_shake** ⭐ NOUVELLE
- **Durée**: 1200ms
- **Effet**: Simulation de dés secoués dans la main
- **Keyframes**: 11 étapes avec mouvements erratiques
- **Mouvements**: Petites translations et rotations aléatoires
- **Son**: `dice-shake.mp3`
- **Feedback haptique**: Medium
- **Usage**:
  - Avant un lancer important
  - Quand le joueur hésite
  - Animation d'attente du tour

### 8. **dice_roll_table** ⭐ NOUVELLE
- **Durée**: 2000ms
- **Effet**: Dé lancé qui roule sur la table
- **Keyframes**: 6 étapes
- **Trajectoire**: Part de la gauche, roule vers le centre
- **Rotations**: 2 tours complets avec décélération
- **Échelle**: Commence à 0.8x, finit à 1.0x
- **Son**: `dice-roll.mp3`
- **Feedback haptique**: Heavy
- **Usage**:
  - Animation de score entré
  - Transition vers le joueur suivant
  - Révélation d'un résultat

## 🎯 Recommandations d'Usage

### Par Score
- **0 points (barré)**: `sad_droop`
- **1-14 points**: `nod`
- **15-24 points**: `celebrate_medium`
- **25-39 points**: `celebrate_high` ou `spin_jump`
- **40-49 points**: `celebrate_high`
- **50 points (Yams)**: `celebrate_epic`
- **Bonus obtenu**: `mega_celebration`

### Par Contexte
- **Entrée en jeu**: `enter_pop` ou `enter_roll`
- **Attente du tour**: `dice_shake` (en boucle subtile)
- **Score validé**: `dice_roll_table`
- **Tour de l'IA**: `idle_look_around` + `dice_shake`
- **Inactivité**: `idle_bounce` ou `idle_spin`

## 🔊 Sons Requis

Créer/ajouter ces fichiers audio :
- `dice-roll.mp3` - Son de dés qui roulent
- `dice-shake.mp3` - Son de dés secoués
- `dice-tumble.mp3` - Son de dé qui tombe
- `yams-celebration.mp3` - Son épique pour Yams
- `mega-yams.mp3` - Son ultra-épique pour mega célébration

## 📝 Notes Techniques

### Rotations
Toutes les rotations utilisent maintenant les 3 axes (X, Y, Z) pour un effet 3D plus réaliste :
```typescript
rotation: { x: Math.PI, y: Math.PI, z: Math.PI }
```

### Particules
Les nouvelles animations supportent les types de particules :
- `'dice'` - Mini dés animés
- `'dots'` - Points de dés qui s'envolent

### Easing
Les animations utilisent principalement :
- `'easeOut'` - Pour les lancers de dés (décélération naturelle)
- `'easeOutBounce'` - Pour les rebonds
- `'linear'` - Pour les shakes (mouvement mécanique)

## 🎨 Prochaines Améliorations

1. Ajouter une animation `dice_stack` (plusieurs dés qui s'empilent)
2. Créer `dice_explode` (dé qui explose en confettis)
3. Animation `lucky_number` (face du dé qui change rapidement puis s'arrête)
4. Trail effect (traînée lumineuse) pendant les rotations rapides
