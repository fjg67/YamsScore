/**
 * Pre-made Mockup Templates
 */

import type { Template, Layer } from './types';

// Helper to create a basic layer
const createLayer = (name: string, elements: Layer['elements'] = []): Layer => ({
  id: `layer_${Date.now()}_${Math.random()}`,
  name,
  visible: true,
  locked: false,
  opacity: 1,
  elements,
});

// Template: iPhone Frame
export const IPHONE_FRAME_TEMPLATE: Template = {
  id: 'iphone_frame',
  name: 'iPhone Frame',
  category: 'screen',
  icon: '📱',
  thumbnail: 'iphone_frame.png',
  layers: [
    createLayer('Background', []),
    createLayer('iPhone Frame', [
      {
        id: 'frame_outer',
        type: 'rectangle',
        start: { x: 50, y: 50 },
        end: { x: 350, y: 700 },
        color: '#1A1A1A',
        strokeWidth: 4,
        filled: false,
        opacity: 1,
      },
      {
        id: 'frame_screen',
        type: 'rectangle',
        start: { x: 60, y: 80 },
        end: { x: 340, y: 660 },
        color: '#FFFFFF',
        strokeWidth: 2,
        filled: true,
        opacity: 1,
      },
      {
        id: 'frame_notch',
        type: 'rectangle',
        start: { x: 150, y: 80 },
        end: { x: 250, y: 95 },
        color: '#1A1A1A',
        strokeWidth: 0,
        filled: true,
        opacity: 1,
      },
    ]),
    createLayer('Content', []),
  ],
};

// Template: Card UI
export const CARD_TEMPLATE: Template = {
  id: 'card_ui',
  name: 'Card UI',
  category: 'component',
  icon: '🃏',
  thumbnail: 'card_ui.png',
  layers: [
    createLayer('Card', [
      {
        id: 'card_bg',
        type: 'rectangle',
        start: { x: 50, y: 100 },
        end: { x: 350, y: 300 },
        color: '#FFFFFF',
        strokeWidth: 2,
        filled: true,
        opacity: 1,
      },
      {
        id: 'card_title',
        text: 'Card Title',
        position: { x: 70, y: 130 },
        fontSize: 24,
        color: '#1A1A1A',
        fontWeight: 'bold',
        opacity: 1,
      },
      {
        id: 'card_description',
        text: 'Card description goes here',
        position: { x: 70, y: 170 },
        fontSize: 16,
        color: '#666666',
        fontWeight: 'normal',
        opacity: 1,
      },
    ]),
  ],
};

// Template: Button
export const BUTTON_TEMPLATE: Template = {
  id: 'button',
  name: 'Button',
  category: 'component',
  icon: '🔘',
  thumbnail: 'button.png',
  layers: [
    createLayer('Button', [
      {
        id: 'button_bg',
        type: 'rectangle',
        start: { x: 100, y: 200 },
        end: { x: 300, y: 260 },
        color: '#4A90E2',
        strokeWidth: 0,
        filled: true,
        opacity: 1,
      },
      {
        id: 'button_text',
        text: 'Click Me',
        position: { x: 160, y: 235 },
        fontSize: 20,
        color: '#FFFFFF',
        fontWeight: 'bold',
        opacity: 1,
      },
    ]),
  ],
};

// Template: Icon Set
export const ICON_TEMPLATE: Template = {
  id: 'icons',
  name: 'Icon Grid',
  category: 'icon',
  icon: '🎨',
  thumbnail: 'icons.png',
  layers: [
    createLayer('Icons', [
      // Home icon
      {
        id: 'icon_home',
        type: 'rectangle',
        start: { x: 50, y: 50 },
        end: { x: 110, y: 110 },
        color: '#4A90E2',
        strokeWidth: 3,
        filled: false,
        opacity: 1,
      },
      // Settings icon
      {
        id: 'icon_settings',
        type: 'circle',
        start: { x: 150, y: 50 },
        end: { x: 210, y: 110 },
        color: '#10B981',
        strokeWidth: 3,
        filled: false,
        opacity: 1,
      },
      // Plus icon
      {
        id: 'icon_plus_v',
        type: 'line',
        start: { x: 280, y: 50 },
        end: { x: 280, y: 110 },
        color: '#FFA500',
        strokeWidth: 3,
        filled: false,
        opacity: 1,
      },
      {
        id: 'icon_plus_h',
        type: 'line',
        start: { x: 250, y: 80 },
        end: { x: 310, y: 80 },
        color: '#FFA500',
        strokeWidth: 3,
        filled: false,
        opacity: 1,
      },
    ]),
  ],
};

// Template: Dark Mode Toggle
export const TOGGLE_TEMPLATE: Template = {
  id: 'toggle',
  name: 'Toggle Switch',
  category: 'component',
  icon: '🌓',
  thumbnail: 'toggle.png',
  layers: [
    createLayer('Toggle', [
      {
        id: 'toggle_bg',
        type: 'rectangle',
        start: { x: 100, y: 200 },
        end: { x: 200, y: 240 },
        color: '#10B981',
        strokeWidth: 0,
        filled: true,
        opacity: 1,
      },
      {
        id: 'toggle_handle',
        type: 'circle',
        start: { x: 160, y: 205 },
        end: { x: 195, y: 235 },
        color: '#FFFFFF',
        strokeWidth: 0,
        filled: true,
        opacity: 1,
      },
    ]),
  ],
};

// Template: List Item
export const LIST_ITEM_TEMPLATE: Template = {
  id: 'list_item',
  name: 'List Item',
  category: 'component',
  icon: '📋',
  thumbnail: 'list_item.png',
  layers: [
    createLayer('List Items', [
      // Item 1
      {
        id: 'item1_bg',
        type: 'rectangle',
        start: { x: 50, y: 100 },
        end: { x: 350, y: 150 },
        color: '#F8F8F8',
        strokeWidth: 1,
        filled: true,
        opacity: 1,
      },
      {
        id: 'item1_text',
        text: 'List Item 1',
        position: { x: 70, y: 130 },
        fontSize: 16,
        color: '#1A1A1A',
        fontWeight: 'normal',
        opacity: 1,
      },
      // Item 2
      {
        id: 'item2_bg',
        type: 'rectangle',
        start: { x: 50, y: 160 },
        end: { x: 350, y: 210 },
        color: '#FFFFFF',
        strokeWidth: 1,
        filled: true,
        opacity: 1,
      },
      {
        id: 'item2_text',
        text: 'List Item 2',
        position: { x: 70, y: 190 },
        fontSize: 16,
        color: '#1A1A1A',
        fontWeight: 'normal',
        opacity: 1,
      },
    ]),
  ],
};

// Export all templates
export const ALL_TEMPLATES: Template[] = [
  IPHONE_FRAME_TEMPLATE,
  CARD_TEMPLATE,
  BUTTON_TEMPLATE,
  ICON_TEMPLATE,
  TOGGLE_TEMPLATE,
  LIST_ITEM_TEMPLATE,
];

// Get templates by category
export const getTemplatesByCategory = (category: Template['category']): Template[] => {
  return ALL_TEMPLATES.filter(t => t.category === category);
};

// Get template by id
export const getTemplateById = (id: string): Template | undefined => {
  return ALL_TEMPLATES.find(t => t.id === id);
};
