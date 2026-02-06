export const Colors = {
  // Background colors
  background: '#121827',
  backgroundDark: '#0A0F1C',
  card: '#1E2834',

  // Accent colors
  primary: '#00E5FF',
  primaryDark: '#00B8CC',
  primaryLight: '#6FFFFF',

  // Text colors
  text: '#FFFFFF',
  textSecondary: '#B0BEC5',
  textMuted: '#6B7A8C',

  // Status colors
  success: '#00E5FF',
  error: '#FF5252',
  warning: '#FFA726',

  // Game colors
  black: '#121827',
  white: '#FFFFFF',
  board: '#2D4A3E',

  // Border
  border: '#1E2834',
  borderLight: '#2D3A4A',
} as const;

export type Colors = typeof Colors;
