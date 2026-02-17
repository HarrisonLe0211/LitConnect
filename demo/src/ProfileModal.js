import React, { useEffect, useState } from 'react';
import { api, clearToken, setToken } from './api';

export default function ProfileModal({ open, onClose }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'edit'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    headline: '',
    school: ''
  });

  useEffect(() => {
    if (!open) return;
    setError('');

    // If token exists, load profile and switch to edit mode
    api.me()
      .then(({ user }) => {
        setMode('edit');
        setForm((f) => ({
          ...f,
          fullName: user.fullName || '',
          headline: user.headline || '',
          school: user.school || '',
          email: user.email || '',
          password: ''
        }));
      })
      .catch(() => {
        // Not logged in -> show login
        setMode('login');
        setForm((f) => ({ ...f, password: '' }));
      });
  }, [open]);

  if (!open) return null;

  const onChange = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit() {
    setLoading(true);
    setError('');
    try {
      if (mode === 'register') {
        const { token } = await api.register({
          fullName: form.fullName,
          email: form.email,
          password: form.password,
          headline: form.headline,
          school: form.school
        });
        setToken(token);
        setMode('edit');
      } else if (mode === 'login') {
        const { token, user } = await api.login({
          email: form.email,
          password: form.password
        });
        setToken(token);
        setMode('edit');
        setForm((f) => ({
          ...f,
          fullName: user.fullName || '',
          headline: user.headline || '',
          school: user.school || ''
        }));
      } else {
        await api.updateMe({
          fullName: form.fullName,
          headline: form.headline,
          school: form.school
        });
        onClose();
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    clearToken();
    setMode('login');
    setForm({ fullName: '', email: '', password: '', headline: '', school: '' });
  }

  return (
    <div style={styles.overlay} role="dialog" aria-modal="true">
      <div style={styles.modal}>
        <div style={styles.top}>
          <strong>
            {mode === 'edit' ? 'My Profile' : mode === 'login' ? 'Login' : 'Create Account'}
          </strong>
          <button onClick={onClose} type="button">✕</button>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        {mode === 'register' && (
          <>
            <label style={styles.label}>Full name</label>
            <input style={styles.input} value={form.fullName} onChange={onChange('fullName')} />
          </>
        )}

        {(mode === 'login' || mode === 'register') && (
          <>
            <label style={styles.label}>Email</label>
            <input style={styles.input} value={form.email} onChange={onChange('email')} />
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              value={form.password}
              onChange={onChange('password')}
            />
          </>
        )}

        {(mode === 'edit' || mode === 'register') && (
          <>
            <label style={styles.label}>Headline</label>
            <input style={styles.input} value={form.headline} onChange={onChange('headline')} />
            <label style={styles.label}>School</label>
            <input style={styles.input} value={form.school} onChange={onChange('school')} />
          </>
        )}

        <button disabled={loading} onClick={submit} type="button" style={styles.primary}>
          {loading ? '...' : mode === 'edit' ? 'Save' : mode === 'login' ? 'Login' : 'Create account'}
        </button>

        <div style={styles.footer}>
          {mode === 'login' && (
            <button type="button" onClick={() => setMode('register')} style={styles.link}>
              Create an account
            </button>
          )}
          {mode === 'register' && (
            <button type="button" onClick={() => setMode('login')} style={styles.link}>
              I already have an account
            </button>
          )}
          {mode === 'edit' && (
            <button type="button" onClick={logout} style={styles.link}>
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,.35)', display: 'grid', placeItems: 'center', zIndex: 50 },
  modal: { width: 420, maxWidth: '92vw', background: '#fff', borderRadius: 12, padding: 14, border: '1px solid #eee' },
  top: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  label: { display: 'block', fontSize: 12, marginTop: 10, marginBottom: 4, color: '#444' },
  input: { width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #ddd' },
  primary: { width: '100%', marginTop: 14, padding: '10px 12px', borderRadius: 10, border: '1px solid #cfe3ff', background: '#eff6ff', fontWeight: 700, cursor: 'pointer' },
  error: { background: '#fee2e2', border: '1px solid #fecaca', padding: 10, borderRadius: 10, color: '#7f1d1d' },
  footer: { marginTop: 10, display: 'flex', justifyContent: 'space-between' },
  link: { background: 'transparent', border: 'none', color: '#0a66c2', cursor: 'pointer', padding: 0 }
};