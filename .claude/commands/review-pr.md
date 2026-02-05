---
description: PRの包括的なレビューを実行
argument-hint: "[レビュー項目: tests|errors|comments|types|code|simplify|all]"
allowed-tools: ["Bash", "Glob", "Grep", "Read", "Task"]
---

# PRレビュー

プルリクエストの包括的なレビューを複数の専門エージェントを使用して実行します。

## レビュー項目

- **tests** - テストカバレッジと品質
- **errors** - エラーハンドリングとサイレント失敗
- **comments** - コメントの正確性と保守性
- **types** - 型設計と不変条件
- **code** - 一般的なコードレビュー
- **simplify** - コードの単純化と改善
- **all** - すべての該当レビュー（デフォルト）

## 手順

1. 変更ファイルを特定
2. 該当するレビュー項目を判断
3. 各専門エージェントを並列または順次実行
4. 結果を集約

## 使用例

```
/review-pr
```

```
/review-pr tests errors
```

```
/review-pr all
```
