import React from 'react';
import { ChatBox } from '../components/ChatBox';
import type { Repository } from '../types';

interface ChatPageProps {
  repository: Repository;
  onNewUpload: () => void;
}

export function ChatPage({ repository, onNewUpload }: ChatPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Chat with Your Repository
          </h1>
          <p className="text-gray-600 mb-4">
            Ask questions about your code and get intelligent insights
          </p>
          <button
            onClick={onNewUpload}
            className="text-purple-600 hover:text-purple-700 font-medium text-sm"
          >
            ← Upload New Repository
          </button>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <ChatBox repository={repository} />
        </div>
      </div>
    </div>
  );
}