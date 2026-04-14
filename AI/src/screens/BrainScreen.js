/**
 * 智囊 - 任务列表
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  RefreshControl,
} from 'react-native';
import { brainAPI } from '../api/apiService';

const TASK_TYPES = [
  { id: 'ppt', name: 'PPT助手', icon: '📊', desc: '帮你制作演示文稿' },
  { id: 'plan', name: '计划专家', icon: '📋', desc: '制定详细执行计划' },
  { id: 'critic', name: '批评家', icon: '🔍', desc: '深度分析改进建议' },
  { id: 'writer', name: '写作助手', icon: '✍️', desc: '各类文案撰写' },
  { id: 'analysis', name: '分析专家', icon: '📈', desc: '数据与趋势分析' },
  { id: 'code', name: '代码助手', icon: '💻', desc: '编程问题解答' },
];

const BrainScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await brainAPI.listTasks();
      setTasks(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Failed to load tasks:', e);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadTasks();
    setRefreshing(false);
  }, []);

  const createTask = async (type) => {
    try {
      const task = await brainAPI.createTask({
        task_type: type.id,
        title: type.name,
        query: '',
      });
      navigation.navigate('BrainChat', { 
        taskId: task.id, 
        title: type.name,
      });
    } catch (e) {
      Alert.alert('错误', '创建任务失败');
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'done': return '已完成';
      case 'doing': return '进行中';
      default: return '待处理';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>智囊</Text>
        <Text style={styles.subtitle}>6大 AI 专家来帮你</Text>
      </View>

      <View style={styles.grid}>
        {TASK_TYPES.map((type) => (
          <TouchableOpacity
            key={type.id}
            style={styles.card}
            onPress={() => createTask(type)}>
            <Text style={styles.cardIcon}>{type.icon}</Text>
            <Text style={styles.cardName}>{type.name}</Text>
            <Text style={styles.cardDesc}>{type.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>最近任务</Text>

      <FlatList
        data={tasks.slice(0, 10)}
        keyExtractor={(item) => String(item.id)}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#9b90ff" />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.taskItem}
            onPress={() => navigation.navigate('BrainChat', { 
              taskId: item.id, 
              title: item.title, 
            })}>
            <View style={styles.taskInfo}>
              <Text style={styles.taskTitle}>{item.title}</Text>
              <Text style={styles.taskType}>{item.task_type}</Text>
            </View>
            <Text style={[
              styles.taskStatus,
              item.status === 'done' && styles.statusDone
            ]}>
              {getStatusText(item.status)}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>暂无任务，点击上方卡片创建</Text>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0e13' },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#9b90ff' },
  subtitle: { fontSize: 14, color: '#abaab8', marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, paddingVertical: 8 },
  card: { width: '50%', padding: 8 },
  cardIcon: { fontSize: 32, marginBottom: 8 },
  cardName: { fontSize: 16, fontWeight: '600', color: '#e6e4f3' },
  cardDesc: { fontSize: 12, color: '#757481', marginTop: 4 },
  sectionTitle: { fontSize: 14, color: '#abaab8', paddingHorizontal: 20, marginTop: 16, marginBottom: 8 },
  taskItem: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingVertical: 14, 
    borderBottomWidth: 1, 
    borderBottomColor: '#191921' 
  },
  taskInfo: { flex: 1 },
  taskTitle: { fontSize: 16, color: '#e6e4f3' },
  taskType: { fontSize: 12, color: '#757481', marginTop: 2 },
  taskStatus: { fontSize: 12, color: '#9b90ff' },
  statusDone: { color: '#4ade80' },
  empty: { textAlign: 'center', color: '#757481', marginTop: 20 },
});

export default BrainScreen;
