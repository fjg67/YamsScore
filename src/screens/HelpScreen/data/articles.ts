/**
 * Articles d'aide - Base de connaissances
 */

export interface Article {
  id: string;
  categoryId: string;
  title: string;
  subtitle?: string;
  content: string;
  icon: string;
  views: string;
  readTime: string;
  helpfulRate?: string;
  popular?: boolean;
  tags: string[];
  relatedArticles?: string[];
}

export interface Category {
  id: string;
  title: string;
  icon: string;
  count: number;
  gradient: string[];
  popular?: boolean;
  badge?: string;
}

export const categories: Category[] = [
  {
    id: 'getting-started',
    title: 'Démarrage',
    icon: '🚀',
    count: 8,
    gradient: ['#4A90E2', '#5DADE2'],
  },
  {
    id: 'rules',
    title: 'Règles du Jeu',
    icon: '📖',
    count: 13,
    gradient: ['#50C878', '#3FA065'],
    popular: true,
    badge: 'Populaire',
  },
  {
    id: 'features',
    title: 'Fonctionnalités',
    icon: '✨',
    count: 12,
    gradient: ['#9B59B6', '#8E44AD'],
  },
  {
    id: 'troubleshooting',
    title: 'Résolution',
    icon: '🔧',
    count: 10,
    gradient: ['#F39C12', '#E67E22'],
  },
  {
    id: 'tips-strategies',
    title: 'Astuces',
    icon: '💡',
    count: 15,
    gradient: ['#E91E63', '#C2185B'],
    badge: 'Premium',
  },
  {
    id: 'account',
    title: 'Mon Compte',
    icon: '👤',
    count: 6,
    gradient: ['#00BCD4', '#0097A7'],
  },
];

export const articles: Article[] = [
  // Getting Started
  {
    id: 'first-game',
    categoryId: 'getting-started',
    title: 'Créer ta première partie',
    subtitle: 'Guide de démarrage rapide',
    icon: '🎲',
    views: '3.2K vues',
    readTime: '3 min',
    helpfulRate: '99%',
    popular: true,
    tags: ['Débutant', 'Essentiel'],
    content: `# Créer ta première partie

Bienvenue dans Yams Score ! Voici comment démarrer ta première partie en quelques étapes simples.

## Étape 1 : Ajouter des joueurs

1. Sur l'écran d'accueil, tape sur **"Nouvelle Partie"** 🎲
2. Entre le nom du premier joueur
3. Choisis un avatar (optionnel mais fun !)
4. Tape sur **"+"** pour ajouter d'autres joueurs
5. Il te faut minimum **2 joueurs** pour commencer

💡 **Astuce** : Tu peux ajouter jusqu'à 6 joueurs !

## Étape 2 : Lancer la partie

Une fois tous les joueurs ajoutés :
- Tape sur **"Commencer la partie"**
- La feuille de score s'affiche automatiquement
- Le premier joueur peut commencer !

## Étape 3 : Remplir les scores

1. Lance tes dés (dans la vraie vie 🎲)
2. Tape sur la case correspondante
3. Entre ton score
4. Valide avec ✓

Le joueur suivant est automatiquement sélectionné !

## Astuces pour bien démarrer

- ⭐ **Le bonus** : Essaye d'atteindre 63 points dans la section supérieure
- 🎯 **La stratégie** : Ne barre pas trop vite tes meilleures cases
- 📊 **Les stats** : Consulte tes statistiques pour t'améliorer

C'est tout ! Tu es prêt à jouer ! 🎉
`,
    relatedArticles: ['score-sheet', 'bonus-explained'],
  },
  {
    id: 'score-sheet',
    categoryId: 'getting-started',
    title: 'Comprendre la feuille de score',
    subtitle: 'Tout sur l\'interface',
    icon: '📋',
    views: '2.8K vues',
    readTime: '4 min',
    tags: ['Débutant', 'Interface'],
    content: `# Comprendre la feuille de score

La feuille de score est le cœur de l'application. Voici comment elle fonctionne.

## Section Supérieure (1 à 6)

Ces cases comptent pour le **bonus de 35 points** :
- 1️⃣ **As** : Somme des 1
- 2️⃣ **Deux** : Somme des 2
- 3️⃣ **Trois** : Somme des 3
- 4️⃣ **Quatre** : Somme des 4
- 5️⃣ **Cinq** : Somme des 5
- 6️⃣ **Six** : Somme des 6

💡 **Objectif** : Atteindre 63 points pour le bonus !

## Section Inférieure (Combinaisons)

- 🎯 **Brelan** : 3 dés identiques (somme)
- 🎯 **Carré** : 4 dés identiques (somme)
- 🏠 **Full** : Brelan + Paire (25 points)
- 📈 **Petite Suite** : 4 dés consécutifs (30 points)
- 📈 **Grande Suite** : 5 dés consécutifs (40 points)
- 🎲 **Yams** : 5 dés identiques (50 points)
- 🎲 **Chance** : N'importe quoi (somme)

## Indicateurs visuels

L'app t'aide avec des couleurs :
- 🟢 **Vert** : Bon score pour cette case
- 🟡 **Jaune** : Score moyen
- 🔴 **Rouge** : Score faible
- ⭐ **Or** : Excellente combinaison !

## Navigation

- 👆 **Tape** sur une case pour entrer un score
- ❌ **Barre** une case si tu ne peux rien marquer
- 📊 **Swipe** vers le bas pour voir les statistiques
`,
    relatedArticles: ['first-game', 'bonus-explained'],
  },
  {
    id: 'add-players',
    categoryId: 'getting-started',
    title: 'Ajouter des joueurs',
    icon: '👥',
    views: '2.1K vues',
    readTime: '2 min',
    tags: ['Débutant'],
    content: `# Ajouter des joueurs

## Pendant la configuration

1. Entre le nom du joueur
2. Choisis un avatar parmi 20+ options
3. Tape sur **"Ajouter"**
4. Répète pour chaque joueur

## Nombre de joueurs

- **Minimum** : 2 joueurs
- **Maximum** : 6 joueurs
- **Recommandé** : 2-4 joueurs pour une partie fluide

## Modifier les joueurs

Tu peux :
- ✏️ Modifier le nom
- 🎨 Changer l'avatar
- 🗑️ Supprimer un joueur (avant de démarrer)

## Avatars personnalisés

Choisis parmi :
- 😀 Emojis classiques
- 🎭 Personnages
- 🎨 Couleurs personnalisées
- 🖼️ Photo (bientôt disponible)
`,
    relatedArticles: ['first-game'],
  },

  // Rules
  {
    id: 'yams-rules',
    categoryId: 'rules',
    title: 'Règles complètes du Yams',
    subtitle: 'Tout comprendre en 5 minutes',
    icon: '📖',
    views: '5.4K vues',
    readTime: '8 min',
    helpfulRate: '98%',
    popular: true,
    tags: ['Débutant', 'Règles'],
    content: `# Règles complètes du Yams

Le Yams (aussi appelé Yahtzee) est un jeu de dés passionnant mêlant chance et stratégie.

## Matériel

- 🎲 **5 dés à 6 faces**
- 📋 **Une feuille de score**
- 👥 **2 à 6 joueurs**

## But du jeu

Marquer le **maximum de points** en réalisant différentes combinaisons de dés.

## Déroulement d'un tour

Chaque joueur, à son tour :

1. **Premier lancer** : Lance les 5 dés
2. **Relances** : Peut relancer tout ou partie des dés (jusqu'à 2 fois)
3. **Choix** : Choisit où inscrire son score

💡 Tu as donc **3 lancers maximum** par tour.

## Les combinaisons

### Section Supérieure (1 à 6)

Marque la **somme** des dés correspondants :
- **As** : Somme des 1
- **Deux** : Somme des 2
- etc.

**Exemple** : Tu as 🎲 1-1-1-4-6
- Si tu choisis "As" → 3 points
- Si tu choisis "Quatre" → 4 points

### Section Inférieure

- **Brelan** : 3 dés identiques → Somme de tous les dés
- **Carré** : 4 dés identiques → Somme de tous les dés
- **Full** : Brelan + Paire → **25 points**
- **Petite Suite** : 4 dés consécutifs → **30 points**
- **Grande Suite** : 5 dés consécutifs → **40 points**
- **Yams** : 5 dés identiques → **50 points**
- **Chance** : N'importe quoi → Somme de tous les dés

## Le Bonus

Si tu totalises **63 points ou plus** dans la section supérieure, tu gagnes **35 points de bonus** !

💡 **Astuce** : 63 = moyenne de 3 par case (3×21)

## Barrer une case

Si tu ne peux rien marquer, tu dois **barrer une case** (elle vaudra 0 point).

⚠️ **Attention** : Une case barrée = 0 point, choisis bien !

## Fin de partie

La partie se termine quand **toutes les cases** sont remplies.

Le joueur avec le **score total le plus élevé** gagne ! 🏆

## Variantes

L'app supporte plusieurs variantes :
- Yams classique
- Yams avec Joker
- Yams Sec (bientôt)
`,
    relatedArticles: ['bonus-explained', 'strategies'],
  },
  {
    id: 'bonus-explained',
    categoryId: 'rules',
    title: 'Comment obtenir le bonus',
    subtitle: 'Stratégie pour les 35 points',
    icon: '⭐',
    views: '4.2K vues',
    readTime: '3 min',
    helpfulRate: '96%',
    popular: true,
    tags: ['Stratégie', 'Bonus'],
    content: `# Comment obtenir le bonus

Le bonus de **35 points** peut faire toute la différence !

## La règle

Totalise **63 points ou plus** dans la section supérieure (As à Six) pour obtenir le bonus.

## Pourquoi 63 ?

C'est la moyenne de **3 par case** :
- As : 3 × 1 = 3
- Deux : 3 × 2 = 6
- Trois : 3 × 3 = 9
- Quatre : 3 × 4 = 12
- Cinq : 3 × 5 = 15
- Six : 3 × 6 = 18

**Total** : 3+6+9+12+15+18 = **63 points**

## Stratégie pour le bonus

### 1️⃣ Priorise les hautes valeurs

Les Six et Cinq rapportent plus :
- **Six** : Vise 4-5 dés (24-30 points)
- **Cinq** : Vise 4 dés minimum (20-25 points)

### 2️⃣ Ne barre jamais Six/Cinq trop tôt

Si possible, garde ces cases pour de bons coups.

### 3️⃣ Calcule ton avance/retard

L'app affiche un **indicateur** :
- 🟢 **+12** : Tu es en avance de 12 points
- 🔴 **-8** : Tu es en retard de 8 points

### 4️⃣ Adapte ta stratégie

**En avance** : Tu peux barrer une petite case
**En retard** : Cherche les gros scores !

## Exemples

**Bon coup** 🎲 5-5-5-5-2
→ Marque 20 dans "Cinq" (4×5)

**Mauvais coup** 🎲 1-1-2-3-4
→ Utilise "As" ou "Deux" (mais pas génial)

## L'indicateur de l'app

L'app t'aide avec :
- 📊 **Progression** : X/63 points
- 🎯 **Cases restantes** : Moyenne nécessaire
- 💡 **Suggestions** : Meilleure case à viser

Ne lâche jamais le bonus ! 💪
`,
    relatedArticles: ['yams-rules', 'strategies'],
  },

  // Features
  {
    id: 'share-scores',
    categoryId: 'features',
    title: 'Partager tes scores',
    subtitle: 'Guide de partage',
    icon: '📤',
    views: '1.8K vues',
    readTime: '2 min',
    tags: ['Tutoriel', 'Social'],
    content: `# Partager tes scores

Montre tes exploits à tes amis ! 🏆

## Partager une partie terminée

1. Va dans **"Historique"** 📜
2. Tape sur la partie à partager
3. Tape sur l'icône **Partager** 📤
4. Choisis ton canal (SMS, WhatsApp, Instagram...)

## Ce qui est partagé

Une belle image avec :
- 🏆 Le classement final
- 📊 Les scores de chaque joueur
- 🎯 Les meilleures combinaisons
- 📅 La date de la partie

## Options de partage

- 📱 **Réseaux sociaux** : Instagram, Facebook, Twitter
- 💬 **Messageries** : WhatsApp, Messenger, SMS
- 📧 **Email** : Envoyer par mail
- 💾 **Sauvegarder** : Dans tes photos

## Personnaliser l'image

Tu peux choisir :
- 🎨 **Style** : Clair ou sombre
- 🎭 **Affichage** : Avec ou sans avatars
- 📏 **Format** : Carré ou rectangle

💡 **Astuce** : Les images sont optimisées pour Instagram Stories !
`,
    relatedArticles: ['history'],
  },

  // Troubleshooting
  {
    id: 'app-crash',
    categoryId: 'troubleshooting',
    title: 'L\'app crash ou plante',
    icon: '⚠️',
    views: '890 vues',
    readTime: '3 min',
    tags: ['Bug', 'Technique'],
    content: `# L'app crash ou plante

Solutions aux problèmes de crash.

## Solution 1 : Redémarrer l'app

1. Ferme complètement l'app (double-tap home)
2. Swipe l'app vers le haut
3. Relance l'app

## Solution 2 : Vider le cache

1. Va dans **Paramètres** ⚙️
2. Tape sur **"Vider le cache"**
3. Confirme
4. Redémarre l'app

⚠️ Tes parties et statistiques sont **conservées** !

## Solution 3 : Mettre à jour

Vérifie que tu as la dernière version :
- iOS : App Store
- Android : Play Store

## Solution 4 : Réinstaller

En dernier recours :
1. Sauvegarde tes données (Paramètres → Exporter)
2. Désinstalle l'app
3. Réinstalle depuis le store
4. Importe tes données

## Signaler le bug

Si le problème persiste :
1. Tape sur 🐛 **"Signaler un bug"**
2. Décris le problème
3. Ajoute un screenshot si possible

Notre équipe réagit en **< 24h** ! 🚀
`,
  },

  // Tips & Strategies
  {
    id: 'strategies',
    categoryId: 'tips-strategies',
    title: 'Stratégies gagnantes',
    subtitle: 'Conseils de pro',
    icon: '🏆',
    views: '3.9K vues',
    readTime: '6 min',
    popular: true,
    tags: ['Stratégie', 'Avancé'],
    content: `# Stratégies gagnantes

Deviens un pro du Yams ! 🏆

## Stratégie 1 : La pyramide inversée

**Principe** : Commence par le haut, termine par le bas.

1. **Tours 1-6** : Remplis la section supérieure
2. **Tours 7-13** : Remplis la section inférieure

**Avantages** :
- ✅ Tu sais si le bonus est atteignable
- ✅ Moins de stress en fin de partie
- ✅ Tu peux optimiser les combinaisons

## Stratégie 2 : Garde la Chance

La case **Chance** est ton joker !

**Quand l'utiliser** :
- ❌ **PAS** : Pour un petit score (< 20)
- ✅ **OUI** : Pour un Yams raté (25-30 points)
- ✅ **OUI** : Pour sauver un tour catastrophique

## Stratégie 3 : Le sacrifice

Parfois, il faut **barrer stratégiquement**.

**Ordre de sacrifice** (du moins au plus important) :
1. As ou Deux (si bonus impossible)
2. Chance (si déjà gros score)
3. Petite Suite
4. Brelan
5. ⚠️ **Jamais** Six ou Grande Suite !

## Stratégie 4 : Le calcul des probas

**Relancer ou garder** ?

Exemples :
- 🎲 **5-5-5-2-3** pour un Carré
  → Relance 2-3 (prob ~11%)

- 🎲 **1-2-3-4-6** pour Grande Suite
  → Relance le 6 (prob ~17%)

💡 L'app peut t'afficher ces probabilités !

## Stratégie 5 : Le timing du Yams

**Ne vise le Yams que** :
- En début de partie (beaucoup de tours)
- Si tu as 4 dés identiques
- Si le Yams est encore disponible

**Sinon** : Marque dans une autre case !

## Erreurs à éviter

❌ Barrer Six/Cinq trop tôt
❌ Garder tous les dés au 1er lancer
❌ Viser le Yams avec 3 dés identiques
❌ Ignorer le bonus

## Pro tips

💎 **Observe** le jeu de tes adversaires
💎 **Adapte** ta stratégie selon ton score
💎 **Privilégie** les coups sûrs en fin de partie
💎 **Prends des risques** en début de partie

Maintenant, à toi de jouer ! 🎯
`,
    relatedArticles: ['bonus-explained', 'yams-rules'],
  },
];

// Fonction de recherche
export const searchArticles = (query: string): Article[] => {
  const lowerQuery = query.toLowerCase();

  return articles.filter(article =>
    article.title.toLowerCase().includes(lowerQuery) ||
    article.subtitle?.toLowerCase().includes(lowerQuery) ||
    article.content.toLowerCase().includes(lowerQuery) ||
    article.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

// Get articles by category
export const getArticlesByCategory = (categoryId: string): Article[] => {
  return articles.filter(article => article.categoryId === categoryId);
};

// Get article by id
export const getArticleById = (id: string): Article | undefined => {
  return articles.find(article => article.id === id);
};

// Get popular articles
export const getPopularArticles = (): Article[] => {
  return articles.filter(article => article.popular).slice(0, 3);
};
