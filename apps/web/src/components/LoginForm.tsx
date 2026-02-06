import { FormEvent, useState } from 'react';
import { useAuthStore } from '../stores/authStore';

export function LoginForm() {
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState('admin@water.local');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      await login(email, password);
    } catch {
      setError('Login failed');
    }
  };

  return (
    <form onSubmit={onSubmit} className="card">
      <h2>Login</h2>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" />
      <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="password" />
      <button type="submit">Sign In</button>
      {error ? <p>{error}</p> : null}
    </form>
  );
}
