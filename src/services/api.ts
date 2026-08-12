import axios from 'axios';
import type { ContactFormData, ApiResponse } from '../types';

// Create axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Send contact message
export const sendContactMessage = async (data: ContactFormData): Promise<ApiResponse<null>> => {
  const response = await api.post('/api/contact', data);
  return response.data;
};

// Subscribe to newsletter
export const subscribeNewsletter = async (email: string): Promise<ApiResponse<null>> => {
  const response = await api.post('/api/newsletter', { email });
  return response.data;
};

export default api;