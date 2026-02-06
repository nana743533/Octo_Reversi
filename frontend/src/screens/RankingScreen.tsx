import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, ThemedText } from '../components';
import { Colors, Spacing } from '../constants';
import { mockRankingPlayers } from '../data/mockData';

export const RankingScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText variant="h2" color="text">
            ランキング
          </ThemedText>
        </View>

        {/* Ranking List */}
        <View style={styles.rankingList}>
          {mockRankingPlayers.map((player, index) => (
            <Card
              key={player.rank}
              style={[
                styles.rankingCard,
                index === 0 && styles.rank1Card,
                index === 1 && styles.rank2Card,
                index === 2 && styles.rank3Card,
              ]}
            >
              <View style={styles.rankInfo}>
                <ThemedText variant="h3" color={index < 3 ? 'text' : 'textSecondary'}>
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${player.rank}`}
                </ThemedText>
              </View>
              <View style={styles.playerInfo}>
                <ThemedText variant="body" color="text" fontWeight="semiBold">
                  {player.name}
                </ThemedText>
                <ThemedText variant="caption" color={index < 3 ? 'primaryDark' : 'textSecondary'}>
                  {player.rating}pt • 勝率{player.winRate}%
                </ThemedText>
              </View>
              <ThemedText
                variant="h3"
                color={index < 3 ? (index === 0 ? 'background' : 'primary') : 'primary'}
                fontWeight="bold"
              >
                {player.rating}
              </ThemedText>
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
  rankingList: {
    gap: Spacing.md,
  },
  rankingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.lg,
  },
  rank1Card: {
    backgroundColor: Colors.primary,
  },
  rank2Card: {
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.primaryDark,
  },
  rank3Card: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.primaryDark,
  },
  rankInfo: {
    width: 40,
    alignItems: 'center',
  },
  playerInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
});
