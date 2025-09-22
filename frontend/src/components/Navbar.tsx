import React from 'react';
import { Brain, Github } from 'lucide-react';

interface NavbarProps {
  onNewUpload?: () => void;
  showNewUpload?: boolean;
}

export function Navbar({ onNewUpload, showNewUpload = false }: NavbarProps) {
  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
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
                className="px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
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
    </nav>
  );
}