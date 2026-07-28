// Purpose: Axios configuration for API calls.
// How it works: Sets up a base URL so we don't have to type it every time.
// Why it exists: Centralizes our API configuration. If our backend URL changes, we only update it here.

import axios from 'axios';

// Create an Axios instance with default settings
const api = axios.create({
  baseURL: 'http://localhost:8000', // FastAPI backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
