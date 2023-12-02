
import axios from 'axios';

//const BASE_URL = 'https://sea-lion-app-s86sj.ondigitalocean.app';
const BASE_URL = 'https://faas-sfo3-7872a1dd.doserverless.co/api/v1/web/fn-08e1e9bb-6c28-49dc-ab50-0b63fac3c390/'

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

export const newSession = async (user_id, access_token, lat, long, filter_distance) => {
  try {
    const response = await api.post('/session/newSession', {
      user_id,
      access_token,
      lat,
      long,
      filter_distance
    });
    return response.data.text;
  } catch (error) {
    console.error('Failed to create new session', error);
    throw error;
  }
};

export const joinSession = async (user_id, access_token, session_id) => {
  try {
    const response = await api.post('/session/joinSession', {
      user_id,
      access_token,
      session_id
    });
    return response.data.text;
  } catch (error) {
    console.error('Failed to join session', error);
    throw error;
  }
 };
 
export const uploadPicture = async (user_id, access_token, image) => {
  try {
    const formData = new FormData();
    formData.append('image_encoded', image);
    formData.append('user_id', user_id);
    formData.append('access_token', access_token);
 
    const response = await api.post('/user/uploadPicture', formData);
    console.log('Picture uploaded successfully in api:', response.data);
    return response;
  } catch (error) {
    console.error('Failed to upload picture', error);
    throw error;
  }
 };
 

export default api;
