import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, ThemedText } from '../components';
import { Colors, Spacing } from '../constants';
import { mockMatches, mockCurrentUser } from '../data/mockData';

export const MatchHistoryScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText variant="h2" color="text">
            対戦履歴
          </ThemedText>
        </View>

        {/* Match List */}
        <View style={styles.matchList}>
          {mockMatches.map((match) => (
            <Card key={match.id} style={styles.matchCard}>
              <View style={styles.matchHeader}>
                <ThemedText
                  variant="body"
                  color={match.result === 'win' ? 'primary' : 'error'}
                  fontWeight="bold"
                >
                  {match.result === 'win' ? '🏆 勝利' : '💀 敗北'}
                </ThemedText>
                <ThemedText variant="caption" color="textSecondary">
                  {match.date}
                </ThemedText>
              </View>
              <View style={styles.matchContent}>
                <View style={styles.playerSection}>
                  <ThemedText variant="body" color="text" fontWeight="semiBold">
                    {mockCurrentUser.name} (あなた)
                  </ThemedText>
                  <ThemedText
                    variant="h3"
                    color={match.result === 'win' ? 'primary' : 'textSecondary'}
                    fontWeight="bold"
                  >
                    {match.playerScore} - {match.opponentScore}
                  </ThemedText>
                </View>
                <ThemedText variant="caption" color="textSecondary">
                  vs
                </ThemedText>
                <View style={styles.playerSection}>
                  <ThemedText variant="body" color="text" fontWeight="semiBold">
                    {match.opponent.name}
                  </ThemedText>
                  <ThemedText
                    variant="h3"
                    color={match.result === 'loss' ? 'primary' : 'textSecondary'}
                    fontWeight="bold"
                  >
                    {match.opponentScore} - {match.playerScore}
                  </ThemedText>
                </View>
              </View>
            </Card>
          ))}
        </View>
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
  header: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  matchList: {
    gap: Spacing.md,
  },
  matchCard: {
    gap: Spacing.md,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  matchContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.md,
  },
  playerSection: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.xs,
  },
});
