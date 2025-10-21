/**
 * Mockup Tool Utilities
 */

import type { Point, Layer, DrawingPath, ShapeElement, TextElement } from './types';

// Generate unique ID
export const generateId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substring(7)}`;
};

// Calculate distance between two points
export const distance = (p1: Point, p2: Point): number => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

// Smooth path using simple averaging
export const smoothPath = (points: Point[], factor: number = 0.5): Point[] => {
  if (points.length < 3) return points;

  const smoothed: Point[] = [points[0]];

  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const next = points[i + 1];

    const smoothedPoint: Point = {
      x: curr.x + (prev.x + next.x - 2 * curr.x) * factor,
      y: curr.y + (prev.y + next.y - 2 * curr.y) * factor,
    };

    smoothed.push(smoothedPoint);
  }

  smoothed.push(points[points.length - 1]);
  return smoothed;
};

// Simplify path by removing redundant points
export const simplifyPath = (points: Point[], tolerance: number = 2): Point[] => {
  if (points.length < 3) return points;

  const simplified: Point[] = [points[0]];
  let prev = points[0];

  for (let i = 1; i < points.length - 1; i++) {
    const curr = points[i];
    if (distance(prev, curr) > tolerance) {
      simplified.push(curr);
      prev = curr;
    }
  }

  simplified.push(points[points.length - 1]);
  return simplified;
};

// Create a new layer
export const createNewLayer = (name?: string): Layer => ({
  id: generateId(),
  name: name || `Layer ${Date.now()}`,
  visible: true,
  locked: false,
  opacity: 1,
  elements: [],
});

// Create a new drawing path
export const createDrawingPath = (
  points: Point[],
  color: string,
  strokeWidth: number,
  opacity: number
): DrawingPath => ({
  id: generateId(),
  tool: 'pen',
  points,
  color,
  strokeWidth,
  opacity,
});

// Create a new shape element
export const createShapeElement = (
  type: ShapeElement['type'],
  start: Point,
  end: Point,
  color: string,
  strokeWidth: number,
  filled: boolean,
  opacity: number
): ShapeElement => ({
  id: generateId(),
  type,
  start,
  end,
  color,
  strokeWidth,
  filled,
  opacity,
});

// Create a new text element
export const createTextElement = (
  text: string,
  position: Point,
  fontSize: number,
  color: string,
  fontWeight: 'normal' | 'bold',
  opacity: number
): TextElement => ({
  id: generateId(),
  text,
  position,
  fontSize,
  color,
  fontWeight,
  opacity,
});

// Check if point is inside a bounding box
export const isPointInBounds = (
  point: Point,
  start: Point,
  end: Point,
  tolerance: number = 5
): boolean => {
  const minX = Math.min(start.x, end.x) - tolerance;
  const maxX = Math.max(start.x, end.x) + tolerance;
  const minY = Math.min(start.y, end.y) - tolerance;
  const maxY = Math.max(start.y, end.y) + tolerance;

  return (
    point.x >= minX &&
    point.x <= maxX &&
    point.y >= minY &&
    point.y <= maxY
  );
};

// Get bounding box for a set of points
export const getBoundingBox = (points: Point[]): { start: Point; end: Point } => {
  if (points.length === 0) {
    return { start: { x: 0, y: 0 }, end: { x: 0, y: 0 } };
  }

  let minX = points[0].x;
  let maxX = points[0].x;
  let minY = points[0].y;
  let maxY = points[0].y;

  points.forEach(p => {
    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y);
    maxY = Math.max(maxY, p.y);
  });

  return {
    start: { x: minX, y: minY },
    end: { x: maxX, y: maxY },
  };
};

// Convert hex color to RGBA
export const hexToRgba = (hex: string, opacity: number): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return `rgba(0, 0, 0, ${opacity})`;

  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Export canvas as image data (mock - requires Skia integration)
export const exportCanvasAsImage = async (
  layers: Layer[],
  width: number,
  height: number
): Promise<string> => {
  // This is a placeholder - actual implementation requires Skia makeImageSnapshot
  console.log('Exporting canvas:', { layers, width, height });
  return 'data:image/png;base64,mock_image_data';
};

// Deep clone a layer
export const cloneLayer = (layer: Layer): Layer => ({
  ...layer,
  id: generateId(),
  elements: layer.elements.map(el => ({
    ...el,
    id: generateId(),
  })),
});

// Merge layers into one
export const mergeLayers = (layers: Layer[], name: string): Layer => {
  const merged = createNewLayer(name);
  layers.forEach(layer => {
    if (layer.visible) {
      merged.elements.push(...layer.elements);
    }
  });
  return merged;
};
