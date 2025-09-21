import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Code } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { ApiService } from '../../services/api';
import { useApi } from '../../hooks/useApi';
import type { ChatMessage, Repository } from '../../types';

interface ChatInterfaceProps {
  repository: Repository;
}

export function ChatInterface({ repository }: ChatInterfaceProps) {
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
    <div className="flex flex-col h-full">
      {/* Repository Info */}
      <Card className="mb-4">
        <CardContent className="py-3">
          <div className="flex items-center space-x-3">
            <Code className="w-5 h-5 text-purple-600" />
            <div>
              <h3 className="font-medium text-gray-900">{repository.name}</h3>
              <p className="text-sm text-gray-600">
                {repository.fileCount} files • Uploaded {new Date(repository.uploadedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert type="error" className="mb-4">
          {error}
        </Alert>
      )}

      {/* Messages */}
      <Card className="flex-1 mb-4">
        <CardContent className="h-96 overflow-y-auto p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 ${
                  message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'user' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-blue-100 text-blue-600'
                }`}>
                  {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`max-w-3xl ${
                  message.type === 'user' ? 'text-right' : ''
                }`}>
                  <div className={`rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <div className="animate-pulse flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    <span className="text-sm text-gray-600">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </CardContent>
      </Card>

      {/* Input */}
      <Card>
        <CardContent className="p-4">
          <div className="flex space-x-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question about the repository..."
              className="flex-1 resize-none rounded-lg border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
              rows={2}
              disabled={loading}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              loading={loading}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}