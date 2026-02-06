import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, ThemedText } from '../components';
import { Colors, Spacing } from '../constants';
import { mockCurrentUser } from '../data/mockData';

export const RoomWaitingScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Room Info */}
        <Card style={styles.roomInfoCard}>
          <ThemedText variant="h2" color="text" style={styles.roomTitle}>
            ルーム: KODOH #001
          </ThemedText>
          <View style={styles.statusContainer}>
            <View style={styles.statusDot} />
            <ThemedText variant="body" color="primary">
              対戦相手を待っています...
            </ThemedText>
          </View>
        </Card>

        {/* Players List */}
        <View style={styles.playersList}>
          {/* Player 1 - You */}
          <Card style={styles.playerCard}>
            <View style={styles.playerAvatar}>
              <ThemedText variant="h3" color="background">
                {mockCurrentUser.name.charAt(0)}
              </ThemedText>
            </View>
            <View style={styles.playerInfo}>
              <ThemedText variant="body" color="text" fontWeight="semiBold">
                {mockCurrentUser.name} (あなた)
              </ThemedText>
              <ThemedText variant="caption" color="textSecondary">
                ランク: #{mockCurrentUser.rank} • レート: {mockCurrentUser.rating}
              </ThemedText>
            </View>
            <ThemedText variant="body" color="primary">
              ✓ 準備完了
            </ThemedText>
          </Card>

          {/* Empty Slot */}
          <Card style={[styles.playerCard, styles.emptySlot]}>
            <View style={[styles.playerAvatar, styles.emptyAvatar]} />
            <View style={styles.playerInfo}>
              <ThemedText variant="body" color="textSecondary">
                対戦相手を待っています...
              </ThemedText>
              <ThemedText variant="caption" color="primary">
                マッチング中
              </ThemedText>
            </View>
          </Card>
        </View>

        {/* Room Rules */}
        <Card style={styles.rulesCard}>
          <ThemedText variant="h3" color="text" style={styles.rulesTitle}>
            ルール
          </ThemedText>
          <View style={styles.ruleItem}>
            <ThemedText variant="caption" color="textSecondary">
              • オセロ/リバーシルール
            </ThemedText>
          </View>
          <View style={styles.ruleItem}>
            <ThemedText variant="caption" color="textSecondary">
              • 8マスラインを先に完成した方が勝利
            </ThemedText>
          </View>
          <View style={styles.ruleItem}>
            <ThemedText variant="caption" color="textSecondary">
              • 思考時間: 5分
            </ThemedText>
          </View>
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
  roomInfoCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  roomTitle: {
    marginBottom: Spacing.md,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  playersList: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.lg,
  },
  playerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyAvatar: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.card,
  },
  playerInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  emptySlot: {
    backgroundColor: Colors.backgroundDark,
    borderWidth: 2,
    borderColor: Colors.card,
  },
  rulesCard: {
    padding: Spacing.lg,
  },
  rulesTitle: {
    marginBottom: Spacing.md,
  },
  ruleItem: {
    marginBottom: Spacing.xs,
  },
});
