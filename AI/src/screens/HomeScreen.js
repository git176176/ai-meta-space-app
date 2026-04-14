/**
 * 智问 - AI 对话首页
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { chatAPI } from '../api/apiService';

const HomeScreen = ({ navigation }) => {
  const [sessions, setSessions] = useState([]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const data = await chatAPI.listSessions();
      setSessions(data);
    } catch (e) {
      console.error('Failed to load sessions:', e);
    }
  };

  const createNewChat = async () => {
    try {
      const session = await chatAPI.createSession({ title: '新对话' });
      navigation.navigate('Chat', { sessionId: session.id, title: '新对话' });
    } catch (e) {
      console.error('Failed to create session:', e);
    }
  };

  const enterChat = (session) => {
    navigation.navigate('Chat', { 
      sessionId: session.id, 
      title: session.title || '对话' 
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>智问</Text>
        <Text style={styles.subtitle}>AI 助手</Text>
      </View>

      <TouchableOpacity style={styles.newChat} onPress={createNewChat}>
        <Text style={styles.newChatIcon}>+</Text>
        <Text style={styles.newChatText}>开始新对话</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>历史对话</Text>

      <FlatList
        data={sessions}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.sessionItem}
            onPress={() => enterChat(item)}>
            <Text style={styles.sessionTitle} numberOfLines={1}>
              {item.title || '新对话'}
            </Text>
            <Text style={styles.sessionTime}>
              {new Date(item.updated_at).toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>暂无对话记录</Text>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0e13',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#9b90ff',
  },
  subtitle: {
    fontSize: 14,
    color: '#abaab8',
    marginTop: 4,
  },
  newChat: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#191921',
    marginHorizontal: 20,
    marginVertical: 16,
    padding: 16,
    borderRadius: 12,
  },
  newChatIcon: {
    fontSize: 24,
    color: '#9b90ff',
    marginRight: 12,
  },
  newChatText: {
    fontSize: 16,
    color: '#e6e4f3',
  },
  sectionTitle: {
    fontSize: 14,
    color: '#abaab8',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sessionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#191921',
  },
  sessionTitle: {
    fontSize: 16,
    color: '#e6e4f3',
    flex: 1,
  },
  sessionTime: {
    fontSize: 12,
    color: '#757481',
    marginLeft: 12,
  },
  empty: {
    textAlign: 'center',
    color: '#757481',
    marginTop: 40,
  },
});

export default HomeScreen;
