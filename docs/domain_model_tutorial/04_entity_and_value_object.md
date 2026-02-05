# ステップ4: エンティティと値オブジェクト

## 学習目標

- エンティティと値オブジェクトの違いを理解する
- それぞれを適切に使い分けられるようになる
- オクト対戦ゲームでの適用例を理解する

---

## 4.1 エンティティ（Entity）

### 定義

**エンティティ** とは、**IDによって識別され、ライフサイクルを持つオブジェクト**です。

### 特徴

| 特徴 | 説明 |
|------|------|
| **IDによる同一性判定** | プロパティが変わっても同じIDなら同じオブジェクト |
| **可変** | 状態が変わる |
| **ライフサイクルを持つ** | 作成→変更→削除 |

### 例：Userエンティティ

```typescript
class User {
  constructor(
    readonly id: UserId,  // IDで同一性を判定
    public username: string,
    public email: string,
    public rating: number
  ) {}

  // 状態が変わっても同じUser
  changeUsername(newName: string): void {
    this.username = newName;
  }

  // IDが同じなら等価
  equals(other: User): boolean {
    return this.id.equals(other.id);
  }
}

// 使用例
const user1 = new User(new UserId(1), "Alice", "alice@example.com", 1200);
const user2 = new User(new UserId(1), "Alice", "alice@example.com", 1200);
const user3 = new User(new UserId(2), "Alice", "alice@example.com", 1200);

user1.equals(user2); // true (IDが同じ)
user1.equals(user3); // false (IDが異なる)
```

---

## 4.2 値オブジェクト（Value Object）

### 定義

**値オブジェクト** とは、**属性値によって同一性が決まる不変オブジェクト**です。

### 特徴

| 特徴 | 説明 |
|------|------|
| **値による同一性判定** | 全てのプロパティが等しければ同じオブジェクト |
| **不変** | 作成後に状態が変わらない |
| **交換可能** | 同じ値なら別のインスタンスで置換可能 |

### 例：Coordinate値オブジェクト

```typescript
class Coordinate {
  constructor(
    readonly x: number,
    readonly y: number
  ) {
    if (x < 0 || x > 7) throw new Error("Invalid x");
    if (y < 0 || y > 7) throw new Error("Invalid y");
  }

  // 全てのプロパティが等しければ等価
  equals(other: Coordinate): boolean {
    return this.x === other.x && this.y === other.y;
  }

  // 不変なので新しいインスタンスを返す
  add(dx: number, dy: number): Coordinate {
    return new Coordinate(this.x + dx, this.y + dy);
  }
}

// 使用例
const coord1 = new Coordinate(3, 4);  // d4
const coord2 = new Coordinate(3, 4);  // d4
const coord3 = new Coordinate(4, 5);  // e5

coord1.equals(coord2); // true (値が同じ)
coord1.equals(coord3); // false (値が異なる)
```

---

## 4.3 エンティティ vs 値オブジェクト

### 比較表

| 項目 | エンティティ | 値オブジェクト |
|------|-------------|---------------|
| 同一性の基準 | ID | 属性値 |
| 可変性 | 可変 | 不変 |
| ライフサイクル | あり | なし |
| 比較方法 | `id === other.id` | 全プロパティ比較 |
| 例 | User, Room, Move | Coordinate, Email, Money |

### 選定フローチャート

```
┌─────────────────────────────────────────┐
│ このオブジェクトは ID を持っているか？   │
└─────────────────────────────────────────┘
           │                    │
          YES                  NO
           │                    │
           ▼                    ▼
    ┌─────────────┐      ┌─────────────┐
    │ エンティティ │      │ 値オブジェクト │
    │             │      │             │
    │ 同じIDなら   │      │ 全プロパティが│
    │ 同じオブジェクト│   │ 同じなら等価  │
    └─────────────┘      └─────────────┘
```

---

## 4.4 オクト対戦ゲームでの適用例

### エンティティ一覧

| エンティティ | ID | 説明 |
|------------|-----|------|
| **User** | UserId | ユーザーを一意に識別 |
| **Room** | RoomId | 対戦セッションを一意に識別 |
| **RoomParticipant** | ParticipantId | 参加者を一意に識別 |
| **Move** | MoveId | 着手を一意に識別 |

```typescript
// Room エンティティの例
class Room {
  constructor(
    readonly id: RoomId,  // IDで識別
    private _status: RoomStatus,
    private _participants: RoomParticipant[]
  ) {}

  get status(): RoomStatus {
    return this._status;
  }

  // 状態は変わるがIDは変わらない
  start(): void {
    this._status = RoomStatus.PLAYING;
  }

  // IDが同じなら同じ部屋
  equals(other: Room): boolean {
    return this.id.equals(other.id);
  }
}
```

### 値オブジェクト一覧

| 値オブジェクト | プロパティ | 説明 |
|--------------|-----------|------|
| **Coordinate** | x, y | 盤面上の座標 |
| **StoneColor** | BLACK/WHITE | 石の色 |
| **BoardState** | cells | 盤面状態 |
| **RoomId** | value | 部屋ID |
| **UserId** | value | ユーザーID |

```typescript
// StoneColor 値オブジェクトの例
enum StoneColor {
  BLACK = "black",
  WHITE = "white"
}

// 相手の色を取得（不変な操作）
function getOpponentColor(color: StoneColor): StoneColor {
  return color === StoneColor.BLACK ? StoneColor.WHITE : StoneColor.BLACK;
}

// Coordinate 値オブジェクトの例
class Coordinate {
  constructor(
    readonly x: number,  // 0-7
    readonly y: number   // 0-8
  ) {}

  // オセロ記法に変換（不変）
  toNotation(): string {
    return String.fromCharCode(97 + this.x) + (this.y + 1);
  }
}
```

---

## 4.5 プリミティブ型の罠

### 悪い例：プリミティブ型を直接使用

```typescript
class Room {
  id: number;  // ただの数値
  status: string;  // ただの文字列
  startedAt: Date;
}
```

問題点：
- `id: number` では何のIDか不明
- `status: string` ならどんな値でも入ってしまう
- 意味がコードから読み取りにくい

### 良い例：値オブジェクトでラップ

```typescript
// 専用の型を定義
class RoomId {
  constructor(readonly value: string) {}
  equals(other: RoomId): boolean {
    return this.value === other.value;
  }
}

enum RoomStatus {
  WAITING = "waiting",
  PLAYING = "playing",
  FINISHED = "finished"
}

class Room {
  id: RoomId;  // Room専用のID型
  status: RoomStatus;  // 取り得る値が制限されている
  startedAt: Date | null;
}
```

メリット：
- 型安全性が向上
- 意味が明確
- バリデーションを値オブジェクト内にカプセル化

---

## 4.6 値オブジェクトのベストプラクティス

### ✅ 良い値オブジェクト

```typescript
class Email {
  private constructor(private readonly value: string) {}

  // バリデーション付きのファクトリーメソッド
  static create(email: string): Email {
    if (!this.isValid(email)) {
      throw new Error("Invalid email format");
    }
    return new Email(email);
  }

  private static isValid(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  get value(): string {
    return this.value;
  }
}
```

### 値オブジェクトを使うべきケース

- **金額**: `Money` クラス（通貨と額を保持）
- **範囲**: `Range` クラス（最小値と最大値）
- **日付範囲**: `DateRange` クラス（開始日と終了日）
- **座標**: `Coordinate` クラス（x, y）
- **色**: `StoneColor` クラス

---

## 確認問題

### Q1: 以下のうち、値オブジェクトとして実装すべきものは？

A. User（ユーザー）
B. Room（部屋）
C. Email（メールアドレス）
D. Move（着手）

<details>
<summary>回答</summary>

**正解: C**

Emailは属性値で同一性が決まり、不変であるため値オブジェクトです。User、Room、MoveはそれぞれIDで識別されるエンティティです。
</details>

---

### Q2: Coordinate(3, 4) と Coordinate(3, 4) は等しいか？

A. はい（値が同じため）
B. いいえ（別のインスタンスのため）

<details>
<summary>回答</summary>

**正解: A**

値オブジェクトは属性値によって同一性を判定します。同じ x=3, y=4 を持つなら、インスタンスが異なっても等価です。
</details>

---

## 次のステップ

[集約](./05_aggregate.md) → 複数のエンティティや値オブジェクトをどのようにまとめるかを学びます。
