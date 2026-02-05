# データベースモデル設計仕様書

## 1. 概要
Octo_Reversi のデータ構造を定義します。

## 2. エンティティ定義
### Users (ユーザー)
- `id`: UUID (PK)
- `username`: String
- `email`: String (Unique)
- `password_hash`: String
- `created_at`: Timestamp

### Games (ゲームセッション)
- `id`: UUID (PK)
- `player_black_id`: UUID (FK to Users)
- `player_white_id`: UUID (FK to Users)
- `status`: Enum (WAITING, PLAYING, FINISHED)
- `created_at`: Timestamp

### Moves (着手履歴)
- `id`: UUID (PK)
- `game_id`: UUID (FK to Games)
- `player_id`: UUID (FK to Users)
- `position_x`: Integer
- `position_y`: Integer
- `move_number`: Integer
- `created_at`: Timestamp

## 3. ER図 (Mermaid表記)
```mermaid
erDiagram
    USER ||--o{ ROOM_PARTICIPANT : "参加する"
    USER ||--o{ MOVE : "石を置く"
    ROOM ||--o{ ROOM_PARTICIPANT : "管理する"
    ROOM ||--o{ MOVE : "保持する"

    USER {
        bigint id PK
        string username "ユーザー名 / ゲスト名"
        string email "ユニーク（ゲストはNULL可）"
        string password_digest "ハッシュ化パスワード"
        integer rating "Eloレーティング値"
        boolean is_guest "ゲストフラグ"
        datetime created_at
    }

    ROOM {
        bigint id PK
        string status "waiting / playing / finished"
        string winner_color "black / white / draw"
        datetime started_at
        datetime finished_at
    }

    ROOM_PARTICIPANT {
        bigint id PK
        bigint user_id FK "Usersテーブル参照"
        bigint room_id FK "Roomsテーブル参照"
        string color "black / white"
    }

    MOVE {
        bigint id PK
        bigint room_id FK "どの試合か"
        bigint user_id FK "誰が打ったか"
        integer x_coordinate "0-7"
        integer y_coordinate "0-7"
        integer move_number "何手目か"
        datetime created_at
    }
```
