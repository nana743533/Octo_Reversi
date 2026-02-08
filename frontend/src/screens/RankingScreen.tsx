import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, Typography } from '../constants';
import { Card } from '../components';

interface Player {
  id: string;
  name: string;
  rank: number;
  wins: number;
  losses: number;
  winRate: number;
  points: number;
}

const mockPlayers: Player[] = [
  { id: '1', name: 'オクタンマスター', rank: 1, wins: 142, losses: 23, winRate: 86.1, points: 2840 },
  { id: '2', name: 'イカキング', rank: 2, wins: 128, losses: 31, winRate: 80.5, points: 2650 },
  { id: '3', name: 'タコ名人', rank: 3, wins: 115, losses: 28, winRate: 80.4, points: 2580 },
  { id: '4', name: 'あなた', rank: 4, wins: 89, losses: 45, winRate: 66.4, points: 2230 },
  { id: '5', name: 'カツオ王子', rank: 5, wins: 92, losses: 52, winRate: 63.9, points: 2150 },
];

export const RankingScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>ランキング</Text>
        <Text style={styles.subtitle}>全球プレイヤー順位</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, styles.tabActive]}>
          <Text style={[styles.tabText, styles.tabTextActive]}>全球</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>友達</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>週間</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Top 3 Players */}
        <View style={styles.topPlayers}>
          {mockPlayers.slice(0, 3).map((player, index) => (
            <Card key={player.id} style={styles.topCard}>
              <View style={styles.topRankBadge}>
                <Text style={styles.topRankText}>#{player.rank}</Text>
              </View>
              <View style={styles.topAvatar}>
                <Text style={styles.topAvatarText}>{player.name[0]}</Text>
              </View>
              <Text style={styles.topName}>{player.name}</Text>
              <Text style={styles.topPoints}>{player.points.toLocaleString()}pt</Text>
            </Card>
          ))}
        </View>

        {/* Ranking List */}
        <View style={styles.listContainer}>
          {mockPlayers.map((player) => (
            <Card key={player.id} style={styles.playerCard}>
              <View style={styles.playerRank}>
                <Text style={[styles.playerRankText, player.rank <= 3 && styles.playerRankTop]}>
                  #{player.rank}
                </Text>
              </View>
              <View style={styles.playerInfo}>
                <Text style={styles.playerName}>{player.name}</Text>
                <View style={styles.playerStats}>
                  <Text style={styles.playerStatText}>{player.wins}勝 {player.losses}敗</Text>
                  <Text style={styles.playerWinRate}>({player.winRate}%)</Text>
                </View>
              </View>
              <View style={styles.playerPoints}>
                <Text style={styles.playerPointsText}>{player.points.toLocaleString()}</Text>
                <Text style={styles.playerPointsLabel}>pt</Text>
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
  header: {
    padding: Spacing.lg,
    backgroundColor: Colors.backgroundLight,
  },
  title: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
  },
  subtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundLight,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: BorderRadius.md,
  },
  tabActive: {
    backgroundColor: Colors.backgroundCard,
  },
  tabText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.text,
  },
  scrollView: {
    flex: 1,
    padding: Spacing.lg,
  },
  topPlayers: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  topCard: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.md,
  },
  topRankBadge: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  topRankText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
  },
  topAvatar: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  topAvatarText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
  },
  topName: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  topPoints: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.primary,
  },
  listContainer: {
    gap: Spacing.sm,
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  playerRank: {
    width: 48,
    alignItems: 'center',
  },
  playerRankText: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textMuted,
  },
  playerRankTop: {
    color: Colors.primary,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  playerStats: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  playerStatText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
  },
  playerWinRate: {
    fontSize: Typography.fontSize.xs,
    color: Colors.accentGreen,
    fontWeight: Typography.fontWeight.medium,
  },
  playerPoints: {
    alignItems: 'flex-end',
  },
  playerPointsText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
  },
  playerPointsLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textMuted,
  },
});
