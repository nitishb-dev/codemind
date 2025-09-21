import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import type { ApiResponse, ChatResponse, Repository } from '../types';

// Configure axios defaults
axios.defaults.timeout = 30000; // 30 seconds
axios.defaults.headers.common['Content-Type'] = 'application/json';

export class ApiService {
  static async uploadRepository(file: File): Promise<ApiResponse<Repository>> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(API_ENDPOINTS.UPLOAD, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Upload failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  }

  static async generateDocumentation(repoId: string): Promise<ApiResponse<string>> {
    try {
      const response = await axios.post(API_ENDPOINTS.GENERATE_DOCS, {
        repo_id: repoId,
      });

      return {
        success: true,
        data: response.data.documentation,
      };
    } catch (error) {
      console.error('Documentation generation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Documentation generation failed',
      };
    }
  }

  static async chat(repoId: string, message: string): Promise<ApiResponse<ChatResponse>> {
    try {
      const response = await axios.post(API_ENDPOINTS.CHAT, {
        repo_id: repoId,
        message,
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Chat request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Chat request failed',
      };
    }
  }

  static async checkHealth(): Promise<boolean> {
    try {
      const response = await axios.get(API_ENDPOINTS.HEALTH);
      return response.data === 'ok' || response.data.status === 'ok';
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
}