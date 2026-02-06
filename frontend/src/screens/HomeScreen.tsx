import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, ThemedText } from '../components';
import { Colors, Spacing, Typography } from '../constants';
import { mockAnnouncements, mockTodayStats, mockCurrentUser } from '../data/mockData';

export const HomeScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText variant="h2" color="text">
            オクト対戦
          </ThemedText>
          <ThemedText variant="caption" color="textSecondary">
            OCTO BATTLE
          </ThemedText>
        </View>

        {/* Welcome Section */}
        <View style={styles.section}>
          <ThemedText variant="h3" color="text">
            ようこそ、{mockCurrentUser.name}さん！
          </ThemedText>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <Card style={styles.statsCard}>
            <ThemedText variant="caption" color="textSecondary">
              今日の勝利
            </ThemedText>
            <ThemedText variant="h2" color="primary">
              {mockTodayStats.wins}
            </ThemedText>
          </Card>
          <Card style={styles.statsCard}>
            <ThemedText variant="caption" color="textSecondary">
              連勝記録
            </ThemedText>
            <ThemedText variant="h2" color="primary">
              {mockTodayStats.winningStreak}
            </ThemedText>
          </Card>
          <Card style={styles.statsCard}>
            <ThemedText variant="caption" color="textSecondary">
              総試合数
            </ThemedText>
            <ThemedText variant="h2" color="primary">
              {mockTodayStats.totalMatches}
            </ThemedText>
          </Card>
        </View>

        {/* Action Buttons */}
        <View style={styles.section}>
          <Button
            title="マッチング"
            onPress={() => {}}
            variant="primary"
            style={styles.actionButton}
          />
          <Button
            title="ルームに入る"
            onPress={() => {}}
            variant="secondary"
            style={styles.actionButton}
          />
        </View>

        {/* Announcements */}
        <View style={styles.section}>
          <ThemedText variant="h3" color="text" style={styles.sectionTitle}>
            📢 お知らせ
          </ThemedText>
          {mockAnnouncements.map((announcement) => (
            <Card key={announcement.id} style={styles.announcementCard}>
              <ThemedText variant="body" color="text" fontWeight="semiBold">
                {announcement.title}
              </ThemedText>
              <ThemedText variant="caption" color="textSecondary" style={styles.announcementDesc}>
                {announcement.description}
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
    paddingVertical: Spacing.xl,
  },
  section: {
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  statsCard: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.md,
  },
  actionButton: {
    marginBottom: Spacing.md,
  },
  announcementCard: {
    marginBottom: Spacing.md,
  },
  announcementDesc: {
    marginTop: Spacing.xs,
  },
});
