/**
 * Mockup Tool - Layers Panel
 * Layer management (add, remove, reorder, visibility)
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import type { Layer } from './types';
import { haptics } from '../../../../utils/haptics';

interface Props {
  layers: Layer[];
  activeLayerId: string;
  onSelectLayer: (layerId: string) => void;
  onAddLayer: () => void;
  onRemoveLayer: (layerId: string) => void;
  onToggleVisibility: (layerId: string) => void;
  onRenameLayer: (layerId: string, newName: string) => void;
  onMoveLayer: (layerId: string, direction: 'up' | 'down') => void;
  isDarkMode?: boolean;
}

export const LayersPanel: React.FC<Props> = ({
  layers,
  activeLayerId,
  onSelectLayer,
  onAddLayer,
  onRemoveLayer,
  onToggleVisibility,
  onRenameLayer,
  onMoveLayer,
  isDarkMode = false,
}) => {
  const bgColor = isDarkMode ? '#2A2A2A' : '#F8F8F8';
  const textColor = isDarkMode ? '#FFFFFF' : '#1A1A1A';
  const subtextColor = isDarkMode ? '#AAAAAA' : '#666666';
  const borderColor = isDarkMode ? '#3A3A3A' : '#E0E0E0';
  const activeBgColor = isDarkMode ? '#3A3A3A' : '#E8F5FF';

  const handleLayerPress = (layerId: string) => {
    haptics.light();
    onSelectLayer(layerId);
  };

  const handleAddLayer = () => {
    haptics.light();
    onAddLayer();
  };

  const handleRemoveLayer = (layerId: string) => {
    if (layers.length === 1) {
      Alert.alert('Cannot Delete', 'You must have at least one layer');
      return;
    }

    haptics.warning();
    Alert.alert(
      'Delete Layer',
      'Are you sure you want to delete this layer?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onRemoveLayer(layerId),
        },
      ]
    );
  };

  const handleToggleVisibility = (layerId: string) => {
    haptics.light();
    onToggleVisibility(layerId);
  };

  const handleRename = (layerId: string, currentName: string) => {
    haptics.light();
    Alert.prompt(
      'Rename Layer',
      'Enter new layer name',
      (newName: string) => {
        if (newName && newName.trim()) {
          onRenameLayer(layerId, newName.trim());
        }
      },
      'plain-text',
      currentName
    );
  };

  const handleMoveUp = (layerId: string) => {
    haptics.light();
    onMoveLayer(layerId, 'up');
  };

  const handleMoveDown = (layerId: string) => {
    haptics.light();
    onMoveLayer(layerId, 'down');
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: borderColor }]}>
        <Text style={[styles.headerTitle, { color: textColor }]}>
          Layers
        </Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddLayer}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Layers List */}
      <ScrollView
        style={styles.layersList}
        contentContainerStyle={styles.layersContent}
        showsVerticalScrollIndicator={false}
      >
        {layers.map((layer, index) => {
          const isActive = layer.id === activeLayerId;
          const canMoveUp = index > 0;
          const canMoveDown = index < layers.length - 1;

          return (
            <View
              key={layer.id}
              style={[
                styles.layerCard,
                {
                  backgroundColor: isActive ? activeBgColor : 'transparent',
                  borderColor: isActive ? '#4A90E2' : borderColor,
                },
              ]}
            >
              {/* Layer Info */}
              <TouchableOpacity
                style={styles.layerInfo}
                onPress={() => handleLayerPress(layer.id)}
              >
                <View style={styles.layerMain}>
                  <Text
                    style={[
                      styles.layerName,
                      {
                        color: textColor,
                        fontWeight: isActive ? 'bold' : 'normal',
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {layer.name}
                  </Text>
                  <Text style={[styles.layerCount, { color: subtextColor }]}>
                    {layer.elements.length} elements
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Layer Actions */}
              <View style={styles.layerActions}>
                {/* Visibility Toggle */}
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleToggleVisibility(layer.id)}
                >
                  <Text style={styles.actionIcon}>
                    {layer.visible ? '👁️' : '👁️‍🗨️'}
                  </Text>
                </TouchableOpacity>

                {/* Move Up */}
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    { opacity: canMoveUp ? 1 : 0.3 },
                  ]}
                  onPress={() => handleMoveUp(layer.id)}
                  disabled={!canMoveUp}
                >
                  <Text style={styles.actionIcon}>⬆️</Text>
                </TouchableOpacity>

                {/* Move Down */}
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    { opacity: canMoveDown ? 1 : 0.3 },
                  ]}
                  onPress={() => handleMoveDown(layer.id)}
                  disabled={!canMoveDown}
                >
                  <Text style={styles.actionIcon}>⬇️</Text>
                </TouchableOpacity>

                {/* Rename */}
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleRename(layer.id, layer.name)}
                >
                  <Text style={styles.actionIcon}>✏️</Text>
                </TouchableOpacity>

                {/* Delete */}
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    { opacity: layers.length === 1 ? 0.3 : 1 },
                  ]}
                  onPress={() => handleRemoveLayer(layer.id)}
                  disabled={layers.length === 1}
                >
                  <Text style={styles.actionIcon}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  layersList: {
    flex: 1,
  },
  layersContent: {
    padding: 12,
    gap: 8,
  },
  layerCard: {
    borderRadius: 8,
    borderWidth: 2,
    overflow: 'hidden',
  },
  layerInfo: {
    padding: 12,
  },
  layerMain: {
    gap: 4,
  },
  layerName: {
    fontSize: 14,
  },
  layerCount: {
    fontSize: 11,
  },
  layerActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 16,
  },
});
