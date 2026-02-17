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

async function request(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(path, {
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