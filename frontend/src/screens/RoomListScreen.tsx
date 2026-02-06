import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Button, ThemedText } from '../components';
import { Colors, Spacing } from '../constants';
import { mockRooms } from '../data/mockData';

export const RoomListScreen: React.FC = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'playing':
        return Colors.primary;
      case 'waiting':
        return Colors.warning;
      case 'empty':
        return Colors.textSecondary;
      default:
        return Colors.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'playing':
        return '対戦中';
      case 'waiting':
        return '待機中';
      case 'empty':
        return '空室';
      default:
        return status;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <ThemedText variant="h2" color="text">
              ルーム一覧
            </ThemedText>
            <ThemedText variant="caption" color="textSecondary">
              参加可能なルーム
            </ThemedText>
          </View>
          <Button title="作成" onPress={() => {}} variant="primary" style={styles.createButton} />
        </View>

        {/* Room List */}
        <View style={styles.roomList}>
          {mockRooms.map((room) => (
            <Card key={room.id} style={styles.roomCard}>
              <View style={styles.roomHeader}>
                <ThemedText variant="body" color="textSecondary" fontWeight="semiBold">
                  {room.name}
                </ThemedText>
                <ThemedText variant="caption" color="textSecondary">
                  {room.id}
                </ThemedText>
              </View>
              <View style={styles.roomStatus}>
                <View style={styles.statusDot} style={{ backgroundColor: getStatusColor(room.status) }} />
                <ThemedText variant="body" color={getStatusColor(room.status) === Colors.primary ? 'primary' : 'text'}>
                  {getStatusText(room.status)}
                </ThemedText>
              </View>
              <View style={styles.roomPlayers}>
                <View style={styles.playerSlot}>
                  <ThemedText variant="caption" color="textSecondary">
                    陣営1
                  </ThemedText>
                  <ThemedText variant="body" color="text" fontWeight="semiBold">
                    {room.player1 ? room.player1.name : '...'}
                  </ThemedText>
                  {room.player1 && (
                    <ThemedText variant="caption" color="primary">
                      {room.player1.rating}
                    </ThemedText>
                  )}
                </View>
                <ThemedText variant="h3" color="textSecondary">
                  VS
                </ThemedText>
                <View style={styles.playerSlot}>
                  <ThemedText variant="caption" color="textSecondary">
                    陣営2
                  </ThemedText>
                  <ThemedText variant="body" color="text" fontWeight="semiBold">
                    {room.player2 ? room.player2.name : '...'}
                  </ThemedText>
                  {room.player2 && (
                    <ThemedText variant="caption" color="primary">
                      {room.player2.rating}
                    </ThemedText>
                  )}
                </View>
              </View>
              {room.spectators > 0 && (
                <ThemedText variant="caption" color="textSecondary" style={styles.spectators}>
                  👁 観戦者: {room.spectators}人
                </ThemedText>
              )}
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
  headerContent: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  createButton: {
    minWidth: 100,
  },
  roomList: {
    gap: Spacing.md,
  },
  roomCard: {
    gap: Spacing.md,
  },
  roomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roomStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  roomPlayers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  playerSlot: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  spectators: {
    textAlign: 'center',
  },
});
