import { useState } from 'react';

const API = 'http://localhost:5000/api/auth';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(localStorage.getItem('accessToken') || '');

  const handleAuth = async (type) => {
    const res = await fetch(`${API}/${type}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });
    const data = await res.json();
    if (data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
      setToken(data.accessToken);
    }
    console.log(`${type} response:`, data);
  };

  const handleGetMe = async () => {
    const res = await fetch(`${API}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    console.log('Protected /me:', data);
  };

  const handleRefresh = async () => {
    const res = await fetch(`${API}/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    const data = await res.json();
    if (data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
      setToken(data.accessToken);
    }
    console.log('Refreshed:', data);
  };

  const handleLogout = async () => {
    await fetch(`${API}/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    localStorage.removeItem('accessToken');
    setToken('');
    console.log('Logged out');
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Auth Test Client</h1>
      <input
        type="email"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      /><br />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br />

      <button onClick={() => handleAuth('register')}>Register</button>
      <button onClick={() => handleAuth('login')}>Login</button>
      <button onClick={handleRefresh}>Refresh Token</button>
      <button onClick={handleGetMe}>Get Me (Protected)</button>
      <button onClick={handleLogout}>Logout</button>
      <br /><br />
      <a href="http://localhost:5000/api/auth/google">
        <button>Login with Google</button>
      </a>
      <br />
      <p>Access Token: {token ? '✅ Stored' : '❌ None'}</p>
    </div>
  );
}