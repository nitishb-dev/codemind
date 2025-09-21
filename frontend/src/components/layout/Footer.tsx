import React from 'react';
import { Heart, ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">About CodeMind Lite</h3>
            <p className="text-sm text-gray-600">
              An AI-powered tool for analyzing Python repositories, generating documentation, 
              and providing intelligent code insights through natural language chat.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Features</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Repository upload & analysis</li>
              <li>• AI-generated documentation</li>
              <li>• Interactive code chat</li>
              <li>• Intelligent code search</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Deployment</h3>
            <div className="flex flex-col space-y-2 text-sm">
              <a
                href="https://vercel.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-700 flex items-center space-x-1"
              >
                <span>Frontend on Vercel</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://render.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
              >
                <span>Backend on Render</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200 flex items-center justify-center">
          <p className="text-sm text-gray-600 flex items-center space-x-1">
            <span>Built with</span>
            <Heart className="w-4 h-4 text-red-500" />
            <span>for developers</span>
          </p>
        </div>
      </div>
    </footer>
  );
}