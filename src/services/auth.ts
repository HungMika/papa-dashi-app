import axios from 'axios';

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

export async function getCurrentSession() {
  try {
    const response = await axios.get('/api/session');
    const user = response.data;

    if (user && user.id && user.username && user.email) {
      return user; // hợp lệ, trả user
    } else {
      return null; // không hợp lệ, coi như chưa đăng nhập
    }
  } catch (error) {
    console.error('Error fetching current session:', error);
    return null;
  }
}

// Hàm gọi API logout để clear session trên server
export async function logOut() {
  try {
    const response = await axios.post('/api/auth/logout');
    return response.data; // ví dụ: { message: 'Logout successful' }
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
}
