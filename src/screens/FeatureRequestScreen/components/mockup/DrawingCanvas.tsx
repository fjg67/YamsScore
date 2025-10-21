/**
 * Mockup Tool - Drawing Canvas
 * SVG-based canvas for drawing
 */

import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  Dimensions,
} from 'react-native';
import Svg, { Path, Rect, Circle, Line, Text as SvgText, G } from 'react-native-svg';
import type { DrawingTool, Point, Layer, DrawingPath, ShapeElement, TextElement } from './types';
import { createDrawingPath, createShapeElement, simplifyPath } from './utils';

interface Props {
  layers: Layer[];
  activeLayerId: string;
  currentTool: DrawingTool;
  currentColor: string;
  currentStrokeWidth: number;
  currentOpacity: number;
  onPathComplete: (path: DrawingPath) => void;
  onShapeComplete: (shape: ShapeElement) => void;
  isDarkMode?: boolean;
}

const CANVAS_WIDTH = Dimensions.get('window').width - 40;
const CANVAS_HEIGHT = 500;

export const DrawingCanvas: React.FC<Props> = ({
  layers,
  activeLayerId: _activeLayerId,
  currentTool,
  currentColor,
  currentStrokeWidth,
  currentOpacity,
  onPathComplete,
  onShapeComplete,
  isDarkMode = false,
}) => {
  const [currentPoints, setCurrentPoints] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [shapeStart, setShapeStart] = useState<Point | null>(null);
  const [shapeEnd, setShapeEnd] = useState<Point | null>(null);

  const bgColor = isDarkMode ? '#1A1A1A' : '#FFFFFF';
  const gridColor = isDarkMode ? '#2A2A2A' : '#F0F0F0';

  // Pan Responder for drawing
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: evt => {
        const { locationX, locationY } = evt.nativeEvent;
        const point: Point = { x: locationX, y: locationY };

        if (currentTool === 'pen') {
          setIsDrawing(true);
          setCurrentPoints([point]);
        } else if (currentTool === 'shapes') {
          setIsDrawing(true);
          setShapeStart(point);
          setShapeEnd(point);
        }
      },

      onPanResponderMove: evt => {
        const { locationX, locationY } = evt.nativeEvent;
        const point: Point = { x: locationX, y: locationY };

        if (currentTool === 'pen' && isDrawing) {
          setCurrentPoints(prev => [...prev, point]);
        } else if (currentTool === 'shapes' && isDrawing && shapeStart) {
          setShapeEnd(point);
        }
      },

      onPanResponderRelease: () => {
        if (currentTool === 'pen' && currentPoints.length > 1) {
          const simplified = simplifyPath(currentPoints, 3);
          const path = createDrawingPath(
            simplified,
            currentColor,
            currentStrokeWidth,
            currentOpacity
          );
          onPathComplete(path);
          setCurrentPoints([]);
        } else if (currentTool === 'shapes' && shapeStart && shapeEnd) {
          const shape = createShapeElement(
            'rectangle', // Default shape, can be extended
            shapeStart,
            shapeEnd,
            currentColor,
            currentStrokeWidth,
            false, // Not filled by default
            currentOpacity
          );
          onShapeComplete(shape);
          setShapeStart(null);
          setShapeEnd(null);
        }
        setIsDrawing(false);
      },
    })
  ).current;

  // Convert points array to SVG path data
  const pointsToPathData = (points: Point[]): string => {
    if (points.length === 0) return '';

    let pathData = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      pathData += ` L ${points[i].x} ${points[i].y}`;
    }
    return pathData;
  };

  // Render a drawing path
  const renderPath = (path: DrawingPath, index: number) => (
    <Path
      key={`path-${path.id}-${index}`}
      d={pointsToPathData(path.points)}
      stroke={path.color}
      strokeWidth={path.strokeWidth}
      fill="none"
      opacity={path.opacity}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );

  // Render a shape element
  const renderShape = (shape: ShapeElement, index: number) => {
    const { start, end, color, strokeWidth, filled, opacity, type } = shape;

    if (type === 'rectangle') {
      const x = Math.min(start.x, end.x);
      const y = Math.min(start.y, end.y);
      const width = Math.abs(end.x - start.x);
      const height = Math.abs(end.y - start.y);

      return (
        <Rect
          key={`shape-${shape.id}-${index}`}
          x={x}
          y={y}
          width={width}
          height={height}
          stroke={color}
          strokeWidth={strokeWidth}
          fill={filled ? color : 'none'}
          opacity={opacity}
        />
      );
    } else if (type === 'circle') {
      const cx = (start.x + end.x) / 2;
      const cy = (start.y + end.y) / 2;
      const rx = Math.abs(end.x - start.x) / 2;
      const ry = Math.abs(end.y - start.y) / 2;

      return (
        <Circle
          key={`shape-${shape.id}-${index}`}
          cx={cx}
          cy={cy}
          r={Math.min(rx, ry)}
          stroke={color}
          strokeWidth={strokeWidth}
          fill={filled ? color : 'none'}
          opacity={opacity}
        />
      );
    } else if (type === 'line' || type === 'arrow') {
      return (
        <Line
          key={`shape-${shape.id}-${index}`}
          x1={start.x}
          y1={start.y}
          x2={end.x}
          y2={end.y}
          stroke={color}
          strokeWidth={strokeWidth}
          opacity={opacity}
          strokeLinecap="round"
        />
      );
    }

    return null;
  };

  // Render a text element
  const renderText = (text: TextElement, index: number) => (
    <SvgText
      key={`text-${text.id}-${index}`}
      x={text.position.x}
      y={text.position.y}
      fontSize={text.fontSize}
      fill={text.color}
      opacity={text.opacity}
      fontWeight={text.fontWeight}
    >
      {text.text}
    </SvgText>
  );

  // Render current drawing preview
  const renderCurrentDrawing = () => {
    if (!isDrawing) return null;

    if (currentTool === 'pen' && currentPoints.length > 1) {
      return (
        <Path
          d={pointsToPathData(currentPoints)}
          stroke={currentColor}
          strokeWidth={currentStrokeWidth}
          fill="none"
          opacity={currentOpacity}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      );
    } else if (currentTool === 'shapes' && shapeStart && shapeEnd) {
      const x = Math.min(shapeStart.x, shapeEnd.x);
      const y = Math.min(shapeStart.y, shapeEnd.y);
      const width = Math.abs(shapeEnd.x - shapeStart.x);
      const height = Math.abs(shapeEnd.y - shapeStart.y);

      return (
        <Rect
          x={x}
          y={y}
          width={width}
          height={height}
          stroke={currentColor}
          strokeWidth={currentStrokeWidth}
          fill="none"
          opacity={currentOpacity * 0.5}
          strokeDasharray="5,5"
        />
      );
    }

    return null;
  };

  return (
    <View
      style={[styles.container, { backgroundColor: bgColor }]}
      {...panResponder.panHandlers}
    >
      <Svg width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
        {/* Grid background */}
        <G>
          {Array.from({ length: 20 }).map((_, i) => (
            <React.Fragment key={`grid-${i}`}>
              <Line
                x1={0}
                y1={i * 25}
                x2={CANVAS_WIDTH}
                y2={i * 25}
                stroke={gridColor}
                strokeWidth={1}
              />
              <Line
                x1={i * 25}
                y1={0}
                x2={i * 25}
                y2={CANVAS_HEIGHT}
                stroke={gridColor}
                strokeWidth={1}
              />
            </React.Fragment>
          ))}
        </G>

        {/* Render all layers */}
        {layers.map(layer => {
          if (!layer.visible) return null;

          return (
            <G key={layer.id} opacity={layer.opacity}>
              {layer.elements.map((element, index) => {
                if ('points' in element) {
                  return renderPath(element as DrawingPath, index);
                } else if ('type' in element) {
                  return renderShape(element as ShapeElement, index);
                } else if ('text' in element) {
                  return renderText(element as TextElement, index);
                }
                return null;
              })}
            </G>
          );
        })}

        {/* Current drawing preview */}
        {renderCurrentDrawing()}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    alignSelf: 'center',
    borderRadius: 12,
    overflow: 'hidden',
  },
});
