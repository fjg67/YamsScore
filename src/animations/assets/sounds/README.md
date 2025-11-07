# Audio Assets pour Animations

Ce dossier contient tous les effets sonores pour le système d'animations.

## Sons Requis

### Scores Standards (5 fichiers)
- `score-minimal.mp3` - Score faible (0-10 pts) - Son subtil, court
- `score-standard.mp3` - Score moyen (11-20 pts) - Son neutre
- `score-good.mp3` - Bon score (21-30 pts) - Son positif
- `score-excellent.mp3` - Score rare - Son impressionnant
- `score-perfect.mp3` - Score maximum - Son triomphal

### Combinaisons Spéciales (6 fichiers)
- `three-of-kind.mp3` - Brelan - Son de 3 dés
- `four-of-kind.mp3` - Carré - Son métallique puissant
- `full-house.mp3` - Full - Son chaleureux
- `small-straight.mp3` - Petite Suite - Son de séquence
- `large-straight.mp3` - Grande Suite - Son épique montant
- `chance-lucky.mp3` - Chance (lucky) - Son de trèfle

### Bonus & Yams (4 fichiers)
- `bonus-charge.mp3` - Build-up avant bonus (0.5s)
- `bonus-explosion.mp3` - Explosion bonus (1s)
- `yams-suspense.mp3` - Suspense Yams dramatique (1s)
- `yams-explosion.mp3` - Explosion Yams massive (2s)

### Autres (2 fichiers)
- `cross-out.mp3` - Score barré - Son négatif court
- `new-record.mp3` - Nouveau record - Fanfare courte

## Spécifications Techniques

- **Format** : MP3, 44.1kHz, Stereo
- **Bitrate** : 192 kbps
- **Durée** : 0.5s à 2s selon le type
- **Volume** : Normalisé à -14 LUFS
- **Taille max** : 200 KB par fichier

## Sources Recommandées

### Gratuites
- [Freesound.org](https://freesound.org/) - CC0 license
- [Zapsplat.com](https://zapsplat.com/) - Gratuit avec attribution
- [Mixkit.co](https://mixkit.co/free-sound-effects/) - CC0 license

### Payantes (Qualité Premium)
- [AudioJungle](https://audiojungle.net/)
- [Epidemic Sound](https://www.epidemicsound.com/)
- [Artlist](https://artlist.io/)

## Placeholder Temporaires

En attendant les vrais sons, vous pouvez :
1. Utiliser des sons système iOS/Android
2. Créer des placeholders avec des outils comme [Bfxr](https://www.bfxr.net/)
3. Désactiver temporairement les sons dans le code

## Installation

1. Téléchargez les fichiers audio
2. Placez-les dans ce dossier
3. Vérifiez que les noms correspondent exactement
4. Testez avec `npm run ios` ou `npm run android`
