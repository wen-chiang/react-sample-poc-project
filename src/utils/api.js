import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API endpoints
export const api = {
  // Health check
  checkHealth: () => apiClient.get('/health'),

  // Books
  getBooks: () => apiClient.get('/api/v1/books'),
  getBook: (id) => apiClient.get(`/api/v1/books/${id}`),
  createBook: (bookData) => apiClient.post('/api/v1/books', bookData),
  updateBook: (id, bookData) => apiClient.put(`/api/v1/books/${id}`, bookData),
  deleteBook: (id) => apiClient.delete(`/api/v1/books/${id}`),

  // Book Copies
  manageBookCopies: (id, copyData) => 
    apiClient.post(`/api/v1/books/${id}/copies`, copyData),

  // Book Availability
  checkAvailability: (id) => 
    apiClient.get(`/api/v1/books/${id}/availability`),

  // Authentication
  librarianLogin: (credentials) => 
    apiClient.post('/api/v1/librarians/login', credentials),

  // Reports
  getLibrarySummary: () => 
    apiClient.get('/api/v1/reports/summary'),
};

export default apiClient;
