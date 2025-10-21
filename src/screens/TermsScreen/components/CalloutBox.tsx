import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export type CalloutStyle = 'info' | 'warning' | 'danger' | 'success';

interface CalloutBoxProps {
  type: CalloutStyle;
  icon: string;
  text: string;
  title?: string;
}

export const CalloutBox: React.FC<CalloutBoxProps> = ({
  type,
  icon,
  text,
  title,
}) => {
  const getColors = () => {
    switch (type) {
      case 'info':
        return {
          background: 'rgba(74, 144, 226, 0.1)',
          border: 'rgba(74, 144, 226, 0.3)',
          text: '#1565C0',
        };
      case 'warning':
        return {
          background: 'rgba(243, 156, 18, 0.1)',
          border: 'rgba(243, 156, 18, 0.3)',
          text: '#E65100',
        };
      case 'danger':
        return {
          background: 'rgba(255, 107, 107, 0.1)',
          border: 'rgba(255, 107, 107, 0.3)',
          text: '#C62828',
        };
      case 'success':
        return {
          background: 'rgba(80, 200, 120, 0.1)',
          border: 'rgba(80, 200, 120, 0.3)',
          text: '#2E7D32',
        };
    }
  };

  const colors = getColors();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          borderColor: colors.border,
        },
      ]}>
      <View style={styles.header}>
        <Text style={styles.icon}>{icon}</Text>
        {title && (
          <Text style={[styles.title, {color: colors.text}]}>{title}</Text>
        )}
      </View>
      <Text style={[styles.text, {color: colors.text}]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 2,
    padding: 16,
    marginVertical: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 24,
    marginRight: 8,
  },
  title: {
    fontFamily: 'SF Pro Text',
    fontSize: 17,
    fontWeight: '700',
  },
  text: {
    fontFamily: 'SF Pro Text',
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 22,
  },
});
