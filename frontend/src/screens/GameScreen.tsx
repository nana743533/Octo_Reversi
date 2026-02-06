import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, ThemedText } from '../components';
import { Colors, Spacing } from '../constants';
import { mockCurrentUser } from '../data/mockData';

export const GameScreen: React.FC = () => {
  // Mock game state
  const gameState = {
    currentPlayer: 'black' as const,
    blackScore: 28,
    whiteScore: 24,
    remainingTime: '05:32',
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Game Info */}
        <Card style={styles.gameInfoCard}>
          <View style={styles.turnInfo}>
            <ThemedText variant="caption" color="textSecondary">
              現在の手番
            </ThemedText>
            <ThemedText variant="body" color="primary" fontWeight="semiBold">
              ● あなた (黒)
            </ThemedText>
          </View>

          <View style={styles.scorePanel}>
            <View style={styles.scoreBox}>
              <ThemedText variant="body" color="text">
                ● 黒
              </ThemedText>
              <ThemedText variant="h2" color="primary" fontWeight="bold">
                {gameState.blackScore}
              </ThemedText>
            </View>
            <View style={styles.scoreBox}>
              <ThemedText variant="body" color="text">
                ○ 白
              </ThemedText>
              <ThemedText variant="h2" color="text" fontWeight="bold">
                {gameState.whiteScore}
              </ThemedText>
            </View>
          </View>

          <View style={styles.timerPanel}>
            <Card style={styles.timerBox}>
              <ThemedText variant="caption" color="textSecondary">
                残り時間
              </ThemedText>
              <ThemedText variant="h3" color="primary" fontWeight="bold">
                {gameState.remainingTime}
              </ThemedText>
            </Card>
          </View>
        </Card>

        {/* Game Board */}
        <Card style={styles.boardCard}>
          <ThemedText variant="h3" color="text" style={styles.boardTitle}>
            ゲーム盤面
          </ThemedText>
          <View style={styles.board}>
            {Array(8)
              .fill(0)
              .map((_, row) => (
                <View key={row} style={styles.boardRow}>
                  {Array(8)
                    .fill(0)
                    .map((_, col) => {
                      // Mock: Center pieces
                      const isCenter =
                        (row === 3 && col === 3) ||
                        (row === 3 && col === 4) ||
                        (row === 4 && col === 3) ||
                        (row === 4 && col === 4);
                      const isBlack = (row === 4 && col === 3) || (row === 3 && col === 4);
                      const isWhite = (row === 3 && col === 3) || (row === 4 && col === 4);

                      return (
                        <View
                          key={`${row}-${col}`}
                          style={[
                            styles.cell,
                            isCenter && styles.centerCell,
                          ]}
                        >
                          {(isBlack || isWhite) && (
                            <View
                              style={[
                                styles.piece,
                                isBlack && styles.blackPiece,
                                isWhite && styles.whitePiece,
                              ]}
                            />
                          )}
                        </View>
                      );
                    })}
                </View>
              ))}
          </View>
        </Card>

        {/* Opponent Info */}
        <Card style={styles.opponentCard}>
          <ThemedText variant="h3" color="text" style={styles.cardTitle}>
            対戦相手
          </ThemedText>
          <View style={styles.opponentInfo}>
            <View style={styles.opponentAvatar}>
              <ThemedText variant="h3" color="text">
                O
              </ThemedText>
            </View>
            <View style={styles.opponentDetails}>
              <ThemedText variant="body" color="text" fontWeight="semiBold">
                OctoKing
              </ThemedText>
              <ThemedText variant="caption" color="textSecondary">
                ランク: #1 • レート: 2450
              </ThemedText>
            </View>
          </View>
        </Card>

        {/* Spectators */}
        <Card style={styles.spectatorsCard}>
          <ThemedText variant="h3" color="text" style={styles.cardTitle}>
            観戦者 (3人)
          </ThemedText>
          {['Viewer1', 'Viewer2', 'Viewer3'].map((viewer, index) => (
            <View key={index} style={styles.spectatorItem}>
              <View style={styles.spectatorAvatar}>
                <ThemedText variant="body" color="text">
                  {viewer.charAt(0)}
                </ThemedText>
              </View>
              <ThemedText variant="body" color="text">
                {viewer}
              </ThemedText>
              <ThemedText variant="caption" color="primary">
                {1400 + index * 50}
              </ThemedText>
            </View>
          ))}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
    padding: Spacing.lg,
  },
  gameInfoCard: {
    gap: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  turnInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.card,
    borderRadius: 8,
  },
  scorePanel: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: Spacing.lg,
    backgroundColor: Colors.card,
    borderRadius: 12,
  },
  scoreBox: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  timerPanel: {
    alignItems: 'center',
  },
  timerBox: {
    alignItems: 'center',
    gap: Spacing.xs,
    padding: Spacing.md,
    backgroundColor: Colors.card,
    borderRadius: 8,
  },
  boardCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  boardTitle: {
    marginBottom: Spacing.md,
  },
  board: {
    backgroundColor: Colors.board,
    borderRadius: 8,
    overflow: 'hidden',
  },
  boardRow: {
    flexDirection: 'row',
  },
  cell: {
    width: 40,
    height: 40,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerCell: {
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
  },
  piece: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  blackPiece: {
    backgroundColor: Colors.black,
    borderWidth: 1,
    borderColor: Colors.white,
  },
  whitePiece: {
    backgroundColor: Colors.white,
  },
  opponentCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  cardTitle: {
    marginBottom: Spacing.md,
  },
  opponentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  opponentAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  opponentDetails: {
    flex: 1,
    gap: Spacing.xs,
  },
  spectatorsCard: {
    padding: Spacing.lg,
  },
  spectatorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  spectatorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
