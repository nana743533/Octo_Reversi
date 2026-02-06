import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing } from '../constants';
import {
  HomeScreen,
  MyPageScreen,
  RankingScreen,
  MatchHistoryScreen,
  RoomListScreen,
} from '../screens';

const Tab = createBottomTabNavigator();

const TabIcon: React.FC<{ name: string; focused: boolean }> = ({ name, focused }) => {
  const icons: Record<string, string> = {
    Home: '🏠',
    MyPage: '👤',
    Ranking: '🏆',
    MatchHistory: '📜',
    RoomList: '🏠',
  };

  return (
    <View style={styles.tabIcon}>
      <Text style={[styles.tabIconText, focused && styles.tabIconFocused]}>
        {icons[name] || '•'}
      </Text>
    </View>
  );
};

export const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'ホーム',
          tabBarIcon: ({ focused }) => <TabIcon name="Home" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="MyPage"
        component={MyPageScreen}
        options={{
          tabBarLabel: 'マイページ',
          tabBarIcon: ({ focused }) => <TabIcon name="MyPage" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Ranking"
        component={RankingScreen}
        options={{
          tabBarLabel: 'ランキング',
          tabBarIcon: ({ focused }) => <TabIcon name="Ranking" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="MatchHistory"
        component={MatchHistoryScreen}
        options={{
          tabBarLabel: '履歴',
          tabBarIcon: ({ focused }) => <TabIcon name="MatchHistory" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="RoomList"
        component={RoomListScreen}
        options={{
          tabBarLabel: 'ルーム',
          tabBarIcon: ({ focused }) => <TabIcon name="RoomList" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.backgroundDark,
    borderTopColor: Colors.border,
    borderTopWidth: 1,
    height: 80,
    paddingBottom: Spacing.md,
    paddingTop: Spacing.sm,
  },
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconText: {
    fontSize: 24,
  },
  tabIconFocused: {
    tintColor: Colors.primary,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600' as const,
  },
});
