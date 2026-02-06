import { Player, RankingPlayer, Match, Room } from '../types';

export const mockCurrentUser: Player = {
  id: '1',
  name: 'Player001',
  rank: 42,
  rating: 1580,
  level: 5,
  wins: 128,
  losses: 64,
  winRate: 66.7,
};

export const mockRankingPlayers: RankingPlayer[] = [
  { rank: 1, name: 'OctoKing', rating: 2450, winRate: 78 },
  { rank: 2, name: 'ReversiMaster', rating: 2380, winRate: 75 },
  { rank: 3, name: 'BoardShark', rating: 2290, winRate: 72 },
  { rank: 4, name: 'StrategyPro', rating: 2150, winRate: 70 },
  { rank: 5, name: 'CornerKing', rating: 2080, winRate: 68 },
  { rank: 6, name: 'EdgeLord', rating: 2020, winRate: 65 },
  { rank: 7, name: 'CenterControl', rating: 1980, winRate: 63 },
  { rank: 8, name: 'FlipMaster', rating: 1920, winRate: 61 },
  { rank: 9, name: 'OctoQueen', rating: 1880, winRate: 59 },
  { rank: 10, name: 'ReversiNinja', rating: 1820, winRate: 57 },
];

export const mockMatches: Match[] = [
  {
    id: '1',
    date: '2月5日 14:30',
    result: 'win',
    playerScore: 36,
    opponentScore: 18,
    opponent: { id: '2', name: 'OctoKing', rank: 1, rating: 2450, level: 10, wins: 200, losses: 50, winRate: 80 },
  },
  {
    id: '2',
    date: '2月5日 13:15',
    result: 'loss',
    playerScore: 22,
    opponentScore: 34,
    opponent: { id: '3', name: 'ReversiMaster', rank: 2, rating: 2380, level: 9, wins: 180, losses: 60, winRate: 75 },
  },
  {
    id: '3',
    date: '2月4日 20:45',
    result: 'win',
    playerScore: 40,
    opponentScore: 14,
    opponent: { id: '4', name: 'BoardShark', rank: 3, rating: 2290, level: 8, wins: 160, losses: 70, winRate: 72 },
  },
  {
    id: '4',
    date: '2月4日 18:20',
    result: 'win',
    playerScore: 32,
    opponentScore: 28,
    opponent: { id: '5', name: 'StrategyPro', rank: 4, rating: 2150, level: 7, wins: 140, losses: 80, winRate: 70 },
  },
  {
    id: '5',
    date: '2月3日 16:10',
    result: 'loss',
    playerScore: 18,
    opponentScore: 40,
    opponent: { id: '6', name: 'CornerKing', rank: 5, rating: 2080, level: 7, wins: 130, losses: 90, winRate: 68 },
  },
];

export const mockRooms: Room[] = [
  {
    id: '1',
    name: 'KODOH #001',
    status: 'playing',
    player1: mockCurrentUser,
    player2: { id: '2', name: 'OctoKing', rank: 1, rating: 2450, level: 10, wins: 200, losses: 50, winRate: 80 },
    spectators: 3,
  },
  {
    id: '2',
    name: 'KODOH #002',
    status: 'waiting',
    player1: { id: '7', name: 'NewUser', rank: 100, rating: 1200, level: 1, wins: 10, losses: 10, winRate: 50 },
    spectators: 1,
  },
  {
    id: '3',
    name: 'KODOH #003',
    status: 'empty',
    spectators: 0,
  },
  {
    id: '4',
    name: 'KODOH #004',
    status: 'waiting',
    player1: { id: '8', name: 'ProPlayer', rank: 20, rating: 1800, level: 6, wins: 80, losses: 40, winRate: 66 },
    spectators: 2,
  },
  {
    id: '5',
    name: 'KODOH #005',
    status: 'playing',
    player1: { id: '9', name: 'ReversiMaster', rank: 2, rating: 2380, level: 9, wins: 180, losses: 60, winRate: 75 },
    player2: { id: '10', name: 'BoardShark', rank: 3, rating: 2290, level: 8, wins: 160, losses: 70, winRate: 72 },
    spectators: 5,
  },
];

export const mockAnnouncements = [
  {
    id: '1',
    title: '🎉 シーズン5開催中！',
    description: '新シーズンが始まりました。ランキングに参加して報酬をゲット！',
  },
  {
    id: '2',
    title: '📊 ランキング更新',
    description: '今週のランキングが更新されました。自分の順位をチェック！',
  },
  {
    id: '3',
    title: '🎁 ログインボーナー',
    description: '連続ログインで報酬を獲得！',
  },
];

export const mockTodayStats = {
  wins: 3,
  winningStreak: 5,
  totalMatches: 192,
};
