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
  relevant_files: string[];
}

export interface ApiError {
  message: string;
  status?: number;
}