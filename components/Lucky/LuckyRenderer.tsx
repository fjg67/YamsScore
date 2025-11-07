/**
 * LuckyRenderer - Rendu 2D de Lucky
 * Utilise React Native natif pour dessiner Lucky
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LuckyExpression, LuckyExpressionData } from './LuckyTypes';
import { LuckyExpressions } from './LuckyExpressions';
import LinearGradient from 'react-native-linear-gradient';

interface LuckyRendererProps {
  expression: LuckyExpression;
  size: number;
}

export const LuckyRenderer: React.FC<LuckyRendererProps> = ({ expression, size }) => {
  const expressionData = LuckyExpressions.getExpression(expression);

  const bodyColor = expressionData.color?.body || '#F5F5DC';
  const dotsColor = expressionData.color?.dots || '#2C3E50';
  const emissiveColor = expressionData.color?.emissive || bodyColor;

  // Calculer les tailles proportionnelles
  const bodySize = size * 0.7;
  const eyeSize = size * 0.08;
  const mouthWidth = size * 0.25;
  const dotSize = size * 0.03;
  const legWidth = size * 0.12;
  const legHeight = size * 0.15;

  // Déterminer la forme de la bouche selon l'expression
  const getMouthComponent = () => {
    const mouthStyle = [
      styles.mouth,
      {
        width: mouthWidth,
        borderColor: dotsColor,
      },
    ];

    switch (expressionData.mouth) {
      case '\\_____/': // Sourire
        return (
          <View
            style={[
              mouthStyle,
              {
                height: mouthWidth / 2,
                borderBottomWidth: 3,
                borderRadius: mouthWidth,
                borderTopWidth: 0,
              },
            ]}
          />
        );

      case '/‾‾‾\\': // Triste
        return (
          <View
            style={[
              mouthStyle,
              {
                height: mouthWidth / 2,
                borderTopWidth: 3,
                borderRadius: mouthWidth,
                borderBottomWidth: 0,
                transform: [{ scaleY: -1 }],
              },
            ]}
          />
        );

      case 'O': // Surpris
        return (
          <View
            style={[
              styles.mouth,
              {
                width: eyeSize * 1.2,
                height: eyeSize * 1.2,
                borderRadius: eyeSize * 0.6,
                backgroundColor: dotsColor,
              },
            ]}
          />
        );

      case '___': // Neutre
      default:
        return (
          <View
            style={[
              mouthStyle,
              {
                height: 3,
                backgroundColor: dotsColor,
                borderRadius: 2,
              },
            ]}
          />
        );
    }
  };

  // Déterminer les yeux selon l'expression
  const getEyeComponent = (side: 'left' | 'right') => {
    const eyeChar = side === 'left' ? expressionData.eyes.left : expressionData.eyes.right;
    const eyeScale = expressionData.eyes.scale || 1;

    const baseStyle = [
      styles.eye,
      {
        width: eyeSize * eyeScale,
        height: eyeSize * eyeScale,
      },
    ];

    // Yeux spéciaux
    if (eyeChar === '^') {
      // Yeux fermés de joie
      return (
        <View
          style={[
            baseStyle[1],
            {
              height: 3,
              backgroundColor: dotsColor,
              borderRadius: 2,
              transform: [{ rotate: side === 'left' ? '-20deg' : '20deg' }],
            },
          ]}
        />
      );
    }

    if (eyeChar === '-') {
      // Yeux mi-clos
      return (
        <View
          style={[
            baseStyle[1],
            {
              height: 3,
              backgroundColor: dotsColor,
              borderRadius: 2,
            },
          ]}
        />
      );
    }

    if (eyeChar === '⚪' || eyeChar === '◉') {
      // Yeux très ouverts / effrayés
      return (
        <View
          style={[
            baseStyle,
            {
              backgroundColor: '#FFFFFF',
              borderWidth: 2,
              borderColor: dotsColor,
            },
          ]}
        >
          <View
            style={{
              width: eyeSize * eyeScale * 0.5,
              height: eyeSize * eyeScale * 0.5,
              borderRadius: eyeSize * eyeScale * 0.25,
              backgroundColor: dotsColor,
            }}
          />
        </View>
      );
    }

    if (eyeChar === '☆') {
      // Étoiles
      return (
        <Text style={{ fontSize: eyeSize * eyeScale * 1.5, color: '#FFD700' }}>
          ⭐
        </Text>
      );
    }

    if (eyeChar === '♥') {
      // Cœurs
      return (
        <Text style={{ fontSize: eyeSize * eyeScale * 1.5, color: '#FF69B4' }}>
          ❤️
        </Text>
      );
    }

    if (eyeChar === 'X') {
      // K.O.
      return (
        <Text style={{ fontSize: eyeSize * eyeScale * 1.5, color: dotsColor, fontWeight: 'bold' }}>
          ✕
        </Text>
      );
    }

    if (eyeChar === '@') {
      // Confus
      return (
        <Text style={{ fontSize: eyeSize * eyeScale * 1.5, color: dotsColor }}>
          @
        </Text>
      );
    }

    if (eyeChar === '•' && side === 'right') {
      // Clin d'œil (seulement œil droit)
      return (
        <View
          style={[
            baseStyle[1],
            {
              height: 3,
              backgroundColor: dotsColor,
              borderRadius: 2,
            },
          ]}
        />
      );
    }

    // Yeux normaux par défaut
    return (
      <View
        style={[
          baseStyle,
          {
            backgroundColor: dotsColor,
            borderRadius: eyeSize * eyeScale * 0.5,
          },
        ]}
      />
    );
  };

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Corps principal - Dé */}
      <LinearGradient
        colors={[bodyColor, emissiveColor, bodyColor]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.body,
          {
            width: bodySize,
            height: bodySize,
            borderRadius: bodySize * 0.18,
            shadowColor: emissiveColor,
            shadowOpacity: emissiveColor !== bodyColor ? 0.5 : 0.2,
            elevation: emissiveColor !== bodyColor ? 10 : 5,
          },
        ]}
      >
        {/* Face du dé */}
        <View style={styles.face}>
          {/* Yeux */}
          <View style={styles.eyes}>
            <View style={styles.eyeContainer}>
              {getEyeComponent('left')}
            </View>
            <View style={styles.eyeContainer}>
              {getEyeComponent('right')}
            </View>
          </View>

          {/* Bouche */}
          <View style={styles.mouthContainer}>
            {getMouthComponent()}
          </View>
        </View>

        {/* Points décoratifs sur le dé */}
        <View style={styles.decorativeDots}>
          {[...Array(3)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  width: dotSize,
                  height: dotSize,
                  borderRadius: dotSize / 2,
                  backgroundColor: dotsColor,
                  opacity: 0.3,
                },
              ]}
            />
          ))}
        </View>
      </LinearGradient>

      {/* Jambes */}
      <View style={styles.legs}>
        <View
          style={[
            styles.leg,
            {
              width: legWidth,
              height: legHeight,
              backgroundColor: bodyColor,
              borderRadius: legWidth / 2,
            },
          ]}
        />
        <View
          style={[
            styles.leg,
            {
              width: legWidth,
              height: legHeight,
              backgroundColor: bodyColor,
              borderRadius: legWidth / 2,
            },
          ]}
        />
      </View>

      {/* Pieds */}
      <View style={styles.feet}>
        <View
          style={[
            styles.foot,
            {
              width: legWidth * 1.2,
              height: legWidth * 0.8,
              backgroundColor: bodyColor,
              borderRadius: legWidth * 0.4,
            },
          ]}
        />
        <View
          style={[
            styles.foot,
            {
              width: legWidth * 1.2,
              height: legWidth * 0.8,
              backgroundColor: bodyColor,
              borderRadius: legWidth * 0.4,
            },
          ]}
        />
      </View>

      {/* Effet d'aura si présent */}
      {expressionData.effects?.aura && (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: expressionData.effects.aura.color,
              opacity: expressionData.effects.aura.intensity * 0.3,
              borderRadius: size / 2,
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  face: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '10%',
  },
  eyes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '70%',
    marginBottom: '15%',
  },
  eyeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  eye: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mouthContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mouth: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  decorativeDots: {
    position: 'absolute',
    bottom: '10%',
    flexDirection: 'row',
    gap: 4,
  },
  dot: {},
  legs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '50%',
    marginTop: -5,
  },
  leg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  feet: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '50%',
    marginTop: -3,
  },
  foot: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
});
