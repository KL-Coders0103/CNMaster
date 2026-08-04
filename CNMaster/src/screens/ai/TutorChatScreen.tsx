import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ArrowLeft, Send, Sparkles, Bot } from 'lucide-react-native';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';

import { useTheme } from '../../theme/ThemeProvider';
import { useAiStore } from '../../store/useAiStore';

export const TutorChatScreen = () => {
  const { theme } = useTheme();
  const route = useRoute();
  const navigation = useNavigation();
  const { noteId } = route.params as { noteId: string };

  const { messages, isTyping, sendMessage, clearChat } = useAiStore();
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    clearChat();
    useAiStore.setState({
      messages: [{
        id: 'initial',
        role: 'assistant',
        content: "Hi! I'm your CN Master AI Tutor. I can see the note you're studying right now. What concept can I help clarify?",
        timestamp: new Date()
      }]
    });
  }, []);

  const handleSend = () => {
    if (!inputText.trim() || isTyping) return;
    const textToSend = inputText;
    setInputText('');
    sendMessage(noteId, textToSend);
  };

  const renderMessage = ({ item }: { item: any }) => {
    const isUser = item.role === 'user';
    return (
      <Animated.View 
        entering={isUser ? FadeInUp : FadeInDown}
        style={[
          styles.messageWrapper,
          isUser ? styles.messageUserWrapper : styles.messageAiWrapper
        ]}
      >
        {!isUser && (
          <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
            <Bot size={16} color="#FFF" />
          </View>
        )}
        <View style={[
          styles.messageBubble,
          isUser 
            ? { backgroundColor: theme.colors.primary, borderBottomRightRadius: 4 }
            : { backgroundColor: theme.colors.surface, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: theme.colors.border }
        ]}>
          <Text style={[
            styles.messageText,
            { color: isUser ? '#FFF' : theme.colors.text }
          ]}>
            {item.content}
          </Text>
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>

      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>AI Tutor</Text>
          <View style={styles.statusRow}>
            <Sparkles size={12} color="#10B981" />
            <Text style={styles.statusText}>Powered by Groq</Text>
          </View>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView 
        style={styles.flex1} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.chatContainer}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
          ListFooterComponent={
            isTyping ? (
              <View style={[styles.messageWrapper, styles.messageAiWrapper]}>
                <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
                  <Bot size={16} color="#FFF" />
                </View>
                <View style={[styles.messageBubble, { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border }]}>
                   <ActivityIndicator size="small" color={theme.colors.primary} />
                </View>
              </View>
            ) : null
          }
        />

        <View style={[styles.inputContainer, { backgroundColor: theme.colors.background, borderTopColor: theme.colors.border }]}>
          <TextInput
            style={[styles.textInput, { backgroundColor: theme.colors.surface, color: theme.colors.text, borderColor: theme.colors.border }]}
            placeholder="Ask about this topic..."
            placeholderTextColor={theme.colors.textSecondary}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity 
            style={[styles.sendBtn, { backgroundColor: inputText.trim() && !isTyping ? theme.colors.primary : theme.colors.surface }]}
            onPress={handleSend}
            disabled={!inputText.trim() || isTyping}
          >
            <Send size={20} color={inputText.trim() && !isTyping ? '#FFF' : theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex1: { flex: 1 },
  
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 12, borderBottomWidth: 1 },
  iconBtn: { padding: 8 },
  headerTitleContainer: { alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  statusText: { fontSize: 11, color: '#10B981', fontWeight: '700', textTransform: 'uppercase' },

  chatContainer: { padding: 16, paddingBottom: 24, gap: 16 },
  
  messageWrapper: { flexDirection: 'row', marginBottom: 12, maxWidth: '85%' },
  messageUserWrapper: { alignSelf: 'flex-end', justifyContent: 'flex-end' },
  messageAiWrapper: { alignSelf: 'flex-start', alignItems: 'flex-end' },
  
  avatar: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 8, marginBottom: 4 },
  
  messageBubble: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 20 },
  messageText: { fontSize: 16, lineHeight: 24 },

  inputContainer: { flexDirection: 'row', alignItems: 'flex-end', padding: 16, borderTopWidth: 1 },
  textInput: { flex: 1, minHeight: 48, maxHeight: 120, borderWidth: 1, borderRadius: 24, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 14, fontSize: 16, marginRight: 12 },
  sendBtn: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
});