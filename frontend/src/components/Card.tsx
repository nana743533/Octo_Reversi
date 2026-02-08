import React from 'react';
import { View, StyleSheet, ViewStyle, Pressable } from 'react-native';
import { Colors, Spacing, BorderRadius } from '../constants';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  padding?: number;
  variant?: 'default' | 'outlined' | 'elevated';
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  padding = Spacing.md,
  variant = 'default',
}) => {
  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: BorderRadius.lg,
      padding,
      backgroundColor: Colors.backgroundCard,
    };

    const variantStyles: Record<string, ViewStyle> = {
      default: {
        borderWidth: 0,
      },
      outlined: {
        borderWidth: 1,
        borderColor: Colors.border,
      },
      elevated: {
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
      },
    };

    return { ...baseStyle, ...variantStyles[variant] };
  };

  if (onPress) {
    return (
      <Pressable style={({ pressed }) => [styles.card, getCardStyle(), style, pressed ? styles.pressed : undefined]} onPress={onPress}>
        {children}
      </Pressable>
    );
  }

  return <View style={[styles.card, getCardStyle(), style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.8,
  },
});
