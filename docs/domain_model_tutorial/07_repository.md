# ステップ7: リポジトリ

## 学習目標

- リポジトリパターンの目的と役割を理解する
- リポジトリとデータアクセスの関係を学ぶ
- 集約単位でのアクセスを理解する

---

## 7.1 リポジトリとは

**リポジトリ（Repository）** は、**集約の永続化と再構築を担当する**ドメイン層のインターフェースです。

### 目的

- ドメイン層からデータアクセスの詳細を隠蔽する
- 集約単位でのアクセスを提供する
- ドメインオブジェクトのライフサイクルを管理する

### データアクセスの問題点

```typescript
// ❌ 悪い例: ドメイン層にデータアクセスの詳細が漏れ出している

class RoomService {
  async findRoom(id: string) {
    // ドメイン層でSQLを書いている
    const result = await db.query(
      'SELECT * FROM rooms WHERE id = $1',
      [id]
    );

    // オブジェクトの再構築もサービス内で...
    return new Room(
      new RoomId(result.rows[0].id),
      result.rows[0].status,
      // ...
    );
  }
}
```

問題点：
- データベースの詳細がドメイン層に漏れている
- ドメインロジックとデータアクセスが混在
- テストが難しい

---

## 7.2 リポジトリパターンの適用

```typescript
// ✅ 良い例: インターフェースで定義

interface RoomRepository {
  save(room: Room): Promise<void>;
  findById(id: RoomId): Promise<Room | null>;
  findWaitingRooms(): Promise<Room[]>;
}
```

### 利点

| 利点 | 説明 |
|------|------|
| **関心の分離** | ドメイン層がデータアクセス方法を知らなくて良い |
| **テスト容易性** | モックやスタンプで簡単にテスト可能 |
| **実装の交換** | 実装を変更してもドメイン層は影響を受けない |

---

## 7.3 リポジトリの設計原則

### 原則1: 集約単位でのアクセス

```typescript
// ✅ 良い: 集約全体を扱う
interface RoomRepository {
  findById(id: RoomId): Promise<Room | null>;
  save(room: Room): Promise<void>;
}

// ❌ 悪い: 部分的なアクセス
interface RoomRepository {
  findRoomStatus(id: RoomId): Promise<RoomStatus>;
  findParticipants(id: RoomId): Promise<RoomParticipant[]>;
  saveStatus(id: RoomId, status: RoomStatus): Promise<void>;
}
```

### 原則2: 集約ルート経由のみ

```typescript
// リポジトリは集約ルート（Room）のみを扱う
// RoomParticipant は Room 経由でアクセス

// ✅ 良い
const room = await roomRepository.findById(roomId);
room.addParticipant(user);
await roomRepository.save(room);

// ❌ 悪い
await roomRepository.addParticipant(roomId, userId);
```

### 原則3: ドメイン層にインターフェースを配置

```typescript
// domain/repository/RoomRepository.ts (ドメイン層)
interface RoomRepository {
  save(room: Room): Promise<void>;
  findById(id: RoomId): Promise<Room | null>;
}

// infrastructure/repository/RoomRepositoryImpl.ts (インフラ層)
class RoomRepositoryImpl implements RoomRepository {
  async save(room: Room): Promise<void> {
    // データベースへの保存処理
  }
}
```

---

## 7.4 オクト対戦ゲームのリポジトリ

### RoomRepository

```typescript
interface RoomRepository {
  // 集約を保存
  save(room: Room): Promise<void>;

  // IDで集約を取得
  findById(id: RoomId): Promise<Room | null>;

  // 検索メソッド（ユースケースに応じて追加）
  findWaitingRooms(): Promise<Room[]>;
  findPlayingRooms(): Promise<Room[]>;
  findByUserId(userId: UserId): Promise<Room[]>;
}
```

### MoveRepository

```typescript
interface MoveRepository {
  // 1つの着手を保存
  save(move: Move): Promise<void>;

  // 部屋の全着手を取得
  findByRoomId(roomId: RoomId): Promise<Move[]>;

  // 最新の着手を取得
  findLatestByRoomId(roomId: RoomId): Promise<Move | null>;
}
```

### UserRepository

```typescript
interface UserRepository {
  save(user: User): Promise<void>;
  findById(id: UserId): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
}
```

---

## 7.5 実装の例

### インターフェース（ドメイン層）

```typescript
// domain/repository/RoomRepository.ts
import { Room } from '../entity/Room';
import { RoomId } from '../valueObject/RoomId';

export interface RoomRepository {
  save(room: Room): Promise<void>;
  findById(id: RoomId): Promise<Room | null>;
}
```

### 実装（インフラ層）

```typescript
// infrastructure/repository/RoomRepositoryImpl.ts
import { RoomRepository } from '@/domain/repository/RoomRepository';
import { Room } from '@/domain/entity/Room';
import { RoomId } from '@/domain/valueObject/RoomId';
import { db } from './connection';

export class RoomRepositoryImpl implements RoomRepository {
  async save(room: Room): Promise<void> {
    await db.query(
      `INSERT INTO rooms (id, status, started_at, finished_at)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (id) DO UPDATE SET
         status = $2, started_at = $3, finished_at = $4`,
      [
        room.id.value,
        room.status,
        room.startedAt,
        room.finishedAt
      ]
    );
  }

  async findById(id: RoomId): Promise<Room | null> {
    const result = await db.query(
      'SELECT * FROM rooms WHERE id = $1',
      [id.value]
    );

    if (result.rows.length === 0) {
      return null;
    }

    // 集約の再構築
    return this.mapToRoom(result.rows[0]);
  }

  private mapToRoom(row: any): Room {
    // データベース行から集約を再構築
    return new Room(
      new RoomId(row.id),
      row.status,
      // ...
    );
  }
}
```

### 依存注入

```typescript
// application/service/GameApplicationService.ts
import { RoomRepository } from '@/domain/repository/RoomRepository';

class GameApplicationService {
  constructor(
    private readonly roomRepository: RoomRepository  // インターフェースに依存
  ) {}

  async startGame(command: StartGameCommand): Promise<void> {
    const room = await this.roomRepository.findById(
      new RoomId(command.roomId)
    );

    if (!room) {
      throw new Error("Room not found");
    }

    room.start();

    await this.roomRepository.save(room);
  }
}
```

---

## 7.6 まとめ：レイヤー構造

```
┌─────────────────────────────────────────────────────────┐
│                    プレゼンテーション層                  │
│                    (Controller, View)                   │
└─────────────────────────────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    アプリケーション層                    │
│              (ApplicationService, DTO)                  │
└─────────────────────────────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────┐
│                       ドメイン層                         │
│  ┌─────────────┐  ┌─────────────┐  ┌────────────────┐ │
│  │ Entity      │  │ ValueObject │  │ Repository(I)  │ │
│  │ (Room等)    │  │ (Coordinate)│  │ (インターフェース)│ │
│  └─────────────┘  └─────────────┘  └────────────────┘ │
└─────────────────────────────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    インフラストラクチャ層                │
│              (RepositoryImpl, DB等)                     │
└─────────────────────────────────────────────────────────┘
```

---

## 確認問題

### Q1: リポジトリパターンの主な目的は？

A. データベースのスキーマを定義する
B. 集約の永続化と再構築を担当し、ドメイン層からデータアクセス詳細を隠蔽する
C. API通信を行う
D. ログを出力する

<details>
<summary>回答</summary>

**正解: B**

リポジトリパターンは、集約の永続化と再構築を担当し、ドメイン層からデータアクセスの詳細を隠蔽するために使用されます。
</details>

---

### Q2: リポジトリはどの単位でアクセスを提供すべきか？

A. データベーステーブル単位
B. 集約単位
C. エンティティ単位
D. 値オブジェクト単位

<details>
<summary>回答</summary>

**正解: B**

リポジトリは集約単位でアクセスを提供します。集約ルートを通じて内部オブジェクトにアクセスする必要があります。
</details>

---

## 次のステップ

[ドメインイベント](./08_domain_event.md) → ドメイン内で発生した出来事をどのように表現するかを学びます。
