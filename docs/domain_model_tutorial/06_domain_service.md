# ステップ6: ドメインサービス

## 学習目標

- ドメインサービスの定義と用途を理解する
- エンティティ/値オブジェクトとドメインサービスの使い分けを学ぶ
- オクト対戦ゲームでのドメインサービス例を理解する

---

## 6.1 ドメインサービスとは

**ドメインサービス** は、**エンティティや値オブジェクトに自然に属さないドメインロジック**を担当します。

### なぜ必要か

次のロジックを考えてみてください：

```typescript
// 合法手の計算
// これはどのクラスの責務か？

class Board {
  // Boardの責務？
  calculateLegalMoves(color: StoneColor): Coordinate[] {
    // 盤面状態が必要だが、ルールに関する知識も必要
  }
}

class Room {
  // Roomの責務？
  calculateLegalMoves(color: StoneColor): Coordinate[] {
    // Roomはマッチングと試合状態管理が責務
  }
}

class Stone {
  // Stoneの責務？
  calculateLegalMoves(): Coordinate[] {
    // 石は単に色を表すだけ
  }
}
```

このように、**どのエンティティ/値オブジェクトにも自然に属さないロジック**があります。これがドメインサービスの出番です。

---

## 6.2 ドメインサービスの特徴

| 特徴 | 説明 |
|------|------|
| **ステートレス** | 内部状態を持たない |
| **ドメインロジックを持つ** | アプリケーションサービスやインフラストラクチャとは異なる |
| **再利用可能** | 様々なエンティティ/値オブジェクトから利用される |

### アプリケーションサービスとの違い

| ドメインサービス | アプリケーションサービス |
|-----------------|---------------------|
| ビジネスルールを含む | ユースケースの調整（トランザクション等） |
| ドメイン層に所属 | アプリケーション層に所属 |
| ステートレス | ステートフル（処理の状態管理） |

```typescript
// ドメインサービス（ドメイン層）
class LegalMoveCalculator {
  calculate(board: BoardState, color: StoneColor): Coordinate[] {
    // オセロ/オクトのルールに基づく複雑な計算
  }
}

// アプリケーションサービス（アプリケーション層）
class GameApplicationService {
  async playMove(command: PlayMoveCommand): Promise<void> {
    const room = await this.roomRepository.findById(command.roomId);
    // ...トランザクション管理等の調整...
    await this.roomRepository.save(room);
  }
}
```

---

## 6.3 ドメインサービスを使うべきケース

### ケース1: 複数のエンティティ/値オブジェクトに関わる操作

```typescript
class RatingService {
  // 複数のUserに関わる計算
  updateAfterGame(
    winnerRating: number,
    loserRating: number
  ): { winnerNewRating: number; loserNewRating: number } {
    // 勝者と敗者のレーティングを同時に更新するロジック
  }
}
```

### ケース2: 特定のエンティティに属さないドメイン知識

```typescript
class LegalMoveCalculator {
  // 「合法手の計算」という操作は
  // Board、Stone、Roomのいずれにも完全に属さない

  calculate(board: BoardState, color: StoneColor): Coordinate[] {
    // オセロのルールに関する知識
  }
}
```

### ケース3: 外部システムとのドメイン的な連携

```typescript
class ExternalRatingProviderService {
  // 外部のレーティングシステムと連携するドメイン的な操作
  async fetchOfficialRating(userId: UserId): Promise<number> {
    // 外部API呼び出し、但しドメイン的な意味を持つ
  }
}
```

---

## 6.4 オクト対戦ゲームのドメインサービス

### LegalMoveCalculator（合法手計算機）

```typescript
class LegalMoveCalculator {
  calculate(
    board: BoardState,
    color: StoneColor
  ): Coordinate[] {
    const legalMoves: Coordinate[] = [];

    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        const coord = new Coordinate(x, y);
        if (this.isLegalMove(board, coord, color)) {
          legalMoves.push(coord);
        }
      }
    }

    return legalMoves;
  }

  private isLegalMove(
    board: BoardState,
    coord: Coordinate,
    color: StoneColor
  ): boolean {
    // 既に石がある場合は着手不可
    if (board.getStone(coord) !== null) {
      return false;
    }

    // 8方向チェック
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];

    for (const [dx, dy] of directions) {
      if (this.canFlipInDirection(board, coord, dx, dy, color)) {
        return true;
      }
    }

    return false;
  }

  private canFlipInDirection(
    board: BoardState,
    start: Coordinate,
    dx: number,
    dy: number,
    color: StoneColor
  ): boolean {
    // 指定方向に相手石を挟んで自分の石があるかチェック
    // （詳細実装は省略）
  }
}
```

### LineCompletionChecker（ライン完成判定）

```typescript
class LineCompletionChecker {
  // オクト独自の勝利条件を判定するドメインサービス
  checkVictory(board: BoardState): StoneColor | null {
    // 縦ラインチェック
    for (let x = 0; x < 8; x++) {
      const winner = this.checkColumn(board, x);
      if (winner) return winner;
    }

    // 横ラインチェック
    for (let y = 0; y < 8; y++) {
      const winner = this.checkRow(board, y);
      if (winner) return winner;
    }

    // 斜めラインチェック
    const diag1 = this.checkDiagonal1(board);
    if (diag1) return diag1;

    const diag2 = this.checkDiagonal2(board);
    if (diag2) return diag2;

    return null;
  }

  checkDraw(
    board: BoardState,
    blackLegalMoves: Coordinate[],
    whiteLegalMoves: Coordinate[]
  ): boolean {
    // 引き分け判定
    const hasEmptyCells = this.hasEmptyCells(board);
    const bothNoLegalMoves = blackLegalMoves.length === 0
      && whiteLegalMoves.length === 0;

    return !hasEmptyCells || bothNoLegalMoves;
  }
}
```

### RatingService（レーティング計算）

```typescript
class RatingService {
  // Eloレーティング計算
  calculateExpectedScore(
    playerRating: number,
    opponentRating: number
  ): number {
    return 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
  }

  updateRating(
    currentRating: number,
    expectedScore: number,
    actualScore: number,
    kFactor: number = 32
  ): number {
    return Math.round(
      currentRating + kFactor * (actualScore - expectedScore)
    );
  }

  updateAfterGame(
    winnerRating: number,
    loserRating: number
  ): { winnerNewRating: number; loserNewRating: number } {
    // 試合結果から両者のレーティングを更新
  }
}
```

---

## 6.5 ドメインサービスの設計ベストプラクティス

### ✅ 良いドメインサービス

```typescript
class LegalMoveCalculator {
  // 明確な責務
  calculate(board: BoardState, color: StoneColor): Coordinate[] {
    // 合法手計算のみ
  }
}
```

### ❌ 悪いドメインサービス

```typescript
class GameService {
  // 責務が多すぎる
  calculateLegalMoves(): Coordinate[] { }
  updateRating(): void { }
  saveToDatabase(): void { }
  sendNotification(): void { }
}
```

### ポイント

| 項目 | 指針 |
|------|------|
| **責務の単一化** | 1つのドメインサービス = 1つの明確な責務 |
| **ステートレス** | インスタンス変数を持たない |
| **明確な命名** | `〜Calculator`, `〜Checker`, `〜Service` など |

---

## 6.6 どこに配置するか

```
ドメイン層の構造
│
├── entity/
│   ├── Room.ts
│   ├── User.ts
│   └── Move.ts
│
├── valueObject/
│   ├── Coordinate.ts
│   ├── StoneColor.ts
│   └── BoardState.ts
│
└── domainService/
    ├── LegalMoveCalculator.ts
    ├── LineCompletionChecker.ts
    └── RatingService.ts
```

---

## 確認問題

### Q1: 以下のうち、ドメインサービスとして実装すべきものは？

A. Userのusernameを変更するメソッド
B. Roomに参加者を追加するメソッド
C. Eloレーティングを計算するメソッド
D. BoardStateから石の位置を取得するメソッド

<details>
<summary>回答</summary>

**正解: C**

AはUserエンティティ、BはRoom集約ルート、DはBoardState値オブジェクトの責務です。レーティング計算は複数のUserに関わる操作であり、特定のエンティティに完全には属さないため、ドメインサービスとして実装します。
</details>

---

### Q2: ドメインサービスとアプリケーションサービスの違いは？

A. ドメインサービスはステートフル、アプリケーションサービスはステートレス
B. ドメインサービスはビジネスルールを持つ、アプリケーションサービスはユースケース調整
C. ドメインサービスはDBアクセスする、アプリケーションサービスはしない
D. 違いはない

<details>
<summary>回答</summary>

**正解: B**

ドメインサービスはビジネスルール（ドメインロジック）を持ち、ドメイン層に配置されます。アプリケーションサービスはユースケースの調整（トランザクション管理等）を担当し、アプリケーション層に配置されます。
</details>

---

## 次のステップ

[リポジトリ](./07_repository.md) → 集約の永続化と再構築をどのように行うかを学びます。
