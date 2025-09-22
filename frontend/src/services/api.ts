import axios from 'axios';
import type { Repository, ChatResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:10000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export class ApiService {
  static async checkHealth(): Promise<boolean> {
    try {
      const response = await api.get('/health');
      return response.status === 200;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  static async uploadRepository(file: File): Promise<Repository> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  static async chat(repoId: string, message: string): Promise<ChatResponse> {
    const response = await api.post('/chat', {
      repo_id: repoId,
      message,
    });

    return response.data;
  }

  static async generateDocs(repoId: string): Promise<{ documentation: string }> {
    const response = await api.post('/generate_docs', {
      repo_id: repoId,
    });

    return response.data;
  }
}