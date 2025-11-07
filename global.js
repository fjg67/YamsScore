/**
 * Global polyfills for React Native
 */

// EventEmitter polyfill - Use require to ensure synchronous loading
const { EventEmitter } = require('events');

// Polyfill global EventEmitter
if (typeof global.EventEmitter === 'undefined') {
  global.EventEmitter = EventEmitter;
}

// Also add to global.process if needed
if (typeof global.process === 'undefined') {
  global.process = require('process');
}
