import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Button, ThemedText } from '../components';
import { Colors, Spacing } from '../constants';

export const RoomSeatSelectScreen: React.FC = () => {
  const [selectedSeat, setSelectedSeat] = React.useState<number | null>(null);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Room Info */}
        <Card style={styles.roomInfoCard}>
          <ThemedText variant="h2" color="text" style={styles.roomTitle}>
            ルーム: KODOH #002
          </ThemedText>
          <ThemedText variant="body" color="textSecondary">
            座席（陣営）を選択してください
          </ThemedText>
        </Card>

        {/* Seat Options */}
        <View style={styles.seatList}>
          {/* Seat 1 - Black (First) */}
          <Card
            style={[
              styles.seatCard,
              selectedSeat === 1 && styles.selectedSeat,
            ]}
          >
            <View style={styles.seatIcon}>
              <ThemedText variant="h1" color="primary">
                ●
              </ThemedText>
            </View>
            <View style={styles.seatInfo}>
              <ThemedText variant="h3" color="text" fontWeight="semiBold">
                陣営1（黒）・先手
              </ThemedText>
              <ThemedText variant="caption" color="textSecondary">
                最初に着手できます
              </ThemedText>
            </View>
          </Card>

          {/* Seat 2 - White (Second) */}
          <Card
            style={[
              styles.seatCard,
              selectedSeat === 2 && styles.selectedSeat,
            ]}
          >
            <View style={styles.seatIcon}>
              <ThemedText variant="h1" color="text">
                ○
              </ThemedText>
            </View>
            <View style={styles.seatInfo}>
              <ThemedText variant="h3" color="text" fontWeight="semiBold">
                陣営2（白）・後手
              </ThemedText>
              <ThemedText variant="caption" color="textSecondary">
                相手の着手に応じて戦います
              </ThemedText>
            </View>
          </Card>
        </View>

        {/* Seat Description */}
        <Card style={styles.descriptionCard}>
          <ThemedText variant="h3" color="text" style={styles.descTitle}>
            陣営について
          </ThemedText>
          <View style={styles.descItem}>
            <ThemedText variant="caption" color="textSecondary">
              • 黒（先手）：ゲーム開始時に最初に石を置けます
            </ThemedText>
          </View>
          <View style={styles.descItem}>
            <ThemedText variant="caption" color="textSecondary">
              • 白（後手）：相手の石を挟んで反撃します
            </ThemedText>
          </View>
          <View style={styles.descItem}>
            <ThemedText variant="caption" color="textSecondary">
              • 両陣営とも勝利条件は同じです
            </ThemedText>
          </View>
        </Card>

        {/* Action Button */}
        <View style={styles.buttonContainer}>
          <Button
            title="ゲームを開始"
            onPress={() => {}}
            variant="primary"
            disabled={!selectedSeat}
            style={styles.startButton}
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
  roomInfoCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    alignItems: 'center',
  },
  roomTitle: {
    marginBottom: Spacing.sm,
  },
  seatList: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  seatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.lg,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedSeat: {
    borderColor: Colors.primary,
  },
  seatIcon: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seatInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  descriptionCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  descTitle: {
    marginBottom: Spacing.md,
  },
  descItem: {
    marginBottom: Spacing.xs,
  },
  buttonContainer: {
    paddingHorizontal: Spacing.lg,
  },
  startButton: {
    marginBottom: Spacing.xl,
  },
});
