/**
 * Application Yams Score
 * Feuille de marque digitale pour le jeu de Yams
 */

import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from './src/store/store';
import AppNavigator from './src/navigation/AppNavigator';
import { initializeSettingsStorage } from './src/screens/SettingsScreen/utils/settingsStorage';

function App() {
  useEffect(() => {
    // Charger les settings au démarrage
    initializeSettingsStorage();
  }, []);

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        <AppNavigator />
      </SafeAreaProvider>
    </Provider>
  );
}

export default App;
