import axios from 'axios';
import { setupCache } from 'axios-cache-interceptor';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

setupCache(api, {
  ttl: 1000 * 60 * 5,
  interpretHeader: false,
  cacheTakeover: false,
});

export default api;