import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

interface LoginResponse {
  message: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export async function logIn(username: string, password: string) {
  const response = await axios.post<LoginResponse>('/api/auth/login', { username, password });
  return response.data.user;
}

export async function signUp(newUser: RegisterData) {
  const response = await axios.post('/api/auth/register', newUser);
  return response.data;
}
