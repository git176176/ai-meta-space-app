/**
 * 智囊 - 任务对话界面
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { brainAPI } from '../api/apiService';

const BrainChatScreen = ({ route }) => {
  const { taskId } = route.params;
  const [task, setTask] = useState(null);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTask();
  }, [taskId]);

  const loadTask = async () => {
    try {
      const data = await brainAPI.getTask(taskId);
      setTask(data);
    } catch (e) {
      console.error('Failed to load task:', e);
    }
  };

  const submitTask = async () => {
    if (!inputText.trim() || loading) return;
    const text = inputText.trim();
    setInputText('');
    setLoading(true);
    try {
      const res = await brainAPI.createTask({
        task_type: task?.task_type || 'writer',
        title: text.substring(0, 50),
        query: text,
      });
      setTask(res);
    } catch (e) {
      console.error('Failed to submit:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}>
      <View style={styles.taskHeader}>
        <Text style={styles.taskTitle}>{task?.title || '智囊任务'}</Text>
        <Text style={[
          styles.taskStatus,
          task?.status === 'done' && styles.statusDone
        ]}>
          {task?.status === 'done' ? '已完成' : task?.status === 'doing' ? '进行中' : '待处理'}
        </Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {task?.result_summary ? (
          <View style={styles.resultContainer}>
            <Text style={styles.resultLabel}>结果</Text>
            <Text style={styles.resultText}>{task.result_summary}</Text>
          </View>
        ) : task?.query ? (
          <View style={styles.queryContainer}>
            <Text style={styles.queryLabel}>你的问题</Text>
            <Text style={styles.queryText}>{task.query}</Text>
          </View>
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderTitle}>🤔 告诉我你的问题</Text>
            <Text style={styles.placeholderSub}>描述你需要的帮助，我会尽力解答</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="输入你的问题..."
          placeholderTextColor="#757481"
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={1000}
        />
        <TouchableOpacity
          style={[styles.button, (!inputText.trim() || loading) && styles.buttonDisabled]}
          onPress={submitTask}
          disabled={!inputText.trim() || loading}>
          <Text style={styles.buttonText}>{loading ? '...' : '发送'}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0e13' },
  taskHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: '#191921' 
  },
  taskTitle: { fontSize: 18, fontWeight: '600', color: '#e6e4f3' },
  taskStatus: { fontSize: 12, color: '#9b90ff' },
  statusDone: { color: '#4ade80' },
  content: { flex: 1 },
  contentContainer: { padding: 16 },
  resultContainer: { backgroundColor: '#191921', padding: 16, borderRadius: 12 },
  resultLabel: { fontSize: 12, color: '#4ade80', marginBottom: 8 },
  resultText: { fontSize: 16, color: '#e6e4f3', lineHeight: 24 },
  queryContainer: { backgroundColor: '#191921', padding: 16, borderRadius: 12 },
  queryLabel: { fontSize: 12, color: '#9b90ff', marginBottom: 8 },
  queryText: { fontSize: 16, color: '#e6e4f3', lineHeight: 24 },
  placeholder: { alignItems: 'center', marginTop: 80 },
  placeholderTitle: { fontSize: 20, color: '#e6e4f3', marginBottom: 8 },
  placeholderSub: { fontSize: 14, color: '#757481', textAlign: 'center' },
  inputContainer: { 
    flexDirection: 'row', 
    padding: 12, 
    borderTopWidth: 1, 
    borderTopColor: '#191921', 
    alignItems: 'flex-end' 
  },
  input: { 
    flex: 1, 
    backgroundColor: '#191921', 
    borderRadius: 20, 
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    fontSize: 16, 
    color: '#e6e4f3', 
    maxHeight: 100 
  },
  button: { backgroundColor: '#9b90ff', borderRadius: 20, paddingHorizontal: 20, paddingVertical: 10, marginLeft: 8 },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default BrainChatScreen;
