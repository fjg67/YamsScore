/**
 * Mockup Tool - Toolbar
 * Drawing tools selection
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import type { DrawingTool } from './types';
import { haptics } from '../../../../utils/haptics';

interface Props {
  currentTool: DrawingTool;
  onSelectTool: (tool: DrawingTool) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isDarkMode?: boolean;
}

const TOOLS: Array<{ id: DrawingTool; icon: string; label: string }> = [
  { id: 'pen', icon: '✏️', label: 'Pen' },
  { id: 'shapes', icon: '▢', label: 'Shapes' },
  { id: 'text', icon: '𝐀', label: 'Text' },
  { id: 'eraser', icon: '🧹', label: 'Eraser' },
  { id: 'select', icon: '👆', label: 'Select' },
];

export const Toolbar: React.FC<Props> = ({
  currentTool,
  onSelectTool,
  onUndo,
  onRedo,
  onClear,
  canUndo,
  canRedo,
  isDarkMode = false,
}) => {
  const bgColor = isDarkMode ? '#2A2A2A' : '#F8F8F8';
  const subtextColor = isDarkMode ? '#AAAAAA' : '#666666';
  const borderColor = isDarkMode ? '#3A3A3A' : '#E0E0E0';

  const handleToolPress = (tool: DrawingTool) => {
    haptics.light();
    onSelectTool(tool);
  };

  const handleUndo = () => {
    if (canUndo) {
      haptics.light();
      onUndo();
    }
  };

  const handleRedo = () => {
    if (canRedo) {
      haptics.light();
      onRedo();
    }
  };

  const handleClear = () => {
    haptics.warning();
    onClear();
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor, borderBottomColor: borderColor }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Drawing Tools */}
        <View style={styles.section}>
          {TOOLS.map(tool => (
            <TouchableOpacity
              key={tool.id}
              style={[
                styles.toolButton,
                {
                  backgroundColor: currentTool === tool.id ? '#4A90E2' : 'transparent',
                  borderColor,
                },
              ]}
              onPress={() => handleToolPress(tool.id)}
            >
              <Text style={styles.toolIcon}>{tool.icon}</Text>
              <Text
                style={[
                  styles.toolLabel,
                  {
                    color: currentTool === tool.id ? '#FFFFFF' : subtextColor,
                  },
                ]}
              >
                {tool.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Separator */}
        <View style={[styles.separator, { backgroundColor: borderColor }]} />

        {/* History Controls */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              { borderColor, opacity: canUndo ? 1 : 0.3 },
            ]}
            onPress={handleUndo}
            disabled={!canUndo}
          >
            <Text style={styles.actionIcon}>↶</Text>
            <Text style={[styles.actionLabel, { color: subtextColor }]}>
              Undo
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              { borderColor, opacity: canRedo ? 1 : 0.3 },
            ]}
            onPress={handleRedo}
            disabled={!canRedo}
          >
            <Text style={styles.actionIcon}>↷</Text>
            <Text style={[styles.actionLabel, { color: subtextColor }]}>
              Redo
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { borderColor }]}
            onPress={handleClear}
          >
            <Text style={styles.actionIcon}>🗑️</Text>
            <Text style={[styles.actionLabel, { color: subtextColor }]}>
              Clear
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    paddingVertical: 8,
  },
  scrollContent: {
    paddingHorizontal: 12,
    gap: 12,
  },
  section: {
    flexDirection: 'row',
    gap: 8,
  },
  toolButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    minWidth: 60,
  },
  toolIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  toolLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  separator: {
    width: 1,
    alignSelf: 'stretch',
    marginVertical: 4,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    minWidth: 50,
  },
  actionIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  actionLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
});
