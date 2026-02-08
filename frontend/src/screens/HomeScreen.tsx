import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Home, User, Gamepad2, Trophy } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  Ranking: undefined;
};

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

export const HomeScreen = ({ navigation }: HomeScreenProps) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Content */}
      <View style={styles.content}>
        {/* Logo Area */}
        <View style={styles.logoArea}>
          {/* Logo Icon */}
          <View style={styles.logoIcon}>
            <Text style={styles.logoText}>◉</Text>
          </View>

          {/* Title */}
          <Text style={styles.titleText}>オクト対戦</Text>

          {/* Subtitle */}
          <Text style={styles.subtitleText}>OCTO BATTLE</Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.primaryButton} activeOpacity={0.7}>
            <Text style={styles.primaryButtonText}>マイページ</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.7}>
            <Text style={styles.secondaryButtonText}>ルームに入る</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        {/* Home Tab (Active) */}
        <TouchableOpacity style={styles.tabItem} activeOpacity={0.7}>
          <Home size={24} color={COLORS.tabActive} strokeWidth={2} />
          <Text style={styles.tabLabelActive}>ホーム</Text>
        </TouchableOpacity>

        {/* MyPage Tab */}
        <TouchableOpacity style={styles.tabItem} activeOpacity={0.7}>
          <User size={24} color={COLORS.tabInactive} strokeWidth={2} />
          <Text style={styles.tabLabelInactive}>マイページ</Text>
        </TouchableOpacity>

        {/* Rooms Tab */}
        <TouchableOpacity style={styles.tabItem} activeOpacity={0.7}>
          <Gamepad2 size={24} color={COLORS.tabInactive} strokeWidth={2} />
          <Text style={styles.tabLabelInactive}>ルーム</Text>
        </TouchableOpacity>

        {/* Ranking Tab */}
        <TouchableOpacity
          style={styles.tabItem}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Ranking')}
        >
          <Trophy size={24} color={COLORS.tabInactive} strokeWidth={2} />
          <Text style={styles.tabLabelInactive}>ランキング</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Design values from Pencil
const COLORS = {
  background: '#0A0F1C',
  card: '#1E293B',
  primary: '#22D3EE',
  text: '#FFFFFF',
  textSecondary: '#64748B',
  tabActive: '#22D3EE',
  tabInactive: '#475569',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  logoArea: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoIcon: {
    width: 120,
    height: 120,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 64,
    fontWeight: 'bold',
    color: COLORS.background,
  },
  titleText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 14,
    fontWeight: '500' as any,
    color: COLORS.textSecondary,
    letterSpacing: 4,
  },
  buttons: {
    width: '100%',
  },
  primaryButton: {
    width: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 48,
    marginBottom: 16,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '600' as any,
    color: COLORS.background,
  },
  secondaryButton: {
    width: '100%',
    backgroundColor: COLORS.card,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 48,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '500' as any,
    color: COLORS.text,
  },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tabItem: {
    alignItems: 'center',
  },
  tabLabelActive: {
    fontSize: 10,
    fontWeight: '600' as any,
    color: COLORS.tabActive,
    marginTop: 4,
  },
  tabLabelInactive: {
    fontSize: 10,
    fontWeight: '500' as any,
    color: COLORS.tabInactive,
    marginTop: 4,
  },
});
