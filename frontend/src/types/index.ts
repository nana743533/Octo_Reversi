export interface Player {
  id: string;
  name: string;
  rank: number;
  rating: number;
  level: number;
  wins: number;
  losses: number;
  winRate: number;
  avatar?: string;
}

export interface RankingPlayer {
  rank: number;
  name: string;
  rating: number;
  winRate: number;
}

export interface Match {
  id: string;
  date: string;
  result: 'win' | 'loss' | 'draw';
  playerScore: number;
  opponentScore: number;
  opponent: Player;
}

export interface Room {
  id: string;
  name: string;
  status: 'playing' | 'waiting' | 'empty';
  player1?: Player;
  player2?: Player;
  spectators: number;
}

export interface GameBoard {
  size: 8;
  cells: CellState[][];
  currentPlayer: 'black' | 'white';
  blackScore: number;
  whiteScore: number;
}

export type CellState = 'empty' | 'black' | 'white';
