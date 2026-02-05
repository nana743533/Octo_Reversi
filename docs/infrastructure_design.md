# インフラ設計仕様書

## 1. 概要
Octo_Reversi プロジェクトのインフラ構成を定義します。

## 2. システム構成
graph TD
    subgraph "Public Internet"
        RN[React Native App]
        K_CLI[Kamal CLI / Local PC]
    end

    subgraph "AWS Cloud (VPC)"
        IGW[Internet Gateway]

        subgraph "Public Subnet"
            subgraph "EC2 Instance (Docker Host)"
                direction TB
                DE[Docker Engine]
                
                subgraph "Docker Network"
                    NG[NGINX Container]
                    KP[Kamal Proxy]
                    APP[Rails API Container]
                end
            end
        end

        subgraph "Private Subnet"
            RDS[(Amazon RDS)]
            Redis[(ElastiCache Redis)]
        end
    end

    %% Network Flow
    RN -- "HTTPS (443) / WSS" --> IGW
    IGW -- "Port 443" --> NG
    NG -- "HTTP (Internal)" --> KP
    KP -- "Routing" --> APP
    
    %% Internal Logic
    APP -- "SQL (5432/3306)" --> RDS
    APP -- "Pub/Sub (6379)" --> Redis
    
    %% Deployment Flow
    K_CLI -- "SSH (Port 22)" --> DE
    DE -- "kamal deploy" --> APP

## 3. 各コンポーネントの詳細設計

### 1. 公開レイヤー (EC2 / Public Subnet)

EC2 インスタンス内で、以下の 3 つの役割を Docker コンテナとして分離・配置します。

- **NGINX Container:**
    - **役割:** 全トラフィックの玄関口（リバースプロキシ）。
    - **機能:** **SSL 終端 (SSL Termination)** を行い、HTTP リクエストや **Action Cable (WebSocket)** のプロトコルアップグレードを適切に処理します。
- **Kamal Proxy:**
    - **役割:** デプロイ制御。
    - **機能:** Rails アプリの更新時に新旧コンテナを入れ替え、**ゼロダウンタイムデプロイ (Zero-downtime Deployment)** を実現します。
- **Rails API Container:**
    - **役割:** アプリケーションロジック。
    - **機能:** 認証、対戦判定、レーティング計算などを実行します。

### 2. 非公開レイヤー (Data / Private Subnet)

重要なデータとリアルタイム通信の基盤を安全な場所に隔離します。

- **Amazon RDS:** ユーザー情報、レーティング、棋譜データなど、整合性が重要な **永続データ** を保存します。
- **Amazon ElastiCache (Redis):** Action Cable のメッセージブローカーとして、対戦中の着手情報の **リアルタイム同期** を担います。

---

## 運用と通信のポイント

### セキュリティ設計 (Security Groups)

- **EC2:** インターネットから 80 (HTTP), 443 (HTTPS) および管理用の 22 (SSH) のみ許可。
- **RDS / Redis:** EC2 のセキュリティグループ ID からの特定のポート通信のみを許可し、**外部からの直接アクセスを完全に遮断** します。

### 通信プロトコルの流れ

1. **React Native:** HTTPS または WSS（セキュア WebSocket）で NGINX に接続。
2. **NGINX:** リクエストを解読し、内部の Docker ネットワーク経由で Kamal Proxy へ転送。
3. **Rails API:** Redis を介してリアルタイムに対戦相手とデータを同期。

### デプロイメント・ワークフロー

- **Kamal:** ローカル環境から SSH 経由で Docker Engine を操作。
- **Sidecar Pattern:** NGINX を **Accessory** として定義することで、Rails 本体と一緒に Docker コンテナとして一元管理します。

---

## 参照元

- **Kamal Documentation:** [Accessories (Managing sidecar containers)](https://kamal-deploy.org/docs/configuration/accessories/)
- **NGINX Official:** [WebSocket proxying](https://nginx.org/en/docs/http/websocket.html)
- **AWS Well-Architected:** [Security Pillar (Network Protection)](https://www.google.com/search?q=https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/network-protection.html&authuser=1)

---

このインフラ構成を実際に構築するための具体的な第一歩として、**「Kamal の `config/deploy.yml` で NGINX と Rails を連携させるための設定コード案」**を作成しましょうか？