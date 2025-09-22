import React from 'react';
import { FileUpload } from '../components/FileUpload';
import type { Repository } from '../types';

interface UploadPageProps {
  onUploadSuccess: (repo: Repository) => void;
}

export function UploadPage({ onUploadSuccess }: UploadPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Analyze Your Python Repository
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Upload your Python repository and let AI generate comprehensive documentation, 
            analyze your code structure, and answer questions about your project.
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <FileUpload onUploadSuccess={onUploadSuccess} />
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📁</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Upload Repository</h3>
            <p className="text-sm text-gray-600">Drag and drop your Python project ZIP file</p>
          </div>
          
          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🤖</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">AI Analysis</h3>
            <p className="text-sm text-gray-600">Get intelligent insights and documentation</p>
          </div>
          
          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💬</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Interactive Chat</h3>
            <p className="text-sm text-gray-600">Ask questions about your code naturally</p>
          </div>
        </div>
      </div>
    </div>
  );
}