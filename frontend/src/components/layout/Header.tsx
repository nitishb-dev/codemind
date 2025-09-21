import React from 'react';
import { Brain, Github } from 'lucide-react';

interface HeaderProps {
  onNewUpload?: () => void;
  showNewUpload?: boolean;
}

export function Header({ onNewUpload, showNewUpload = false }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">CodeMind Lite</h1>
              <p className="text-sm text-gray-600 hidden sm:block">AI Repository Analysis & Chat</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {showNewUpload && (
              <button
                onClick={onNewUpload}
                className="text-sm font-medium text-purple-600 hover:text-purple-700 px-3 py-1 rounded-md hover:bg-purple-50 transition-colors"
              >
                New Upload
              </button>
            )}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
              title="View on GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}