import React from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Button, ThemedText } from '../components';
import { Colors, Spacing } from '../constants';
import { mockCurrentUser } from '../data/mockData';

export const MyPageScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText variant="h2" color="text">
            マイページ
          </ThemedText>
        </View>

        {/* Profile Card */}
        <Card style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <ThemedText variant="h3" color="background">
                {mockCurrentUser.name.charAt(0)}
              </ThemedText>
            </View>
          </View>
          <ThemedText variant="h3" color="text" style={styles.userName}>
            {mockCurrentUser.name}
          </ThemedText>
          <View style={styles.scoreBadge}>
            <ThemedText variant="body" color="background" fontWeight="semiBold">
              {mockCurrentUser.rating}
            </ThemedText>
          </View>
        </Card>

        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <ThemedText variant="caption" color="textSecondary">
              順位
            </ThemedText>
            <ThemedText variant="h2" color="text">
              #{mockCurrentUser.rank}
            </ThemedText>
          </Card>
          <Card style={styles.statCard}>
            <ThemedText variant="caption" color="textSecondary">
              勝敗
            </ThemedText>
            <ThemedText variant="h2" color="text">
              {mockCurrentUser.wins}-{mockCurrentUser.losses}
            </ThemedText>
          </Card>
          <Card style={styles.statCard}>
            <ThemedText variant="caption" color="textSecondary">
              レベル
            </ThemedText>
            <ThemedText variant="h2" color="text">
              {mockCurrentUser.level}
            </ThemedText>
          </Card>
        </View>

        {/* Action Buttons */}
        <View style={styles.section}>
          <Button
            title="ランキングを見る"
            onPress={() => {}}
            variant="secondary"
            style={styles.actionButton}
          />
          <Button
            title="対戦履歴を見る"
            onPress={() => {}}
            variant="secondary"
            style={styles.actionButton}
          />
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
  profileCard: {
    alignItems: 'center',
    padding: Spacing.xl,
  },
  avatarContainer: {
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    marginBottom: Spacing.sm,
  },
  scoreBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs,
    borderRadius: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.lg,
  },
  section: {
    marginTop: Spacing.xl,
  },
  actionButton: {
    marginBottom: Spacing.md,
  },
});
