/**
 * Mockup Tool Modal - Main Component
 * Complete mockup creation tool with canvas, templates, and layers
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { haptics } from '../../../../utils/haptics';
import { Toolbar } from './Toolbar';
import { StylePanel } from './StylePanel';
import { DrawingCanvas } from './DrawingCanvas';
import { TemplatesPanel } from './TemplatesPanel';
import { LayersPanel } from './LayersPanel';
import { createNewLayer, cloneLayer } from './utils';
import type {
  DrawingTool,
  Layer,
  DrawingPath,
  ShapeElement,
  Template,
  HistoryState,
} from './types';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (imageData: string) => void;
  isDarkMode?: boolean;
}

type ViewMode = 'canvas' | 'templates' | 'layers';

export const MockupToolModal: React.FC<Props> = ({
  visible,
  onClose,
  onSave,
  isDarkMode = false,
}) => {
  // Tool state
  const [currentTool, setCurrentTool] = useState<DrawingTool>('pen');
  const [currentColor, setCurrentColor] = useState('#000000');
  const [currentStrokeWidth, setCurrentStrokeWidth] = useState(4);
  const [currentOpacity, setCurrentOpacity] = useState(1);

  // Layers state
  const [layers, setLayers] = useState<Layer[]>([createNewLayer('Layer 1')]);
  const [activeLayerId, setActiveLayerId] = useState(layers[0].id);

  // History state
  const [history, setHistory] = useState<HistoryState[]>([
    { layers: [createNewLayer('Layer 1')], timestamp: Date.now() },
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // View mode
  const [viewMode, setViewMode] = useState<ViewMode>('canvas');

  const bgColor = isDarkMode ? '#0A0A0A' : '#F5F5F5';
  const cardBgColor = isDarkMode ? '#1A1A1A' : '#FFFFFF';
  const textColor = isDarkMode ? '#FFFFFF' : '#1A1A1A';
  const borderColor = isDarkMode ? '#3A3A3A' : '#E0E0E0';

  // Add to history
  const addToHistory = (newLayers: Layer[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ layers: newLayers, timestamp: Date.now() });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Handle path completion from canvas
  const handlePathComplete = (path: DrawingPath) => {
    const newLayers = layers.map(layer => {
      if (layer.id === activeLayerId) {
        return {
          ...layer,
          elements: [...layer.elements, path],
        };
      }
      return layer;
    });

    setLayers(newLayers);
    addToHistory(newLayers);
  };

  // Handle shape completion from canvas
  const handleShapeComplete = (shape: ShapeElement) => {
    const newLayers = layers.map(layer => {
      if (layer.id === activeLayerId) {
        return {
          ...layer,
          elements: [...layer.elements, shape],
        };
      }
      return layer;
    });

    setLayers(newLayers);
    addToHistory(newLayers);
  };

  // Undo
  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setLayers(history[newIndex].layers);
      haptics.light();
    }
  };

  // Redo
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setLayers(history[newIndex].layers);
      haptics.light();
    }
  };

  // Clear canvas
  const handleClear = () => {
    Alert.alert(
      'Clear Canvas',
      'Are you sure you want to clear all layers?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            const newLayers = [createNewLayer('Layer 1')];
            setLayers(newLayers);
            setActiveLayerId(newLayers[0].id);
            addToHistory(newLayers);
            haptics.success();
          },
        },
      ]
    );
  };

  // Template selection
  const handleSelectTemplate = (template: Template) => {
    const templateLayers = template.layers.map(layer => cloneLayer(layer));
    setLayers(templateLayers);
    setActiveLayerId(templateLayers[0].id);
    addToHistory(templateLayers);
    setViewMode('canvas');
    haptics.success();
    Alert.alert('Template Loaded', `"${template.name}" has been loaded!`);
  };

  // Layer management
  const handleAddLayer = () => {
    const newLayer = createNewLayer(`Layer ${layers.length + 1}`);
    const newLayers = [...layers, newLayer];
    setLayers(newLayers);
    setActiveLayerId(newLayer.id);
    addToHistory(newLayers);
  };

  const handleRemoveLayer = (layerId: string) => {
    if (layers.length === 1) return;

    const newLayers = layers.filter(l => l.id !== layerId);
    setLayers(newLayers);

    if (activeLayerId === layerId) {
      setActiveLayerId(newLayers[0].id);
    }

    addToHistory(newLayers);
  };

  const handleToggleVisibility = (layerId: string) => {
    const newLayers = layers.map(layer =>
      layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
    );
    setLayers(newLayers);
    addToHistory(newLayers);
  };

  const handleRenameLayer = (layerId: string, newName: string) => {
    const newLayers = layers.map(layer =>
      layer.id === layerId ? { ...layer, name: newName } : layer
    );
    setLayers(newLayers);
    addToHistory(newLayers);
  };

  const handleMoveLayer = (layerId: string, direction: 'up' | 'down') => {
    const currentIndex = layers.findIndex(l => l.id === layerId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= layers.length) return;

    const newLayers = [...layers];
    const [removed] = newLayers.splice(currentIndex, 1);
    newLayers.splice(newIndex, 0, removed);

    setLayers(newLayers);
    addToHistory(newLayers);
  };

  // Save mockup
  const handleSave = () => {
    haptics.success();
    // In production, this would capture the canvas as an image
    // For now, we'll just simulate it
    Alert.alert(
      'Save Mockup',
      'Mockup saved successfully!',
      [
        {
          text: 'OK',
          onPress: () => {
            onSave('mockup_image_data');
            onClose();
          },
        },
      ]
    );
  };

  // Close with confirmation
  const handleClose = () => {
    haptics.light();
    Alert.alert(
      'Close Mockup Tool',
      'Are you sure? Unsaved changes will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Close', style: 'destructive', onPress: onClose },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: cardBgColor, borderBottomColor: borderColor }]}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: textColor }]}>
            Mockup Tool
          </Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>💾 Save</Text>
          </TouchableOpacity>
        </View>

        {/* View Mode Tabs */}
        <View style={[styles.tabs, { backgroundColor: cardBgColor, borderBottomColor: borderColor }]}>
          <TouchableOpacity
            style={[
              styles.tab,
              viewMode === 'canvas' && styles.activeTab,
            ]}
            onPress={() => {
              haptics.light();
              setViewMode('canvas');
            }}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color: viewMode === 'canvas' ? '#4A90E2' : textColor,
                },
              ]}
            >
              🎨 Canvas
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,
              viewMode === 'templates' && styles.activeTab,
            ]}
            onPress={() => {
              haptics.light();
              setViewMode('templates');
            }}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color: viewMode === 'templates' ? '#4A90E2' : textColor,
                },
              ]}
            >
              📋 Templates
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,
              viewMode === 'layers' && styles.activeTab,
            ]}
            onPress={() => {
              haptics.light();
              setViewMode('layers');
            }}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color: viewMode === 'layers' ? '#4A90E2' : textColor,
                },
              ]}
            >
              🗂️ Layers
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {viewMode === 'canvas' && (
          <View style={styles.canvasView}>
            {/* Toolbar */}
            <Toolbar
              currentTool={currentTool}
              onSelectTool={setCurrentTool}
              onUndo={handleUndo}
              onRedo={handleRedo}
              onClear={handleClear}
              canUndo={historyIndex > 0}
              canRedo={historyIndex < history.length - 1}
              isDarkMode={isDarkMode}
            />

            {/* Style Panel */}
            <StylePanel
              currentColor={currentColor}
              currentStrokeWidth={currentStrokeWidth}
              currentOpacity={currentOpacity}
              onColorChange={setCurrentColor}
              onStrokeWidthChange={setCurrentStrokeWidth}
              onOpacityChange={setCurrentOpacity}
              isDarkMode={isDarkMode}
            />

            {/* Canvas */}
            <ScrollView
              style={styles.canvasScroll}
              contentContainerStyle={styles.canvasContainer}
            >
              <DrawingCanvas
                layers={layers}
                activeLayerId={activeLayerId}
                currentTool={currentTool}
                currentColor={currentColor}
                currentStrokeWidth={currentStrokeWidth}
                currentOpacity={currentOpacity}
                onPathComplete={handlePathComplete}
                onShapeComplete={handleShapeComplete}
                isDarkMode={isDarkMode}
              />
            </ScrollView>
          </View>
        )}

        {viewMode === 'templates' && (
          <TemplatesPanel
            onSelectTemplate={handleSelectTemplate}
            isDarkMode={isDarkMode}
          />
        )}

        {viewMode === 'layers' && (
          <LayersPanel
            layers={layers}
            activeLayerId={activeLayerId}
            onSelectLayer={setActiveLayerId}
            onAddLayer={handleAddLayer}
            onRemoveLayer={handleRemoveLayer}
            onToggleVisibility={handleToggleVisibility}
            onRenameLayer={handleRenameLayer}
            onMoveLayer={handleMoveLayer}
            isDarkMode={isDarkMode}
          />
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 24,
    color: '#666666',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4A90E2',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  canvasView: {
    flex: 1,
  },
  canvasScroll: {
    flex: 1,
  },
  canvasContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});
