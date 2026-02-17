// src/api.js
const TOKEN_KEY = 'lc_token';

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

const API_BASE = (process.env.REACT_APP_API_BASE || '').replace(/\/$/, '');
// If empty, fallback to same-origin (works only if you reverse-proxy, not typical in Codespaces)
const buildUrl = (path) => (API_BASE ? `${API_BASE}${path}` : path);

async function request(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' };

  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(buildUrl(path), {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || 'Request failed');
  return data;
}

export const api = {
  register: (payload) => request('/api/users/register', { method: 'POST', body: payload }),
  login: (payload) => request('/api/users/login', { method: 'POST', body: payload }),
  me: () => request('/api/users/me'),
  updateMe: (payload) => request('/api/users/me', { method: 'PUT', body: payload })
};

export async function safeMe() {
  try {
    return await api.me();
  } catch {
    return null;
  }
}