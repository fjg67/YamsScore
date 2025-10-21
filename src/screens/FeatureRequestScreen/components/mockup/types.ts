/**
 * Mockup Tool Types & Interfaces
 */

export type DrawingTool = 'pen' | 'shapes' | 'text' | 'eraser' | 'select';
export type ShapeType = 'rectangle' | 'circle' | 'line' | 'arrow';

export interface Point {
  x: number;
  y: number;
}

export interface DrawingPath {
  id: string;
  tool: DrawingTool;
  points: Point[];
  color: string;
  strokeWidth: number;
  opacity: number;
}

export interface ShapeElement {
  id: string;
  type: ShapeType;
  start: Point;
  end: Point;
  color: string;
  strokeWidth: number;
  filled: boolean;
  opacity: number;
}

export interface TextElement {
  id: string;
  text: string;
  position: Point;
  fontSize: number;
  color: string;
  fontWeight: 'normal' | 'bold';
  opacity: number;
}

export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  opacity: number;
  elements: (DrawingPath | ShapeElement | TextElement)[];
}

export interface Template {
  id: string;
  name: string;
  category: 'ui' | 'screen' | 'component' | 'icon';
  icon: string;
  thumbnail: string;
  layers: Layer[];
}

export interface HistoryState {
  layers: Layer[];
  timestamp: number;
}

export interface MockupToolState {
  currentTool: DrawingTool;
  currentColor: string;
  currentStrokeWidth: number;
  currentOpacity: number;
  layers: Layer[];
  activeLayerId: string;
  history: HistoryState[];
  historyIndex: number;
  canUndo: boolean;
  canRedo: boolean;
}

// Predefined colors
export const PRESET_COLORS = [
  '#000000', // Black
  '#FFFFFF', // White
  '#FF6B6B', // Red
  '#4A90E2', // Blue
  '#10B981', // Green
  '#FFA500', // Orange
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#F59E0B', // Yellow
  '#EC4899', // Pink
];

// Stroke width presets
export const STROKE_WIDTHS = [2, 4, 8, 12, 16];

// Font sizes
export const FONT_SIZES = [12, 16, 20, 24, 32, 48];
