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
    setRepository(repo);
    setCurrentState('chat');
  };

  const handleNewUpload = () => {
    setRepository(null);
    setCurrentState('upload');
  };

  return (
    <div className="min-h-screen">
      <Navbar 
        onNewUpload={handleNewUpload}
        showNewUpload={currentState === 'chat'}
      />
      
      {/* Backend Status Alert */}
      {backendStatus === 'checking' && (
        <div className="bg-blue-50 border-b border-blue-200 p-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center space-x-3 text-blue-800">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">Connecting to backend...</span>
            </div>
          </div>
        </div>
      )}
      
      {backendStatus === 'offline' && (
        <div className="bg-yellow-50 border-b border-yellow-200 p-4">
          <div className="container mx-auto px-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-yellow-800">
                <h4 className="font-medium mb-1">Backend Offline</h4>
                <div className="text-sm">
                  <div className="flex items-center space-x-2 mb-1">
                    <Wifi className="w-4 h-4" />
                    <span>Unable to connect to the backend server.</span>
                  </div>
                  <p>
                    Make sure the FastAPI backend is running and accessible. 
                    Check your <code className="bg-yellow-100 px-1 rounded">VITE_API_URL</code> environment variable.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      {currentState === 'upload' && (
        <UploadPage onUploadSuccess={handleUploadSuccess} />
      )}

      {currentState === 'chat' && repository && (
        <ChatPage repository={repository} onNewUpload={handleNewUpload} />
      )}
    </div>
  );
}

export default App;