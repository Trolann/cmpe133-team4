
import axios from 'axios';

const BASE_URL = 'https://sea-lion-app-s86sj.ondigitalocean.app';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const signIn = async (email, password) => {
  try {
    const response = await api.post('/auth/signIn', {
      email,
      password,
    });
    return response.data; // Adjust this based on your API response structure
  } catch (error) {
    console.error('Sign-in failed:', error);
    throw error;
  }
};

export const createAccount = async (email, password) => {
    try {
      const response = await api.post('/auth/newUser', {
        email,
        password,
      });
      return response.data; // Adjust this based on your API response structure
    } catch (error) {
      console.error('Account creation failed:', error);
      throw error;
    }
  };


export default api;
