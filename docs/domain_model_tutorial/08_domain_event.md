# ステップ8: ドメインイベント

## 学習目標

- ドメインイベントの定義と目的を理解する
- イベント駆動設計の基本を学ぶ
- オクト対戦ゲームでのドメインイベント例を理解する

---

## 8.1 ドメインイベントとは

**ドメインイベント** は、**ドメイン内で発生した重要な出来事**を表します。

### 定義

- 「過去形」で表現される
- **何が起きたか**を表現
- 不変である

### 例

| イベント名 | 説明 |
|----------|------|
| `RoomCreated` | 部屋が作成された |
| `ParticipantJoined` | 参加者が部屋に参加した |
| `GameStarted` | ゲームが開始された |
| `MovePlayed` | 着手が行われた |
| `GameFinished` | ゲームが終了した |

---

## 8.2 なぜドメインイベントが必要か

### 問題: 結合度の高いコード

```typescript
// ❌ 悪い例: 部屋の状態変更と副作用が結合している

class Room {
  start(): void {
    this.status = RoomStatus.PLAYING;

    // 副作用がコードに混在
    this.notificationService.notifyParticipants(this.id);
    this.analyticsService.trackGameStart(this.id);
    this.achievementService.checkStartAchievements(this.participants);
  }
}
```

問題点：
- Roomの責務が肥大化
- 通知サービス、分析サービス、実績サービスに依存
- テストが難しい
- 新しい副作用の追加時にRoomを修正する必要

### 解決: ドメインイベントの使用

```typescript
// ✅ 良い例: イベント発火のみ

class Room {
  private domainEvents: DomainEvent[] = [];

  start(): void {
    this.status = RoomStatus.PLAYING;

    // イベント発火
    this.addDomainEvent(
      new GameStartedEvent({
        roomId: this.id,
        participantIds: this.participants.map(p => p.userId),
        occurredAt: new Date()
      })
    );
  }

  private addDomainEvent(event: DomainEvent): void {
    this.domainEvents.push(event);
  }

  getDomainEvents(): DomainEvent[] {
    return this.domainEvents;
  }

  clearDomainEvents(): void {
    this.domainEvents = [];
  }
}
```

メリット：
- Roomは「状態遷移」に集中できる
- 副作用はイベントハンドラーで処理
- 新しいハンドラーを追加してもRoomは影響を受けない

---

## 8.3 ドメインイベントの構造

### 基本構造

```typescript
// ドメインイベントの基底クラス
abstract class DomainEvent {
  readonly occurredAt: Date;

  constructor() {
    this.occurredAt = new Date();
  }
}

// 具体的なイベント
class GameStartedEvent extends DomainEvent {
  readonly roomId: RoomId;
  readonly participantIds: UserId[];

  constructor(props: {
    roomId: RoomId;
    participantIds: UserId[];
    occurredAt: Date;
  }) {
    super();
    this.roomId = props.roomId;
    this.participantIds = props.participantIds;
    this.occurredAt = props.occurredAt;
  }
}
```

### 命名規則

- イベント名は**過去形**：`GameStarted`（`StartGame` ではない）
- 「何が起きたか」を表現：`MovePlayed`、`GameFinished`
- ビジネス上の重要な出来事のみ

---

## 8.4 オクト対戦ゲームのドメインイベント

```typescript
// ルーム作成イベント
class RoomCreatedEvent extends DomainEvent {
  readonly roomId: RoomId;
  readonly hostUserId: UserId;
  readonly occurredAt: Date;
}

// 参加者追加イベント
class ParticipantJoinedEvent extends DomainEvent {
  readonly roomId: RoomId;
  readonly userId: UserId;
  readonly color: StoneColor;
  readonly occurredAt: Date;
}

// ゲーム開始イベント
class GameStartedEvent extends DomainEvent {
  readonly roomId: RoomId;
  readonly participantIds: UserId[];
  readonly occurredAt: Date;
}

// 着手イベント
class MovePlayedEvent extends DomainEvent {
  readonly roomId: RoomId;
  readonly moveId: MoveId;
  readonly userId: UserId;
  readonly coordinate: Coordinate;
  readonly occurredAt: Date;
}

// ゲーム終了イベント
class GameFinishedEvent extends DomainEvent {
  readonly roomId: RoomId;
  readonly winnerColor: StoneColor | null;
  readonly isDraw: boolean;
  readonly occurredAt: Date;
}

// レーティング変更イベント
class RatingChangedEvent extends DomainEvent {
  readonly userId: UserId;
  readonly oldRating: number;
  readonly newRating: number;
  readonly occurredAt: Date;
}
```

---

## 8.5 イベント処理の流れ

```
┌─────────────────────────────────────────────────────────┐
│  1. ドメインロジック実行                                 │
│                                                          │
│     room.start();                                       │
│     ↓                                                    │
│     内部でイベント発火: GameStartedEvent                │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│  2. トランザクション完了                                 │
│                                                          │
│     roomRepository.save(room);                          │
│     ↓                                                    │
│     イベントがディスパッチされる                         │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│  3. イベントハンドラー実行                               │
│                                                          │
│     GameStartedEventHandler:                            │
│       - 通知送信                                        │
│       - 分析記録                                        │
│     └────────────────────────────────────────────────┘ │
│     NotificationEventHandler:                           │
│       - プッシュ通知送信                                │
│     └────────────────────────────────────────────────┘ │
│     AchievementEventHandler:                            │
│       - 実績チェック                                    │
└─────────────────────────────────────────────────────────┘
```

### イベントハンドラーの例

```typescript
// GameStartedEventのハンドラー
class GameStartedEventHandler {
  constructor(
    private notificationService: NotificationService,
    private analyticsService: AnalyticsService,
    private achievementService: AchievementService
  ) {}

  async handle(event: GameStartedEvent): Promise<void> {
    // 参加者に通知
    await this.notificationService.notifyGameStarted(event.roomId);

    // 分析記録
    await this.analyticsService.trackGameStart(event.roomId);

    // 実績チェック
    for (const userId of event.participantIds) {
      await this.achievementService.checkStartAchievements(userId);
    }
  }
}
```

---

## 8.6 イベント駆動設計の利点

| 利点 | 説明 |
|------|------|
| **結合度の低下** | モジュール間の依存が減る |
| **拡張性** | 新しいハンドラーを追加しても既存コードに影響しない |
| **履歴の追跡** | イベントログでシステムの状態遷移を追跡可能 |
| **非同期処理** | イベント処理を非同期化できる |

### 例: 新機能の追加

「ゲーム開始時にDiscordにも通知したい」という要件が追加された場合：

```typescript
// 新しいハンドラーを追加するだけ
class DiscordGameStartedEventHandler {
  async handle(event: GameStartedEvent): Promise<void> {
    await this.discordService.sendMessage(
      `Game ${event.roomId} has started!`
    );
  }
}

// Roomや既存のハンドラーは変更不要
```

---

## 8.7 イベントの粒度

### 詳細すぎるイベント（避けるべき）

```typescript
// ❌ 悪い例: 内部実装の詳細すぎるイベント
class RoomStatusUpdatedEvent extends DomainEvent {
  readonly oldStatus: RoomStatus;
  readonly newStatus: RoomStatus;
}
```

問題点：
- 内部実装を露出している
- ステータス変更の意味が伝わらない

### 適切な粒度

```typescript
// ✅ 良い例: ビジネス上の意味を持つイベント
class GameStartedEvent extends DomainEvent {
  readonly roomId: RoomId;
  readonly participantIds: UserId[];
}
```

---

## 8.8 集約内のイベント管理

```typescript
class Room {
  private domainEvents: DomainEvent[] = [];

  addEvent(event: DomainEvent): void {
    this.domainEvents.push(event);
  }

  pullDomainEvents(): DomainEvent[] {
    const events = this.domainEvents;
    this.domainEvents = [];
    return events;
  }
}

// アプリケーションサービスでの使用
class GameApplicationService {
  async startGame(command: StartGameCommand): Promise<void> {
    const room = await this.roomRepository.findById(roomId);

    room.start();

    await this.roomRepository.save(room);

    // イベントをディスパッチ
    const events = room.pullDomainEvents();
    for (const event of events) {
      await this.eventDispatcher.dispatch(event);
    }
  }
}
```

---

## 確認問題

### Q1: ドメインイベントの命名規則として適切なものは？

A. `StartGame`
B. `GameStarted`
C. `GameStarting`
D. `GameStart`

<details>
<summary>回答</summary>

**正解: B**

ドメインイベントは「何が起きたか」を過去形で表現します。`GameStarted` が適切です。
</details>

---

### Q2: ドメインイベントを使用する主な利点は？

A. コードが短くなる
B. データベースアクセスが高速になる
C. 結合度を下げ、拡張性を高める
D. メモリ使用量が減る

<details>
<summary>回答</summary>

**正解: C**

ドメインイベントは結合度を下げ、新しいハンドラーの追加を容易にするため、拡張性が高まります。
</details>

---

## 次のステップ

これでチュートリアルは完了です！[`../domain_model.md`](../domain_model.md) を読んで、全体像を確認してください。
