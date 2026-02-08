import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import * as React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
  // エラー時の詳細表示を有効化
  errorBoundary: true,
};

// 詳細なエラー表示コンポーネント
function ErrorFallback({ error, resetError }: { error: Error; resetError: () => void }) {
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorTitle}>⚠️ エラーが発生しました</Text>
      <ScrollView style={styles.errorScroll}>
        <Text style={styles.errorMessage}>{error.message}</Text>
        <Text style={styles.errorLabel}>スタックトレース:</Text>
        <Text style={styles.errorStack}>{error.stack}</Text>
      </ScrollView>
      <Text style={styles.resetHint}>再読み込みしてリセット</Text>
    </View>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          // スクリーンごとのエラー表示を有効化
          errorBoundary: true,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
    justifyContent: 'center',
  },
  errorScroll: {
    flex: 1,
    marginVertical: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF4444',
    textAlign: 'center',
    marginBottom: 20,
  },
  errorMessage: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  errorLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFF00',
    marginTop: 20,
    marginBottom: 10,
  },
  errorStack: {
    fontSize: 12,
    color: '#CCCCCC',
    fontFamily: 'monospace',
  },
  resetHint: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    marginTop: 20,
  },
});

