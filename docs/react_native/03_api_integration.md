# React Native チュートリアル - API連携編

## このドキュメントで学ぶこと

- HTTPリクエストの基本
- fetchを使ったAPI通信
- 非同期処理の基本
- エラーハンドリング
- ローディング表示
- 認証（JWTトークン）

---

## 1. HTTPリクエストの基本

### 主なHTTPメソッド

| メソッド | 用途 | 例 |
|---------|------|-----|
| GET | データ取得 | ユーザー情報を取得 |
| POST | データ作成 | 新規ユーザー登録 |
| PUT/PATCH | データ更新 | ユーザー情報更新 |
| DELETE | データ削除 | ユーザー削除 |

### ステータスコード

| コード | 意味 |
|--------|------|
| 200 | 成功 |
| 201 | 作成成功 |
| 400 | リクエストエラー |
| 401 | 認証エラー |
| 403 | 権限エラー |
| 404 | not found |
| 500 | サーバーエラー |

---

## 2. fetchを使った基本的なリクエスト

React Nativeには**fetch**が組み込まれています。

### GETリクエスト

```javascript
import { useState, useEffect } from 'react';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://api.example.com/users');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Text>読み込み中...</Text>;
  if (error) return <Text>エラー: {error}</Text>;

  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <Text>{item.name}</Text>}
    />
  );
}
```

### POSTリクエスト

```javascript
const createUser = async (userData) => {
  try {
    const response = await fetch('https://api.example.com/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Create user error:', error);
    throw error;
  }
};

// 使う
<Button
  title="ユーザー作成"
  onPress={async () => {
    try {
      await createUser({ name: '太郎', email: 'taro@example.com' });
      alert('作成成功！');
    } catch (error) {
      alert('作成失敗');
    }
  }}
/>
```

---

## 3. 認証付きリクエスト

### JWTトークンを使う

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

// トークンの保存
const saveToken = async (token) => {
  await AsyncStorage.setItem('authToken', token);
};

// トークンの取得
const getToken = async () => {
  return await AsyncStorage.getItem('authToken');
};

// トークン付きリクエスト
const fetchWithAuth = async (url, options = {}) => {
  const token = await getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return fetch(url, { ...options, headers });
};

// 使う
const fetchUserProfile = async () => {
  try {
    const response = await fetchWithAuth(
      'https://api.example.com/me'
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Profile fetch error:', error);
  }
};
```

### ログイン実装例

```javascript
const login = async (email, password) => {
  try {
    const response = await fetch('https://api.example.com/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'ログインに失敗しました');
    }

    const data = await response.json();
    await saveToken(data.token);
    return data;
  } catch (error) {
    throw error;
  }
};
```

---

## 4. ローディングとエラー処理

### カスタムフックを使う

```javascript
import { useState } from 'react';

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = async (apiFunc) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiFunc();
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, request };
};

// 使う
function LoginScreen() {
  const { loading, error, request } = useApi();

  const handleLogin = async () => {
    try {
      await request(() => login(email, password));
      navigation.navigate('Main');
    } catch (err) {
      // エラーはuseApiで処理済み
    }
  };

  return (
    <View>
      <TextInput value={email} onChangeText={setEmail} placeholder="メール" />
      <TextInput value={password} onChangeText={setPassword} placeholder="パスワード" />
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      <Button title="ログイン" onPress={handleLogin} disabled={loading} />
      {loading && <Text>ログイン中...</Text>}
    </View>
  );
}
```

---

## 5. Axiosの使用（オプション）

fetchの代わりにAxiosを使うこともできます。

```bash
npm install axios
```

```javascript
import axios from 'axios';

// インスタンス作成
const api = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 10000,
});

// インターセプター（トークン自動付与）
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// インターセプター（エラー処理）
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // トークン切れ：ログアウト
      await AsyncStorage.removeItem('authToken');
      navigation.reset({ routes: [{ name: 'Login' }] });
    }
    return Promise.reject(error);
  }
);

// 使う
const fetchUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};
```

---

## 6. OctoアプリでのAPI構成例

```javascript
// config/api.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://api.octo-reversi.com';

// APIクライアント
class ApiClient {
  async request(endpoint, options = {}) {
    const token = await AsyncStorage.getItem('authToken');

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'APIエラー');
    }

    return response.json();
  }

  get(endpoint) {
    return this.request(endpoint);
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();

// APIサービス
export const authApi = {
  login: (email, password) =>
    apiClient.post('/auth/login', { email, password }),

  register: (email, password, username) =>
    apiClient.post('/auth/register', { email, password, username }),

  logout: () =>
    apiClient.post('/auth/logout'),
};

export const gameApi = {
  getMatches: () =>
    apiClient.get('/matches'),

  createMatch: () =>
    apiClient.post('/matches'),

  getMatch: (matchId) =>
    apiClient.get(`/matches/${matchId}`),

  makeMove: (matchId, position) =>
    apiClient.post(`/matches/${matchId}/moves`, { position }),
};

export const userApi = {
  getProfile: () =>
    apiClient.get('/me'),

  updateProfile: (data) =>
    apiClient.put('/me', data),

  getRating: () =>
    apiClient.get('/me/rating'),
};
```

### 使う

```javascript
import { authApi, gameApi } from '../config/api';

function LoginScreen() {
  const handleLogin = async () => {
    try {
      const { token, user } = await authApi.login(email, password);
      await AsyncStorage.setItem('authToken', token);
      navigation.reset({ routes: [{ name: 'Main' }] });
    } catch (error) {
      alert(error.message);
    }
  };
}

function MatchListScreen() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      const data = await gameApi.getMatches();
      setMatches(data);
    } catch (error) {
      console.error('Failed to load matches:', error);
    }
  };
}
```

---

## 7. WebSocket（リアルタイム通信）

OctoアプリではAction Cableを使ったリアルタイム通信が必要です。

```javascript
import ActionCable from 'react-native-actioncable';

// 接続
const cable = ActionCable.createConsumer('wss://api.octo-reversi.com/cable');

// サブスクリプション
const subscription = cable.subscriptions.create(
  { channel: 'MatchChannel', match_id: '123' },
  {
    received(data) {
      // サーバーからデータを受け取る
      console.log('Received:', data);

      if (data.type === 'move') {
        // 着手を反映
        updateBoard(data.move);
      } else if (data.type === 'game_over') {
        // ゲーム終了
        showGameOver(data.winner);
      }
    },
  }
);

// 送信
subscription.send({ move: { x: 3, y: 4 } });

// 切断
subscription.unsubscribe();
```

---

## 8. Claude Codeへの指示例

```
「ユーザーがメールとパスワードを入力してログインする画面を作って。
APIエンドポイントは POST /api/auth/login で、
成功したらトークンを保存してメイン画面に遷移して」

「対戦一覧を取得する画面を作って。
GET /api/matches で取得できるから、
ローディング中表示とエラーハンドリングも入れて」
```

---

## 次のステップ

- **状態管理** (`04_state_management.md`) - 認証状態やユーザー情報をグローバルに管理する
