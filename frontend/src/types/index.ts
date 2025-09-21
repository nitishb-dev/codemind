export interface Repository {
  id: string;
  name: string;
  uploadedAt: string;
  fileCount: number;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatResponse {
  message: string;
  relevantFiles?: string[];
  codeSnippets?: Array<{
    file: string;
    content: string;
    language: string;
  }>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}