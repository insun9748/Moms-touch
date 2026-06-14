import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';

type Message = { id: number; text: string; from: 'user' | 'bot' };

const INITIAL: Message[] = [
  { id: 0, text: '안녕하세요! 어떤 레시피를 기록할까요? 편하게 말씀해 주세요 😊', from: 'bot' },
];

export default function RecipeChat() {
  const navigation = useNavigation() as any;
  const [messages, setMessages] = useState<Message[]>(INITIAL);
  const [input, setInput] = useState('');

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMessages(prev => [...prev, { id: Date.now(), text, from: 'user' }]);
    setInput('');
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Image source={require('../assets/images/back.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>채팅으로 남기기</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* 메시지 목록 */}
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={0}>
        <ScrollView
          style={styles.messageList}
          contentContainerStyle={{ padding: 20, gap: 12 }}
          showsVerticalScrollIndicator={false}
        >
          {messages.map(msg => (
            <View key={msg.id} style={[styles.bubble, msg.from === 'user' ? styles.bubbleUser : styles.bubbleBot]}>
              <Text style={[styles.bubbleText, msg.from === 'user' && styles.bubbleTextUser]}>{msg.text}</Text>
            </View>
          ))}
        </ScrollView>

        {/* 입력창 */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="레시피를 입력해 주세요"
            placeholderTextColor="#B0ABAA"
            multiline
            returnKeyType="send"
            onSubmitEditing={send}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={send} activeOpacity={0.8}>
            <Text style={styles.sendBtnText}>전송</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FCFCFC' },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 28, paddingTop: 17, paddingBottom: 12,
  },
  backBtn: { padding: 4, width: 28, height: 28, justifyContent: 'center' },
  backIcon: { width: 20, height: 20, resizeMode: 'contain' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#181818' },

  messageList: { flex: 1 },

  bubble: {
    maxWidth: '80%', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 10,
  },
  bubbleBot: { backgroundColor: '#F2F2F2', alignSelf: 'flex-start' },
  bubbleUser: { backgroundColor: '#FFA23E', alignSelf: 'flex-end' },
  bubbleText: { fontSize: 14, color: '#181818', lineHeight: 20 },
  bubbleTextUser: { color: '#FFFFFF' },

  inputRow: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 8,
    paddingHorizontal: 20, paddingVertical: 12,
    borderTopWidth: 1, borderTopColor: '#E6E6E6', backgroundColor: '#FCFCFC',
  },
  input: {
    flex: 1, minHeight: 44, maxHeight: 120,
    backgroundColor: '#F2F2F2', borderRadius: 22,
    paddingHorizontal: 16, paddingVertical: 10,
    fontSize: 14, color: '#181818',
  },
  sendBtn: {
    backgroundColor: '#FFA23E', borderRadius: 22,
    height: 44, paddingHorizontal: 18,
    justifyContent: 'center', alignItems: 'center',
  },
  sendBtnText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
});
