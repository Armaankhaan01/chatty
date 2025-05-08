import axios from '@services/axios';

class AuthService {
  async signUp(body) {
    const response = await axios.post('/signup', body);
    return response;
  }

  async signIn(body) {
    const response = await axios.post('/signin', body);

    // Store token from response body
    if (response.data && response.data.token) {
      this.storeToken(response.data.token);
    }

    // Check authorization header as backup
    const authHeader = response.headers.authorization || response.headers.Authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      this.storeToken(token);
    }

    return response.data;
  }

  storeToken(token) {
    localStorage.setItem('token', token);
    // Add token to default axios headers for all future requests
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  getToken() {
    return localStorage.getItem('token');
  }

  clearToken() {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common.Authorization;
  }

  async forgotPassword(email) {
    const response = await axios.post('/forgot-password', { email });
    return response;
  }

  async resetPassword(token, body) {
    const response = await axios.post(`/reset-password/${token}`, body);
    return response;
  }

  signOut() {
    this.clearToken();
    // Any other cleanup needed
  }
}

export const authService = new AuthService();
