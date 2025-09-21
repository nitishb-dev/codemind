import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Code, Clock } from 'lucide-react';
import { ApiService } from '../services/api';
import { useApi } from '../hooks/useApi';
import type { ChatMessage, Repository } from '../types';

interface ChatBoxProps {
  repository: Repository;
}

export function ChatBox({ repository }: ChatBoxProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: `Hello! I'm ready to help you understand the **${repository.name}** repository. You can ask me questions like:

• "What does main.py do?"
• "Show me the main functions"
• "Explain the project structure"
• "What are the dependencies?"

What would you like to know?`,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const { loading, error, executeRequest } = useApi();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    const response = await executeRequest(() => 
      ApiService.chat(repository.id, userMessage.content)
    );

    if (response) {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.message,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
      {/* Repository Info Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4">
        <div className="flex items-center space-x-3">
          <Code className="w-6 h-6" />
          <div>
            <h3 className="font-semibold text-lg">{repository.name}</h3>
            <div className="flex items-center space-x-4 text-sm text-purple-100">
              <span>{repository.fileCount} files</span>
              <span className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>Uploaded {new Date(repository.uploadedAt).toLocaleDateString()}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-b border-red-200 p-4">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Messages */}
      <div className="h-96 overflow-y-auto p-6 space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-4 ${
              message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              message.type === 'user' 
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                : 'bg-blue-100 text-blue-600'
            }`}>
              {message.type === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            </div>
            <div className={`max-w-3xl ${
              message.type === 'user' ? 'text-right' : ''
            }`}>
              <div className={`rounded-2xl p-4 ${
                message.type === 'user'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
              </div>
              <div className="text-xs text-gray-500 mt-2 px-2">
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div className="bg-gray-100 rounded-2xl p-4">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="text-sm text-gray-600">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex space-x-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question about the repository..."
            className="flex-1 resize-none rounded-xl border border-gray-300 px-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
            rows={2}
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}