/**
 * 智囊 - 任务对话界面
 */
import React, { useState, useEffect } from 'react';
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
import { brainAPI } from '../api/apiService';

const BrainChatScreen = ({ route }) => {
  const { taskId } = route.params;
  const [task, setTask] = useState(null);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTask();
  }, []);

  const loadTask = async () => {
    try {
      const data = await brainAPI.getTask(taskId);
      setTask(data);
    } catch (e) {
      console.error('Failed to load task:', e);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim() || loading) return;
    const text = inputText.trim();
    setInputText('');
    setLoading(true);
    try {
      const res = await brainAPI.updateTask(taskId, { user_input: text });
      setTask(res);
    } catch (e) {
      console.error('Failed to send:', e);
    } finally {
      setLoading(false);
    }
  };

  const executeTask = async () => {
    setLoading(true);
    try {
      const res = await brainAPI.executeTask(taskId);
      setTask(res);
    } catch (e) {
      console.error('Failed to execute:', e);
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
        <Text style={styles.taskStatus}>{task?.status || '进行中'}</Text>
      </View>

      <View style={styles.content}>
        {task?.result ? (
          <View style={styles.resultContainer}>
            <Text style={styles.resultLabel}>AI 回复</Text>
            <Text style={styles.resultText}>{task.result}</Text>
          </View>
        ) : (
          <Text style={styles.placeholder}>输入你的问题，AI 专家为你解答</Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="输入问题..."
          placeholderTextColor="#757481"
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={1000}
        />
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={sendMessage}
          disabled={loading}>
          <Text style={styles.buttonText}>发送</Text>
        </TouchableOpacity>
      </View>

      {task?.status === 'pending' && (
        <TouchableOpacity
          style={styles.executeButton}
          onPress={executeTask}
          disabled={loading}>
          <Text style={styles.executeText}>执行任务</Text>
        </TouchableOpacity>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0e13' },
  taskHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#191921' },
  taskTitle: { fontSize: 18, fontWeight: '600', color: '#e6e4f3' },
  taskStatus: { fontSize: 12, color: '#9b90ff' },
  content: { flex: 1, padding: 16 },
  resultContainer: { backgroundColor: '#191921', padding: 16, borderRadius: 12 },
  resultLabel: { fontSize: 12, color: '#9b90ff', marginBottom: 8 },
  resultText: { fontSize: 16, color: '#e6e4f3', lineHeight: 24 },
  placeholder: { textAlign: 'center', color: '#757481', marginTop: 100 },
  inputContainer: { flexDirection: 'row', padding: 12, borderTopWidth: 1, borderTopColor: '#191921', alignItems: 'flex-end' },
  input: { flex: 1, backgroundColor: '#191921', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 16, color: '#e6e4f3', maxHeight: 100 },
  button: { backgroundColor: '#9b90ff', borderRadius: 20, paddingHorizontal: 20, paddingVertical: 10, marginLeft: 8 },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  executeButton: { backgroundColor: '#4ade80', margin: 12, padding: 14, borderRadius: 12, alignItems: 'center' },
  executeText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default BrainChatScreen;
