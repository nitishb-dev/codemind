import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { UploadPage } from './pages/UploadPage';
import { ChatPage } from './pages/ChatPage';
import { ApiService } from './services/api';
import type { Repository } from './types';
import { AlertTriangle, Wifi } from 'lucide-react';

type AppState = 'upload' | 'chat';

function App() {
  const [currentState, setCurrentState] = useState<AppState>('upload');
  const [repository, setRepository] = useState<Repository | null>(null);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  // Check backend health on mount
  useEffect(() => {
    const checkBackendHealth = async () => {
      const isHealthy = await ApiService.checkHealth();
      setBackendStatus(isHealthy ? 'online' : 'offline');
    };

    checkBackendHealth();
    
    // Check every 30 seconds
    const interval = setInterval(checkBackendHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleUploadSuccess = (repo: Repository) => {
    // The backend sends snake_case keys (e.g., uploaded_at), but the frontend
    // components expect camelCase. The `repo` object received here is the raw
    // backend response, so we cast it to `any` to access the correct properties
    // and then create a correctly-shaped object for our frontend state.
    const backendRepo = repo as any;
    const formattedRepo: Repository = { 
      ...backendRepo, 
      uploadedAt: backendRepo.uploaded_at,       fileCount: backendRepo.file_count 
    };
    setRepository(formattedRepo);
    setCurrentState('chat');
  };

  const handleNewUpload = () => {
    setRepository(null);
    setCurrentState('upload');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        onNewUpload={handleNewUpload}
        showNewUpload={currentState === 'chat'}
      />
      
      {/* Backend Status Alert */}
      {backendStatus === 'checking' && (
        <div className="bg-blue-100 border-b border-blue-200">
          <div className="container mx-auto px-4">
            <div className="flex items-center space-x-3 text-blue-800 py-3">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-medium">Connecting to backend...</span>
            </div>
          </div>
        </div>
      )}
      
      {backendStatus === 'offline' && (
        <div className="bg-red-50 border-b border-red-200 p-4">
          <div className="container mx-auto">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-red-800">
                <h4 className="font-semibold">Backend Offline</h4>
                <div className="text-sm">
                  <p className="flex items-center space-x-2 mt-1">
                    <Wifi className="w-4 h-4" />
                    <span>Unable to connect to the backend server.</span>
                  </p>
                  <p className="mt-1">
                    Make sure the FastAPI backend is running and accessible. 
                    Check your <code className="bg-red-100 px-1 rounded">VITE_API_URL</code> environment variable.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 flex-grow w-full">
        {currentState === 'upload' && (
          <UploadPage onUploadSuccess={handleUploadSuccess} />
        )}

        {currentState === 'chat' && repository && (
          <ChatPage repository={repository} onNewUpload={handleNewUpload} />
        )}
      </main>
    </div>
  );
}

export default App;