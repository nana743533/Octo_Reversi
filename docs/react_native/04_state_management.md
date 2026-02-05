# React Native チュートリアル - 状態管理編

## このドキュメントで学ぶこと

- なぜ状態管理が必要か
- Context APIの使い方
- Reduxの基本
- 認証状態の管理
- グローバルなデータ共有

---

## 1. なぜ状態管理が必要か？

### useStateの限界

```javascript
// 認証状態を各コンポーネントで管理すると...

function LoginScreen() {
  const [user, setUser] = useState(null);  // 重複！
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // ...
}

function HomeScreen() {
  const [user, setUser] = useState(null);  // 重複！
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // ...
}

// 問題点：
// - コードが重複する
// - データが同期しない
// - propsのバケツリレーが発生
```

### 解決策：グローバルな状態管理

```
┌─────────────────────────────────────┐
│         グローバル状態               │
│  ┌───────────────────────────────┐  │
│  │  user: { id, name, email }    │  │
│  │  isAuthenticated: true        │  │
│  │  token: "xxx..."              │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
          ↑           ↑           ↑
    LoginScreen  HomeScreen  ProfileScreen
     （どこからでもアクセス可能）
```

---

## 2. Context API（基本）

React標準の状態管理機能です。小〜中規模なアプリに適しています。

### 基本的な使い方

```javascript
import React, { createContext, useContext, useState } from 'react';

// コンテキスト作成
const AuthContext = createContext();

// プロバイダーコンポーネント
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// カスタムフック（使いやすくする）
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// 使う
function App() {
  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  );
}

function LoginScreen() {
  const { login } = useAuth();

  const handleLogin = () => {
    login({ id: 1, name: '太郎' });
  };

  return <Button title="ログイン" onPress={handleLogin} />;
}

function HomeScreen() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Text>ログインしてください</Text>;
  }

  return <Text>こんにちは、{user.name}さん</Text>;
}
```

### 複数のコンテキスト

```javascript
// 認証
const AuthContext = createContext();

// ユーザー設定
const SettingsContext = createContext();

// ゲーム状態
const GameContext = createContext();

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <GameProvider>
          <Navigation />
        </GameProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}
```

---

## 3. Context APIの実践例

### 認証コンテキスト

```javascript
// contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../config/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 初期化：保存されているトークンを確認
  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('authToken');
      const storedUser = await AsyncStorage.getItem('authUser');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Failed to load auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { user, token } = response;

      // 保存
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('authUser', JSON.stringify(user));

      // 状態更新
      setToken(token);
      setUser(user);
      setIsAuthenticated(true);

      return { user, token };
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      // サーバーに通知
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // ローカルクリア
      await AsyncStorage.multiRemove(['authToken', 'authUser']);
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    AsyncStorage.setItem('authUser', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

### 使う

```javascript
// App.js
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

// ナビゲーションで認証状態を使用
function AppNavigator() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Main" component={TabNavigator} options={{ headerShown: false }} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

// 各画面で使用
function ProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <View>
      <Text>{user.name}</Text>
      <Text>{user.email}</Text>
      <Button title="ログアウト" onPress={logout} />
    </View>
  );
}
```

---

## 4. Redux（中〜大規模向け）

より複雑な状態管理が必要な場合、Reduxを使います。

### インストール

```bash
npm install @reduxjs/toolkit react-redux
```

### 基本的なセットアップ

```javascript
// store/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setAuth, clearAuth, setLoading } = authSlice.actions;
export default authSlice.reducer;

// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

// App.js
import { Provider } from 'react-redux';
import { store } from './store';

export default function App() {
  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
}
```

---

## 5. Octoアプリの状態管理構成

```javascript
// contexts/GameContext.js
import React, { createContext, useContext, useState } from 'react';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [currentMatch, setCurrentMatch] = useState(null);
  const [board, setBoard] = useState([]);
  const [myColor, setMyColor] = useState(null);
  const [isMyTurn, setIsMyTurn] = useState(false);

  const joinMatch = (match) => {
    setCurrentMatch(match);
    setBoard(match.initialBoard);
    setMyColor(match.playerColor);
    setIsMyTurn(match.playerColor === 'black');
  };

  const makeMove = (x, y) => {
    const newBoard = [...board];
    //着手処理...
    setBoard(newBoard);
    setIsMyTurn(false);
  };

  const handleOpponentMove = (move) => {
    const newBoard = [...board];
    // 相手の着手処理...
    setBoard(newBoard);
    setIsMyTurn(true);
  };

  return (
    <GameContext.Provider
      value={{
        currentMatch,
        board,
        myColor,
        isMyTurn,
        joinMatch,
        makeMove,
        handleOpponentMove,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
};
```

### 複数のプロバイダーを組み合わせる

```javascript
// App.js
import { AuthProvider } from './contexts/AuthContext';
import { GameProvider } from './contexts/GameContext';
import { SettingsProvider } from './contexts/SettingsContext';

function ProviderComposer({ contexts, children }) {
  return contexts.reduceRight(
    (kids, context) => <context.Provider>{kids}</context.Provider>,
    children
  );
}

export default function App() {
  const contexts = [AuthProvider, GameProvider, SettingsProvider];

  return (
    <ProviderComposer contexts={contexts}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </ProviderComposer>
  );
}

// 使う
function MatchScreen() {
  const { user } = useAuth();      // 認証情報
  const { board, makeMove } = useGame();  // ゲーム状態
  const { settings } = useSettings();  // 設定

  // ...
}
```

---

## 6. どちらを選ぶべきか？

| 特徴 | Context API | Redux |
|------|-------------|-------|
| **学習コスト** | 低い | 中〜高 |
| **ボイラープレート** | 少ない | 多い |
| **適用規模** | 小〜中 | 中〜大 |
| **DevTools** | React DevTools | Redux DevTools |
| **ミドルウェア** | 自作必要 | 豊富 |

**推奨:**
- 最初は**Context API**で始める
- 状態が複雑になったら**Redux**を検討

---

## 7. Claude Codeへの指示例

```
「認証状態をContext APIで管理できるようにして。
ユーザー情報、トークン、ログイン状態をグローバルに管理して」

「ゲーム状態（ボード、手番、現在のマッチ）を
別のコンテキストで管理して」
```

---

## まとめ

### 状態管理のベストプラクティス

1. **必要な場所だけで状態を管理**
   - ローカルで済むならuseStateで十分
   - 複数画面で使うならContext/Redux

2. **状態は正規化**
   - 重複を避ける
   - シンプルな構造にする

3. **更新はイミュータブルに**
   - 直接変更しない
   - 新しいオブジェクトを作成

4. **非同期処理は分離**
   - 状態更新とAPI通信を分ける
   - カスタムフックでラップ

---

## 次のステップ

これで基礎は完了です。あとは実際にアプリを作りながら学びましょう！

```
✅ 基礎（コンポーネント、スタイリング）
✅ ナビゲーション
✅ API連携
✅ 状態管理
```

いよいよOctoアプリの実装に取り組めます！
