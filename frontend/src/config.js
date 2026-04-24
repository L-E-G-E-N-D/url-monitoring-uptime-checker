const rawUrl = import.meta.env.VITE_API_URL || '';
const API_BASE_URL = rawUrl.trim() || '/api';

export default API_BASE_URL;
