# インフラ設計仕様書

## 1. 概要
Octo_Reversi プロジェクトのインフラ構成を定義します。

## 2. システム構成
- **Compute**: AWS EC2 (t3.micro 等)
- **Database**: Amazon RDS (PostgreSQL/MySQL) または セルフホストDB
- **Storage**: Amazon S3 (静的アセット用)
- **Networking**: VPC, Public/Private Subnets, Security Groups

## 3. デプロイ構成
- GitHub Actions による CI/CD
- Docker によるコンテナ化

## 4. セキュリティ
- SSL/TLS (ACM / Let's Encrypt)
- SSH鍵管理 (`octo-ec2-rsa-key.pem`)
