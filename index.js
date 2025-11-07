/**
 * @format
 */

// Import global polyfills FIRST using require
require('./global');

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
