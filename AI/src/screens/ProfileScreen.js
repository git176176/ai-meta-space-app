/**
 * 个人中心
 */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('退出登录', '确定要退出登录吗？', [
      { text: '取消', style: 'cancel' },
      { text: '确定', onPress: logout },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>我的</Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.nickname?.charAt(0)?.toUpperCase() || 'U'}
          </Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.nickname}>{user?.nickname || '用户'}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>
      </View>

      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>意见反馈</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>关于我们</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>退出登录</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0e13' },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#9b90ff' },
  profileCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#191921', marginHorizontal: 20, marginVertical: 20, padding: 20, borderRadius: 16 },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#9b90ff', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  info: { marginLeft: 16 },
  nickname: { fontSize: 20, fontWeight: '600', color: '#e6e4f3' },
  email: { fontSize: 14, color: '#757481', marginTop: 4 },
  menu: { marginTop: 10 },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#191921' },
  menuText: { fontSize: 16, color: '#e6e4f3' },
  menuArrow: { fontSize: 20, color: '#757481' },
  logoutButton: { marginHorizontal: 20, marginTop: 40, backgroundColor: '#ff4757', padding: 16, borderRadius: 12, alignItems: 'center' },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default ProfileScreen;
