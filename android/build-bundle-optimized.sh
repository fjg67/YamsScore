#!/bin/bash

echo "🧹 Nettoyage des anciens builds..."
./gradlew clean

echo ""
echo "🚀 Lancement du build AAB optimisé avec logs détaillés..."
echo "   Vous verrez la progression en temps réel"
echo ""

# Build avec options optimisées et logs verbeux
./gradlew bundleRelease \
  --info \
  --no-daemon \
  --max-workers=4 \
  --parallel

echo ""
echo "✅ Build terminé !"
echo "📦 Le fichier .aab se trouve dans : app/build/outputs/bundle/release/"
