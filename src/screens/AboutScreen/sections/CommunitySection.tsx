import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';

const CommunitySection = () => {
  // Section désactivée - pas de réseaux sociaux pour l'instant
  return <View style={styles.container} />;
};

const styles = StyleSheet.create({
  container: {
    height: 0,
  },
});

export default CommunitySection;
