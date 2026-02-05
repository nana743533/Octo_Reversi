# React Native チュートリアル - 目次

Claude Codeを使ってReact Nativeアプリを開発するための基礎知識を学びます。

---

## ドキュメント構成

| # | ドキュメント | 内容 |
|---|--------------|------|
| 1 | [01_getting_started.md](./01_getting_started.md) | React Nativeの基礎、コンポーネント、スタイリング |
| 2 | [02_navigation.md](./02_navigation.md) | 画面遷移、React Navigation |
| 3 | [03_api_integration.md](./03_api_integration.md) | HTTPリクエスト、認証、WebSocket |
| 4 | [04_state_management.md](./04_state_management.md) | Context API、Redux、グローバル状態管理 |

---

## 学習ロードマップ

### Step 1: 基礎を理解する（1-2時間）

`01_getting_started.md` を読んで以下を理解：

- [ ] React Nativeって何？
- [ ] Expoで開発環境を整える
- [ ] コンポーネントの基本
- [ ] JSXの書き方
- [ ] StyleSheetでのスタイリング
- [ ] useStateで状態を管理

**確認問題：**
```javascript
// これを修正してください
<Text>こんにちは</Text>
<Text>世界</Text>
```

---

### Step 2: 画面遷移を学ぶ（1時間）

`02_navigation.md` を読んで以下を理解：

- [ ] Stack Navigatorで画面遷移
- [ ] Tab Navigatorでタブ実装
- [ ] 画面間でデータを渡す
- [ ] 認証後のナビゲーション設計

**確認問題：**
```
ログイン画面 → （成功） → メイン画面（タブ）
                           → ホーム / 対戦 / プロフィール
```

---

### Step 3: APIと通信する（1-2時間）

`03_api_integration.md` を読んで以下を理解：

- [ ] fetchでHTTPリクエスト
- [ ] JWT認証の実装
- [ ] ローディング表示
- [ ] エラーハンドリング
- [ ] WebSocketでリアルタイム通信

**確認問題：**
```javascript
// ログインAPIを叩いて、
// 成功したらトークンを保存して
// メイン画面に遷移するコードを書いて
```

---

### Step 4: 状態を管理する（1時間）

`04_state_management.md` を読んで以下を理解：

- [ ] なぜ状態管理が必要か
- [ ] Context APIの使い方
- [ ] 認証状態のグローバル管理
- [ ] ゲーム状態の管理

**確認問題：**
```javascript
// 認証状態をContextで管理して
// どの画面からでもユーザー情報にアクセスできるようにして
```

---

## 最小限のチェックリスト

Claude Codeで開発を始める前に、これだけは理解しておきましょう：

### コンポーネント
- [ ] 関数コンポーネントが書ける
- [ ] export/importがわかる
- [ ] Propsでデータを渡せる

### スタイリング
- [ ] StyleSheetを使える
- [ ] flexboxの基本（flex, flexDirection, justifyContent）
- [ ] よく使うコンポーネント（View, Text, Pressable）

### 状態管理
- [ ] useStateが使える
- [ ] onChangeTextで入力を取得

### ナビゲーション
- [ ] Stack Navigatorで画面遷移
- [ ] navigateで移動
- [ ] navigateで値を渡す

### API
- [ ] fetchの基本（GET, POST）
- [ ] async/awaitがわかる

---

## Claude Codeへの指示のコツ

### 良い指示

```
✅ 「ログイン画面を作って。
     メールとパスワードを入力して、
     API POST /auth/login で認証して、
     成功したらトークンを保存してメイン画面に遷移して」

✅ 「ホーム画面にユーザー一覧を表示して。
     GET /api/users で取得できるから、
     ローディング中はスピナーを表示して」
```

### 悪い指示

```
❌ 「なんかいい感じの画面作って」

❌ 「useStateを使って...（具体的すぎ）」
```

---

## 実践：最初のアプリを作ってみる

チュートリアルを読んだら、簡単なアプリを作ってみましょう：

### Todoアプリ

```javascript
// 機能要件
- タスクを追加できる
- タスクを削除できる
- 完了済みをマークできる

// 必要な要素
- TextInput（入力）
- Button（追加）
- FlatList（一覧）
- AsyncStorage（保存）
```

### メモアプリ

```javascript
// 機能要件
- メモを追加・編集・削除
- カテゴリ分け
- 検索

// 必要な要素
- 複数画面（一覧、詳細、編集）
- ナビゲーション
- ローカル保存
```

---

## よくあるエラーと対処法

### エラー: 'NavigationContainer' not found

```bash
# インストール忘れ
npm install @react-navigation/native
```

### エラー: Unable to resolve module

```bash
# キャッシュクリア
npx expo start --clear
```

### エラー: TypeError: undefined is not an object

```javascript
// ナビゲーションプロパティの受け取り忘れ
function Screen({ navigation }) {  // ←忘れずに
  // ...
}
```

---

## 参考リンク

- [React Native 公式](https://reactnative.dev/)
- [Expo ドキュメント](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Hooks](https://react.dev/reference/react)

---

## 次のステップ

チュートリアルが終わったら、実際のアプリ開発に進みましょう！

1. [API仕様](../api/) を確認
2. [データベース設計](../database_model_design.md) を理解
3. [ドメインモデル](../domain_model_design.md) を確認
4. 実装開始！

Happy coding! 🚀
