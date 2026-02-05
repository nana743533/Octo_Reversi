# React Native チュートリアル - 基礎編

## 目的

Claude Codeを使ってReact Nativeアプリを開発できるようになるための最低限の知識を学びます。

---

## 1. React Nativeとは？

React Nativeは、Facebookが開発した**クロスプラットフォームモバイルアプリ開発フレームワーク**です。

- **1つのコードベース**でiOSとAndroidの両方のアプリを開発できる
- **React**（JavaScriptライブラリ）と同じ概念で開発できる
- **ネイティブコンポーネント**に変換されるため、パフォーマンスが良い

```
JavaScript (React/React Native)
         ↓
    Native Components
    ┌────┴────┐
 iOS View   Android View
```

---

## 2. 開発環境のセットアップ

### 必要なツール

| ツール | 用途 |
|--------|------|
| Node.js | JavaScript実行環境 |
| npm/yarn | パッケージマネージャー |
| Expo | 開発ツールキット（推奨） |

### 最も簡単な始め方 - Expo

```bash
# Expo CLIのインストール
npm install -g expo-cli

# または、新しい方法（推奨）
npx create-expo-app my-app

# プロジェクトの起動
cd my-app
npx expo start
```

### スマホで動作確認

1. スマホに**Expo Go**アプリをインストール
2. 同じWi-Fiに接続
3. QRコードをスキャン
4. アプリが起動！

---

## 3. Reactの基本概念

### コンポーネント

React Nativeは**コンポーネント**単位でUIを構築します。

```javascript
// 関数コンポーネント（基本形）
function Greeting() {
  return <Text>Hello!</Text>;
}

// アロー関数（よく使われる書き方）
const Greeting = () => {
  return <Text>Hello!</Text>;
};

// exportして他のファイルで使えるように
export default function App() {
  return <Greeting />;
}
```

### JSX

JavaScriptの中にHTMLのような記述を書く構文です。

```javascript
// JSXを使う
const element = <Text>Hello World</Text>;

// JSXなし（使わない）
const element = React.createElement('Text', null, 'Hello World');
```

**JSXのルール:**
1. **1つのルート要素**で囲む
2. `className`ではなく`style`を使う
3. `div`ではなく`View`、`p`ではなく`Text`を使う

```javascript
// ✅ 正しい
<View>
  <Text>こんにちは</Text>
  <Text>世界</Text>
</View>

// ❌ エラー（ルート要素が複数）
<Text>こんにちは</Text>
<Text>世界</Text>
```

---

## 4. 基本的なコンポーネント

### View

レイアウトのコンテナ。Webの`div`に相当。

```javascript
import { View } from 'react-native';

<View style={{ padding: 20 }}>
  <Text>中身</Text>
</View>
```

### Text

テキストを表示。Webの`p`や`span`に相当。

```javascript
import { Text } from 'react-native';

<Text>こんにちは</Text>
```

### Image

画像を表示。

```javascript
import { Image } from 'react-native';

// ローカル画像
<Image source={require('./assets/logo.png')} />

// URL指定
<Image source={{ uri: 'https://example.com/image.png' }} />
```

### ScrollView

スクロール可能なコンテナ。

```javascript
import { ScrollView } from 'react-native';

<ScrollView>
  <Text>長いコンテンツ...</Text>
  <Text>長いコンテンツ...</Text>
  {/* たくさんのコンテンツ */}
</ScrollView>
```

### TextInput

テキスト入力。

```javascript
import { TextInput } from 'react-native';

<TextInput
  placeholder="名前を入力"
  value={name}
  onChangeText={setName}
/>
```

### Pressable（またはTouchableOpacity）

ボタンや押せる要素。

```javascript
import { Pressable, Text } from 'react-native';

<Pressable onPress={() => alert('押した！')}>
  <Text>ボタン</Text>
</Pressable>
```

---

## 5. スタイリング

### StyleSheet

スタイルはオブジェクトで定義します。

```javascript
import { StyleSheet, View, Text } from 'react-native';

function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>タイトル</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});
```

### よく使うスタイルプロパティ

| Web | React Native | 説明 |
|-----|--------------|------|
| `display: flex` | デフォルト | すべての要素はflex |
| `justify-content` | `justifyContent` | 主軸方向の配置 |
| `align-items` | `alignItems` | 交差軸方向の配置 |
| `width` | `width` | 幅 |
| `height` | `height` | 高さ |
| `margin` | `margin` | 外側の余白 |
| `padding` | `padding` | 内側の余白 |
| `background-color` | `backgroundColor` | 背景色 |
| `font-size` | `fontSize` | フォントサイズ |

### Flexbox

```javascript
// 横並び
<View style={{ flexDirection: 'row' }}>
  <Text>左</Text>
  <Text>右</Text>
</View>

// 中央寄せ
<View style={{
  flex: 1,
  justifyContent: 'center',  // 縦方向中央
  alignItems: 'center',       // 横方向中央
}}>
  <Text>中央</Text>
</View>

// スペースを分配
<View style={{ flexDirection: 'row' }}>
  <View style={{ flex: 1 }} /><Text>1:2</Text>
  <View style={{ flex: 2 }} />
</View>
```

---

## 6. Props（プロパティ）

コンポーネントにデータを渡す仕組みです。

```javascript
// データを受け取る側
function Greeting({ name, age }) {
  return (
    <Text>
      こんにちは、{name}さん（{age}歳）
    </Text>
  );
}

// データを渡す側
<Greeting name="太郎" age={25} />
```

### Propsの型定義（基本）

```javascript
// 簡単な例
function Button({ label, onPress }) {
  return (
    <Pressable onPress={onPress}>
      <Text>{label}</Text>
    </Pressable>
  );
}

// 使う
<Button label="送信" onPress={() => console.log('送信')} />
```

---

## 7. State（状態）

コンポーネント内で変わるデータを管理します。

### useStateフック

```javascript
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <View>
      <Text>カウント: {count}</Text>
      <Button label="増やす" onPress={() => setCount(count + 1)} />
    </View>
  );
}
```

### 複数のState

```javascript
function Form() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  return (
    <View>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="名前"
      />
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="メール"
      />
    </View>
  );
}
```

---

## 8. リスト表示

### FlatMap（基本的なリスト）

```javascript
import { FlatList } from 'react-native';

const DATA = [
  { id: '1', title: '項目1' },
  { id: '2', title: '項目2' },
  { id: '3', title: '項目3' },
];

function ListExample() {
  return (
    <FlatList
      data={DATA}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Text>{item.title}</Text>
      )}
    />
  );
}
```

### SectionList（セクション付きリスト）

```javascript
import { SectionList } from 'react-native';

const DATA = [
  {
    title: '果物',
    data: ['りんご', 'バナナ', 'オレンジ'],
  },
  {
    title: '野菜',
    data: ['にんじん', 'だいこん'],
  },
];

<SectionList
  sections={DATA}
  keyExtractor={(item, index) => item + index}
  renderItem={({ item }) => <Text>{item}</Text>}
  renderSectionHeader={({ section: { title } }) => (
    <Text style={{ fontWeight: 'bold' }}>{title}</Text>
  )}
/>
```

---

## 9. Claude Codeを使った開発

### 基本的なワークフロー

```
1. Claude Codeに要件を伝える
   「ログイン画面を作って」

2. Claude Codeがコードを生成

3. 動作確認
   npx expo start

4. 修正・調整
   「ボタンの色を変えて」「エラーハンドリング追加して」
```

### Claude Codeへの指示の例

```
良い指示:
「ユーザーがメールとパスワードを入力してログインする画面を作って。
バリデーションも入れて。」

具体的すぎる指示:
「useStateを使ってemailというstateを作って...」
→ Claude Codeがベストな書き方を知っているので、
  具体的な実装方法は任せると良い

あいまいな指示:
「なんかいい感じの画面作って」
→ 具体的な要件がないと良いコードが書けない
```

---

## 10. 最小限のサンプルアプリ

```javascript
import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';

export default function App() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handlePress = () => {
    setMessage(`こんにちは、${name}さん！`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>お名前:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="名前を入力"
      />
      <Pressable style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>送信</Text>
      </Pressable>
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  message: {
    marginTop: 20,
    fontSize: 18,
    color: '#333',
  },
});
```

---

## 次のステップ

1. **ナビゲーション** (`02_navigation.md`) - 画面遷移を学ぶ
2. **API連携** (`03_api_integration.md`) - サーバーと通信する
3. **状態管理** (`04_state_management.md`) - 複雑な状態を管理する
4. **Octoアプリ実装** - 実際のアプリを構築

---

## 参考リンク

- [React Native 公式ドキュメント](https://reactnative.dev/)
- [Expo ドキュメント](https://docs.expo.dev/)
- [React Native Basics](https://reactnative.dev/docs/getting-started)
