/**
 * 导航配置
 */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

// Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import ChatScreen from '../screens/ChatScreen';
import BrainScreen from '../screens/BrainScreen';
import BrainChatScreen from '../screens/BrainChatScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Icon
const TabIcon = ({ label, focused }) => (
  <View style={styles.tabIcon}>
    <Text style={[styles.tabIconText, focused && styles.tabIconFocused]}>
      {label === '首页' ? '🏠' : label === '智囊' ? '🧠' : '👤'}
    </Text>
  </View>
);

// 主 Tab 导航
const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: styles.tabBar,
      tabBarActiveTintColor: '#9b90ff',
      tabBarInactiveTintColor: '#757481',
      tabBarLabelStyle: styles.tabLabel,
    }}>
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{ title: '首页', tabBarIcon: ({ focused }) => <TabIcon label="首页" focused={focused} /> }}
    />
    <Tab.Screen
      name="Brain"
      component={BrainScreen}
      options={{ title: '智囊', tabBarIcon: ({ focused }) => <TabIcon label="智囊" focused={focused} /> }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{ title: '我的', tabBarIcon: ({ focused }) => <TabIcon label="我的" focused={focused} /> }}
    />
  </Tab.Navigator>
);

// Auth Stack
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

// Main Stack (with tabs)
const MainStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#0d0e13' },
      headerTintColor: '#e6e4f3',
      headerTitleStyle: { fontWeight: '600' },
    }}>
    <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
    <Stack.Screen name="Chat" component={ChatScreen} options={{ title: '对话' }} />
    <Stack.Screen name="BrainChat" component={BrainChatScreen} options={{ title: '智囊任务' }} />
  </Stack.Navigator>
);

// Root Navigator
const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>加载中...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loading: { flex: 1, backgroundColor: '#0d0e13', justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#9b90ff', fontSize: 16 },
  tabBar: { backgroundColor: '#0d0e13', borderTopColor: '#191921', paddingTop: 8, paddingBottom: 8, height: 60 },
  tabLabel: { fontSize: 12, marginTop: 4 },
  tabIcon: { alignItems: 'center', justifyContent: 'center' },
  tabIconText: { fontSize: 22, opacity: 0.6 },
  tabIconFocused: { opacity: 1 },
});

export default AppNavigator;
