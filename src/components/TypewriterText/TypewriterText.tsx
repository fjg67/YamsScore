/**
 * Texte avec animation typewriter (machine à écrire)
 * Caractère par caractère
 */

import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';

interface TypewriterTextProps {
  text: string;
  style?: TextStyle;
  delay?: number;
  speed?: number;
  onComplete?: () => void;
  showCursor?: boolean;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  style,
  delay = 0,
  speed = 50,
  onComplete,
  showCursor = false,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursorBlink, setShowCursorBlink] = useState(true);

  useEffect(() => {
    // Délai initial avant de commencer
    const startTimeout = setTimeout(() => {
      if (currentIndex < text.length) {
        const timeout = setTimeout(() => {
          setDisplayedText(prev => prev + text[currentIndex]);
          setCurrentIndex(prev => prev + 1);
        }, speed);

        return () => clearTimeout(timeout);
      } else if (onComplete) {
        onComplete();
      }
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [currentIndex, text, speed, delay, onComplete]);

  // Animation du curseur clignotant
  useEffect(() => {
    if (showCursor && currentIndex === text.length) {
      const cursorInterval = setInterval(() => {
        setShowCursorBlink(prev => !prev);
      }, 500);

      return () => clearInterval(cursorInterval);
    }
  }, [showCursor, currentIndex, text.length]);

  return (
    <Text style={[styles.text, style]}>
      {displayedText}
      {showCursor && currentIndex < text.length && (
        <Text style={styles.cursor}>|</Text>
      )}
      {showCursor && currentIndex === text.length && showCursorBlink && (
        <Text style={styles.cursor}>|</Text>
      )}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
  },
  cursor: {
    opacity: 0.8,
  },
});
