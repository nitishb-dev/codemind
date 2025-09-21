// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:10000';

export const API_ENDPOINTS = {
  UPLOAD: `${API_BASE_URL}/upload`,
  GENERATE_DOCS: `${API_BASE_URL}/generate_docs`,
  CHAT: `${API_BASE_URL}/chat`,
  HEALTH: `${API_BASE_URL}/health`,
} as const;

export { API_BASE_URL };