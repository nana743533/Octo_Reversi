# React Native チュートリアル - ナビゲーション編

## このドキュメントで学ぶこと

- React Navigationの使い方
- 画面遷移の実装
- 値の受け渡し
- タブナビゲーション
- ドロワーナビゲーション

---

## 1. React Navigationとは？

React Nativeで画面遷移を実装するための**標準的なライブラリ**です。

- **Stack Navigator**: 画面をスタック（積み重ね）管理
- **Tab Navigator**: タブで画面を切り替え
- **Drawer Navigator**: サイドメニュー

```
Screen A → Screen B → Screen C
   ↑         ↑
   └─────────┘  戻るボタンで戻れる
```

---

## 2. インストール

### Expo Router（推奨：ファイルベースルーティング）

```bash
npx create-expo-app my-app --template tabs
```

### React Navigation（従来の方法）

```bash
npm install @react-navigation/native
npx expo install react-native-screens react-native-safe-area-context

# Stack Navigator
npm install @react-navigation/native-stack

# Tab Navigator
npm install @react-navigation/bottom-tabs
```

---

## 3. Stack Navigator（基本）

### 最小限の設定

```javascript
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// 画面コンポーネント
function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>ホーム画面</Text>
      <Button
        title="詳細へ"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
}

function DetailsScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>詳細画面</Text>
    </View>
  );
}

// ナビゲーター設定
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### 画面タイトルの設定

```javascript
<Stack.Screen
  name="Home"
  component={HomeScreen}
  options={{ title: 'ホーム' }}
/>
```

### ヘッダーのカスタマイズ

```javascript
<Stack.Screen
  name="Home"
  component={HomeScreen}
  options={{
    title: 'ホーム',
    headerStyle: { backgroundColor: '#007AFF' },
    headerTintColor: '#fff',
    headerTitleStyle: { fontWeight: 'bold' },
  }}
/>
```

---

## 4. 画面間の移動

### 基本的な移動

```javascript
function HomeScreen({ navigation }) {
  return (
    <View>
      {/* navigate: 新規画面をプッシュ */}
      <Button
        title="詳細へ"
        onPress={() => navigation.navigate('Details')}
      />

      {/* replace: 現在の画面を置き換え（戻れなくなる） */}
      <Button
        title="ログイン"
        onPress={() => navigation.replace('Login')}
      />

      {/* goBack: 前の画面へ戻る */}
      <Button
        title="戻る"
        onPress={() => navigation.goBack()}
      />

      {/* reset: ナビゲーション状態をリセット */}
      <Button
        title="リセット"
        onPress={() => navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        })}
      />
    </View>
  );
}
```

### 値を渡して移動

```javascript
// 送信側
function HomeScreen({ navigation }) {
  const user = { id: 1, name: '太郎' };

  return (
    <Button
      title="プロフィールへ"
      onPress={() => navigation.navigate('Profile', { user })}
    />
  );
}

// 受信側
function ProfileScreen({ route, navigation }) {
  const { user } = route.params;

  return (
    <View>
      <Text>ユーザーID: {user.id}</Text>
      <Text>名前: {user.name}</Text>
    </View>
  );
}
```

### 戻り値を受け取る

```javascript
// 遷移先で値を返す
function SelectionScreen({ navigation }) {
  return (
    <Button
      title="選択して戻る"
      onPress={() => navigation.navigate('Home', { selectedItem: 'りんご' })}
    />
  );
}

// 元の画面で戻り値を受け取る
function HomeScreen({ navigation }) {
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    // 戻ってきた時の処理
    if (navigation.getState()?.routes?.[1]?.params?.selectedItem) {
      const item = navigation.getState().routes[1].params.selectedItem;
      setSelected(item);
    }
  }, [navigation]);

  return <Text>選択したもの: {selected}</Text>;
}
```

---

## 5. Tab Navigator

### 基本的なタブ

```javascript
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

function HomeScreen() {
  return <Text>ホーム</Text>;
}

function SettingsScreen() {
  return <Text>設定</Text>;
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
```

### アイコンを追加

```bash
npm install @expo/vector-icons
```

```javascript
import { Ionicons } from '@expo/vector-icons';

<Tab.Screen
  name="Home"
  component={HomeScreen}
  options={{
    tabBarLabel: 'ホーム',
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="home" size={size} color={color} />
    ),
  }}
/>
```

### タブのスタイリング

```javascript
<Tab.Navigator
  screenOptions={{
    tabBarActiveTintColor: '#007AFF',
    tabBarInactiveTintColor: '#999',
    tabBarStyle: { backgroundColor: '#f5f5f5' },
  }}
>
```

---

## 6. パラメータの型定義（TypeScript）

```typescript
// 型定義
type RootStackParamList = {
  Home: undefined;
  Details: { userId: string; userName: string };
  Profile: { userId: string };
};

// 型付きのナビゲーションプロップ
type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

type HomeScreenProps = {
  navigation: HomeScreenNavigationProp;
};

function HomeScreen({ navigation }: HomeScreenProps) {
  return (
    <Button
      title="詳細へ"
      onPress={() =>
        navigation.navigate('Details', {
          userId: '123',
          userName: '太郎'
        })
      }
    />
  );
}
```

---

## 7. 実践例：Octoアプリのナビゲーション構成

```javascript
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// 認証関連画面
function LoginScreen({ navigation }) {
  const handleLogin = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  };

  return (
    <View>
      <Text>ログイン</Text>
      <Button title="ログイン" onPress={handleLogin} />
    </View>
  );
}

// メイン画面（タブ）
function HomeScreen() {
  return <Text>対戦一覧</Text>;
}

function MatchScreen() {
  return <Text>対战中</Text>;
}

function ProfileScreen() {
  return <Text>プロフィール</Text>;
}

// タブナビゲーター
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Match') iconName = 'game-controller';
          else if (route.name === 'Profile') iconName = 'person';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'ホーム' }} />
      <Tab.Screen name="Match" component={MatchScreen} options={{ tabBarLabel: '対戦' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'プロフィール' }} />
    </Tab.Navigator>
  );
}

// スタックナビゲーター
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

---

## 8. よくあるパターン

### 認証後のナビゲーションリセット

```javascript
// ログイン成功時
navigation.reset({
  index: 0,
  routes: [{ name: 'Main' }],
});
```

### ログアウト

```javascript
// どこからでもログアウト画面へ戻る
navigation.reset({
  index: 0,
  routes: [{ name: 'Login' }],
});
```

### 深い階層への移動

```javascript
// 一気に深い画面へ
navigation.navigate('Home', {
  screen: 'Game',
  params: { gameId: '123' },
});
```

---

## 9. Claude Codeへの指示例

```
「ログイン画面を作って。
ログイン成功したらメイン画面（タブ）に遷移して、
ログイン画面には戻れないようにして」

「ホームから対戦画面、プロフィール画面に
移動できるタブナビゲーションを作って」
```

---

## 次のステップ

- **API連携** (`03_api_integration.md`) - サーバーと通信する
- **状態管理** (`04_state_management.md`) - 認証状態などを管理する
