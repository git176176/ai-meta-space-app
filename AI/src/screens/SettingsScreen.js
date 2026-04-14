/**
 * 设置页面
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

const SettingsScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [settings, setSettings] = useState({
    notifications: true,
    sound: true,
    vibration: true,
    darkMode: true,
  });

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogout = () => {
    Alert.alert('退出登录', '确定要退出登录吗？', [
      { text: '取消', style: 'cancel' },
      { text: '确定', onPress: logout },
    ]);
  };

  const SettingItem = ({ title, subtitle, value, onToggle }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#767577', true: '#9b90ff' }}
        thumbColor={value ? '#f4f3f4' : '#f4f3f4'}
      />
    </View>
  );

  const MenuItem = ({ title, onPress }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Text style={styles.menuText}>{title}</Text>
      <Text style={styles.menuArrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>设置</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>账号</Text>
        <View style={styles.accountCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.nickname?.charAt(0)?.toUpperCase() || 'U'}
            </Text>
          </View>
          <View style={styles.accountInfo}>
            <Text style={styles.nickname}>{user?.nickname || '用户'}</Text>
            <Text style={styles.email}>{user?.email}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>通知</Text>
        <View style={styles.card}>
          <SettingItem
            title="推送通知"
            subtitle="接收新消息通知"
            value={settings.notifications}
            onToggle={() => toggleSetting('notifications')}
          />
          <SettingItem
            title="声音"
            subtitle="消息提示音"
            value={settings.sound}
            onToggle={() => toggleSetting('sound')}
          />
          <SettingItem
            title="振动"
            subtitle="消息振动提醒"
            value={settings.vibration}
            onToggle={() => toggleSetting('vibration')}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>关于</Text>
        <View style={styles.card}>
          <MenuItem title="关于我们" onPress={() => Alert.alert('AI 原生元空间', '版本 1.0.0')} />
          <MenuItem title="隐私政策" onPress={() => Alert.alert('隐私政策', '我们将保护您的个人信息')} />
          <MenuItem title="用户协议" onPress={() => Alert.alert('用户协议', '使用前请阅读用户协议')} />
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>退出登录</Text>
      </TouchableOpacity>

      <Text style={styles.version}>版本 1.0.0</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0e13' },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#9b90ff' },
  section: { marginTop: 24, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 14, color: '#abaab8', marginBottom: 8 },
  accountCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#191921', padding: 16, borderRadius: 12 },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#9b90ff', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  accountInfo: { marginLeft: 12 },
  nickname: { fontSize: 18, fontWeight: '600', color: '#e6e4f3' },
  email: { fontSize: 14, color: '#757481', marginTop: 2 },
  card: { backgroundColor: '#191921', borderRadius: 12, overflow: 'hidden' },
  settingItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#0d0e13' },
  settingInfo: { flex: 1 },
  settingTitle: { fontSize: 16, color: '#e6e4f3' },
  settingSubtitle: { fontSize: 12, color: '#757481', marginTop: 2 },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#0d0e13' },
  menuText: { fontSize: 16, color: '#e6e4f3' },
  menuArrow: { fontSize: 20, color: '#757481' },
  logoutButton: { marginHorizontal: 20, marginTop: 40, backgroundColor: '#ff4757', padding: 16, borderRadius: 12, alignItems: 'center' },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  version: { textAlign: 'center', color: '#757481', fontSize: 12, marginTop: 20 },
});

export default SettingsScreen;
