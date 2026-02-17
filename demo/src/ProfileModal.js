import React, { useEffect, useState } from 'react';
import { api, clearToken, setToken, safeMe } from './api';

const emptyForm = {
  fullName: '',
  email: '',
  password: '',
  headline: '',
  school: ''
};

export default function ProfileModal({ open, onClose, onAuth, onLogout }) {
  const [mode, setMode] = useState('login'); // login | register | edit
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!open) return;

    setError('');
    setLoading(true);

    safeMe()
      .then((res) => {
        const user = res?.user;
        if (!user) {
          setMode('login');
          setForm((prev) => ({ ...prev, password: '' }));
          return;
        }

        setMode('edit');
        setForm((prev) => ({
          ...prev,
          fullName: user.fullName || '',
          email: user.email || '',
          password: '',
          headline: user.headline || '',
          school: user.school || ''
        }));
      })
      .finally(() => setLoading(false));
  }, [open]);

  if (!open) return null;

  const onChange = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  async function submit() {
    setLoading(true);
    setError('');

    try {
      if (mode === 'register') {
        const res = await api.register({
          fullName: form.fullName,
          email: form.email,
          password: form.password,
          headline: form.headline,
          school: form.school
        });

        if (res?.token) setToken(res.token);

        const meRes = await api.me();
        const user = meRes?.user;
        if (user) onAuth?.(user);

        setMode('edit');
        setForm((prev) => ({
          ...prev,
          fullName: user?.fullName || '',
          email: user?.email || '',
          password: '',
          headline: user?.headline || '',
          school: user?.school || ''
        }));

        return;
      }

      if (mode === 'login') {
        const res = await api.login({
          email: form.email,
          password: form.password
        });

        if (res?.token) setToken(res.token);

        const user = res?.user || (await api.me())?.user;
        if (user) onAuth?.(user);

        setMode('edit');
        setForm((prev) => ({
          ...prev,
          fullName: user?.fullName || '',
          email: user?.email || form.email,
          password: '',
          headline: user?.headline || '',
          school: user?.school || ''
        }));

        return;
      }

      // edit mode
      const updated = await api.updateMe({
        fullName: form.fullName,
        headline: form.headline,
        school: form.school
      });

      if (updated?.user) onAuth?.(updated.user);
      onClose();
    } catch (e) {
      setError(e?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    clearToken();
    onLogout?.();
    setMode('login');
    setForm(emptyForm);
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

        {loading && <div style={styles.note}>Loading…</div>}
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
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,.35)', display: 'grid', placeItems: 'center', zIndex: 9999 },
  modal: { width: 420, maxWidth: '92vw', background: '#fff', borderRadius: 12, padding: 14, border: '1px solid #eee' },
  top: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  label: { display: 'block', fontSize: 12, marginTop: 10, marginBottom: 4, color: '#444' },
  input: { width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #ddd' },
  primary: { width: '100%', marginTop: 14, padding: '10px 12px', borderRadius: 10, border: '1px solid #cfe3ff', background: '#eff6ff', fontWeight: 700, cursor: 'pointer' },
  error: { background: '#fee2e2', border: '1px solid #fecaca', padding: 10, borderRadius: 10, color: '#7f1d1d', marginTop: 10 },
  note: { background: '#f3f4f6', border: '1px solid #e5e7eb', padding: 10, borderRadius: 10, color: '#374151', marginTop: 10 },
  footer: { marginTop: 10, display: 'flex', justifyContent: 'space-between' },
  link: { background: 'transparent', border: 'none', color: '#0a66c2', cursor: 'pointer', padding: 0 }
};