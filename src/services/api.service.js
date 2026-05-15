import api from '../api/axios';

/**
 * Base API Service for future backend integration.
 */
export const apiService = {
  async get(endpoint) {
    try {
      const response = await api.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('API GET Error:', error);
      throw error;
    }
  },

  async post(endpoint, data) {
    try {
      const response = await api.post(endpoint, data);
      return response.data;
    } catch (error) {
      console.error('API POST Error:', error);
      throw error;
    }
  }
};

/**
 * Specific services for the app.
 */
export const contactService = {
  sendMessage: (data) => apiService.post('/contact', data),
};

export const productService = {
  getProducts: () => apiService.get('/products'),
};
