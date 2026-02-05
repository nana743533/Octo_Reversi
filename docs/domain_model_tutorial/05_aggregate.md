# ステップ5: 集約

## 学習目標

- 集約（Aggregate）の定義と目的を理解する
- 集約ルートの役割を理解する
- データ整合性を保つための設計を学ぶ

---

## 5.1 集約とは

**集約（Aggregate）** とは、**データ整合性を保つために一括操作する関連オブジェクトのグループ**です。

### なぜ必要か

次の状況を考えてみてください：

```typescript
// Room に Participant を追加する状況
const room = roomRepository.findById(roomId);
const participant = new RoomParticipant(userId, color);

room.participants.push(participant);  // ① 参加者追加
room.status = RoomStatus.PLAYING;     // ② ステータス変更
roomRepository.save(room);            // ③ 保存
```

もし①の後で③の前に別のトランザクションが介入したらどうなるでしょうか？

- データの不整合が発生する可能性
- 参加者数が2人になる前にゲームが始まってしまう

集約はこのような問題を防ぐために、**関連オブジェクトを一つの単位として扱います**。

---

## 5.2 集約の構造

```
┌─────────────────────────────────────────────────────────┐
│                    集約 (Aggregate)                      │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │         集約ルート (Aggregate Root)             │   │
│  │                                                 │   │
│  │         Room                                    │   │
│  │         - id: RoomId                            │   │
│  │         - status: RoomStatus                    │   │
│  │         - addParticipant(user)                  │   │
│  │         - start()                               │   │
│  └─────────────────────────────────────────────────┘   │
│                      │                                   │
│                      │ 管理                              │
│                      ▼                                   │
│  ┌─────────────────────────────────────────────────┐   │
│  │         エンティティ / 値オブジェクト            │   │
│  │                                                 │   │
│  │         RoomParticipant                         │   │
│  │         - id: ParticipantId                     │   │
│  │         - userId: UserId                        │   │
│  │         - color: StoneColor                     │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### ルール

1. **集約ルートを経由してのみ操作する**
   - 外部から直接 RoomParticipant を操作しない

2. **集約境界を越えて参照しない**
   - 他の集約のエンティティを直接保持しない

3. **トランザクション境界 = 集約境界**
   - 1つの集約を1つのトランザクションで操作する

---

## 5.3 集約ルート（Aggregate Root）

**集約ルート** は集約への**唯一のエントリーポイント**です。

### 役割

| 役割 | 説明 |
|------|------|
| **境界の維持** | 外部から内部オブジェクトへの直接アクセスを防ぐ |
| **不変条件の保証** | 集約全体の一貫性を保証する |
| **操作のカプセル化** | 複雑なロジックを隠蔽する |

### 例：Room集約ルート

```typescript
class Room {
  // 集約ルートとしてのID
  readonly id: RoomId;

  // 内部オブジェクト（外部から直接触らせない）
  private participants: Map<StoneColor, RoomParticipant>;
  private _status: RoomStatus;

  // ✅ 良い: 集約ルートを経由して操作
  addParticipant(user: User): void {
    // 不変条件チェック
    if (this.participants.size >= 2) {
      throw new Error("Room is full");
    }

    // 参加者追加
    const color = this.determineNextColor();
    const participant = RoomParticipant.create(user, color);
    this.participants.set(color, participant);
  }

  // ✅ 良い: 集約ルートが一貫性を保証
  start(): void {
    // 不変条件: 参加者が2人必要
    if (this.participants.size !== 2) {
      throw new Error("Need 2 participants to start");
    }

    // 不変条件: 待機状態である必要がある
    if (this._status !== RoomStatus.WAITING) {
      throw new Error("Room already started or finished");
    }

    this._status = RoomStatus.PLAYING;
  }

  // ❌ 悪い: 内部オブジェクトを直接公開
  getParticipants(): RoomParticipant[] {
    return Array.from(this.participants.values());
    // 呼び出し元が要素を変更できる可能性
  }

  // ✅ 良い: 読み取り専用で公開
  getParticipants(): ReadonlyArray<RoomParticipant> {
    return Array.from(this.participants.values());
  }
}
```

---

## 5.4 良い集約の設計

### 設計原則1: 集約は小さく保つ

```typescript
// ❌ 悪い: 巨大な集約
class Game {
  id: GameId;
  room: Room;           // Room集約全体を持っている
  players: User[];      // User集約全体を持っている
  moves: Move[];        // Move集約全体を持っている
  chatMessages: ChatMessage[];  // Chat集約まで...
}

// ✅ 良い: 小さな集約
class Room {
  id: RoomId;
  private participants: RoomParticipant[];  // 自分の責務のみ
  status: RoomStatus;
}

class User {
  id: UserId;
  username: string;
  rating: number;
}

class Move {
  id: MoveId;
  roomId: RoomId;  // ID参照で連携
  coordinate: Coordinate;
}
```

### 設計原則2: ID参照を使う

集約間の関連は**オブジェクト参照ではなくID参照**で行います。

```typescript
// ❌ 悪い: オブジェクト参照
class RoomParticipant {
  id: ParticipantId;
  user: User;  // User集約への直接参照
}

// ✅ 良い: ID参照
class RoomParticipant {
  id: ParticipantId;
  userId: UserId;  // IDのみ保持
}
```

### 設計原則3: 不変条件を集約内で守る

```typescript
class Room {
  private _status: RoomStatus;
  private participants: RoomParticipant[];

  // 不変条件: ステータス変更には参加者数チェックが必要
  changeStatus(newStatus: RoomStatus): void {
    if (newStatus === RoomStatus.PLAYING && this.participants.length !== 2) {
      throw new Error("Cannot start without 2 participants");
    }
    this._status = newStatus;
  }
}
```

---

## 5.5 オクト対戦ゲームの集約

### Room集約

```
┌─────────────────────────────────────────────────────────┐
│                       Room 集約                         │
├─────────────────────────────────────────────────────────┤
│  Room (集約ルート)                                      │
│    ├── id: RoomId                                       │
│    ├── status: RoomStatus                               │
│    ├── participants: RoomParticipant[]                  │
│    └── メソッド:                                        │
│        ├── addParticipant(user): void                   │
│        ├── start(): void                                │
│        └── finish(winnerColor): void                    │
│                                                         │
│  RoomParticipant (エンティティ)                         │
│    ├── id: ParticipantId                                │
│    ├── userId: UserId (ID参照)                          │
│    └── color: StoneColor                                │
└─────────────────────────────────────────────────────────┘
```

### 集約間の関連

```
Room 集約          User 集稼
   │                   │
   │ userId (ID参照)    │
   └───────────────────┘

Room 集約          Move 集約
   │                   │
   │ roomId (ID参照)    │
   └───────────────────┘
```

---

## 5.6 リポジトリとの関係

リポジトリは**集約単位**でアクセスを提供します。

```typescript
interface RoomRepository {
  // 集約全体を取得
  findById(id: RoomId): Promise<Room | null>;

  // 集約全体を保存
  save(room: Room): Promise<void>;

  // 内部オブジェクトだけの取得は提供しない
  // findParticipantById(id: ParticipantId): Promise<RoomParticipant>;  // ❌
}

// 使用例
const room = await roomRepository.findById(roomId);
room.addParticipant(user);
await roomRepository.save(room);  // 集約全体を保存
```

---

## 確認問題

### Q1: 集約ルートの主な役割は？

A. データベースへのアクセスを提供する
B. 集約への唯一のエントリーポイントとして一貫性を保証する
C. UIとのやり取りを担当する
D. 複数の集約をまとめる

<details>
<summary>回答</summary>

**正解: B**

集約ルートは集約への唯一のエントリーポイントとして、外部から内部オブジェクトへの直接アクセスを防ぎ、集約全体の一貫性を保証します。
</details>

---

### Q2: 以下のうち、適切な集約設計は？

A. Room集約がUser集約のオブジェクトを直接保持する
B. Room集約がUserのIDのみを保持する
C. 集約ルートを持たない設計
D. 1つの集約に全エンティティを含める

<details>
<summary>回答</summary>

**正解: B**

集約間はオブジェクト参照ではなくID参照で連携するのが適切です。
</details>

---

## 次のステップ

[ドメインサービス](./06_domain_service.md) → エンティティや値オブジェクトに属さないロジックをどこに配置するかを学びます。
