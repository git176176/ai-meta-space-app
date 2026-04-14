/**
 * AI Meta Space - React Native App
 */
import React, { useEffect } from 'react';
import { StatusBar, LogBox, Platform, Alert } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

// 极光推送
import JPush from 'jpush-react-native';

// 忽略一些警告
LogBox.ignoreLogs(['Require cycle']);

// 初始化极光推送
const initJPush = () => {
  if (Platform.OS === 'android') {
    JPush.init({
      appKey: 'your_jpush_app_key', // 需要替换为实际的 AppKey
      channel: 'dev',
      production: false, // true 表示生产环境
    });

    // 连接成功
    JPush.connectListener((result) => {
      console.log('JPush connected:', result);
    });

    // 收到通知
    JPush.addNotifyListener((result) => {
      console.log('收到通知:', result);
      Alert.alert(
        result.notification?.title || '新消息',
        result.notification?.content || '',
      );
    });

    // 收到自定义消息
    JPush.addCustomMessageListener((result) => {
      console.log('收到自定义消息:', result);
    });

    // 设置标签
    JPush.setTags({ tags: ['user'] });
  }
};

const App = () => {
  useEffect(() => {
    initJPush();

    return () => {
      // 清理监听器
      JPush.removeNotifyListener();
      JPush.removeCustomMessageListener();
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor="#0d0e13" />
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </GestureHandlerRootView>
  );
};

export default App;
