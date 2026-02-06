import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { Colors, Typography } from '../constants';

interface ThemedTextProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption';
  color?: keyof typeof Colors;
  style?: TextStyle;
  fontWeight?: keyof typeof Typography.fontWeight;
}

export const ThemedText: React.FC<ThemedTextProps> = ({
  children,
  variant = 'body',
  color = 'text',
  style,
  fontWeight = 'normal',
}) => {
  return (
    <Text
      style={[
        styles[variant],
        { color: Colors[color] },
        { fontWeight: Typography.fontWeight[fontWeight] as any },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  h1: {
    fontSize: Typography.fontSize['4xl'],
    fontWeight: Typography.fontWeight.bold as any,
  },
  h2: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.bold as any,
  },
  h3: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.semiBold as any,
  },
  body: {
    fontSize: Typography.fontSize.md,
  },
  caption: {
    fontSize: Typography.fontSize.sm,
  },
});
