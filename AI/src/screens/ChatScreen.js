/**
 * 智问 - 对话界面
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { chatAPI } from '../api/apiService';

const ChatScreen = ({ route }) => {
  const { sessionId } = route.params;
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    loadChat();
  }, []);

  const loadChat = async () => {
    try {
      const session = await chatAPI.getSession(sessionId);
      setMessages(session.messages || []);
    } catch (e) {
      console.error('Failed to load chat:', e);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim() || loading) return;
    
    const text = inputText.trim();
    setInputText('');
    setLoading(true);

    // 添加用户消息
    setMessages(prev => [...prev, {
      id: Date.now(),
      role: 'user',
      content: text,
    }]);

    try {
      const res = await chatAPI.sendMessage(sessionId, text);
      setMessages(prev => [...prev, res]);
    } catch (e) {
      console.error('Failed to send message:', e);
      // 添加错误消息
      setMessages(prev => [...prev, {
        id: Date.now(),
        role: 'assistant',
        content: '发送失败，请重试',
      }]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }) => {
    const isUser = item.role === 'user';
    return (
      <View style={[
        styles.messageBubble,
        isUser ? styles.userBubble : styles.aiBubble
      ]}>
        <Text style={[
          styles.messageText,
          isUser ? styles.userText : styles.aiText
        ]}>
          {item.content}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderMessage}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        ListEmptyComponent={
          <Text style={styles.empty}>开始和 AI 对话吧</Text>
        }
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="输入消息..."
          placeholderTextColor="#757481"
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={2000}
        />
        <TouchableOpacity 
          style={[styles.sendButton, loading && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={loading}>
          <Text style={styles.sendText}>
            {loading ? '...' : '发送'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0e13',
  },
  messageList: {
    padding: 16,
    flexGrow: 1,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#9b90ff',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#191921',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#fff',
  },
  aiText: {
    color: '#e6e4f3',
  },
  empty: {
    textAlign: 'center',
    color: '#757481',
    marginTop: 100,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#191921',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#191921',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: '#e6e4f3',
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#9b90ff',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginLeft: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ChatScreen;
