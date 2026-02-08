import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, User } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  Ranking: undefined;
};

type RankingScreenProps = NativeStackScreenProps<RootStackParamList, 'Ranking'>;

// Mock data for rankings
const MOCK_RANKINGS = [
  { id: 1, rank: 1, name: 'TopPlayer', rating: 2850 },
  { id: 2, rank: 2, name: 'ProGamer', rating: 2720 },
  { id: 3, rank: 3, name: 'OthelloMaster', rating: 2680 },
  { id: 4, rank: 4, name: 'StrategyKing', rating: 2550 },
  { id: 5, rank: 5, name: 'BoardWizard', rating: 2420 },
];

const MY_RANK = { rank: 42, name: 'Player001', rating: 1850 };

export const RankingScreen = ({ navigation }: RankingScreenProps) => {
  const [currentPage, setCurrentPage] = React.useState(1);

  const renderRankingItem = (item: typeof MOCK_RANKINGS[0], index: number) => (
    <View key={item.id} style={[styles.rankingItem, index !== MOCK_RANKINGS.length - 1 && styles.rankingItemMargin]}>
      {/* Rank */}
      <Text style={styles.rankNumber}>{item.rank}</Text>

      {/* Avatar */}
      <View style={styles.avatar}>
        <User size={20} color={COLORS.background} strokeWidth={2} />
      </View>

      {/* User Info */}
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userRating}>Rating: {item.rating}</Text>
      </View>
    </View>
  );

  const renderPageItem = (pageNum: number, isActive: boolean) => (
    <TouchableOpacity
      key={pageNum}
      style={[styles.pageItem, isActive && styles.pageItemActive]}
      onPress={() => setCurrentPage(pageNum)}
      activeOpacity={0.7}
    >
      <Text style={[styles.pageItemText, isActive && styles.pageItemTextActive]}>
        {pageNum}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft size={24} color={COLORS.text} strokeWidth={2} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>ランキング</Text>

        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* My Rank Card */}
        <View style={styles.myRankCard}>
          <Text style={styles.myRankNumber}>{MY_RANK.rank}</Text>

          <View style={styles.myRankAvatar}>
            <User size={24} color={COLORS.background} strokeWidth={2} />
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.myRankName}>{MY_RANK.name} (自分)</Text>
            <Text style={styles.myRankRating}>Rating: {MY_RANK.rating}</Text>
          </View>
        </View>

        {/* Ranking List */}
        <View style={styles.rankingList}>
          {MOCK_RANKINGS.map((item, index) => renderRankingItem(item, index))}
        </View>

        {/* Pagination */}
        <View style={styles.pagination}>
          {renderPageItem(1, currentPage === 1)}
          <View style={styles.paginationSpacer} />
          {renderPageItem(2, currentPage === 2)}
          <View style={styles.paginationSpacer} />
          {renderPageItem(3, currentPage === 3)}
          <View style={styles.paginationSpacer} />
          <Text style={styles.pageEllipsis}>...</Text>
          <View style={styles.paginationSpacer} />
          {renderPageItem(10, currentPage === 10)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Design values from Pencil
const COLORS = {
  background: '#0A0F1C',
  card: '#1E293B',
  primary: '#22D3EE',
  text: '#FFFFFF',
  textSecondary: '#64748B',
  tabActive: '#22D3EE',
  tabInactive: '#475569',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600' as any,
    color: COLORS.text,
  },
  headerPlaceholder: {
    width: 24,
    height: 24,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  // My Rank Card
  myRankCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  myRankNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.background,
    textAlign: 'center',
    width: 30,
    marginRight: 12,
  },
  myRankAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  myRankName: {
    fontSize: 14,
    fontWeight: '600' as any,
    color: COLORS.background,
  },
  myRankRating: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.background,
    opacity: 0.8,
    marginTop: 2,
  },
  // Ranking List
  rankingList: {
    marginBottom: 16,
  },
  rankingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  rankingItemMargin: {
    marginBottom: 8,
  },
  rankNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
    textAlign: 'center',
    width: 24,
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600' as any,
    color: COLORS.text,
  },
  userRating: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  // Pagination
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  paginationSpacer: {
    width: 8,
  },
  pageItem: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageItemActive: {
    backgroundColor: COLORS.primary,
  },
  pageItemText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
  },
  pageItemTextActive: {
    color: COLORS.background,
    fontWeight: '600' as any,
  },
  pageEllipsis: {
    fontSize: 14,
    color: COLORS.tabInactive,
  },
});
