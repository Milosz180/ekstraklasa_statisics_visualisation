import React, { useState } from 'react';
import './Register.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (password !== confirm) {
      setError('Hasła nie są takie same.');
      return;
    }

    const res = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (res.ok) {
      setSuccess(true);
      setUsername('');
      setPassword('');
      setConfirm('');
    } else {
      setError(data.message || 'Błąd rejestracji');
    }
  };

  return (
    <div className="register-container">
      <h2>Rejestracja</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Nazwa użytkownika"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Powtórz hasło"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
        <button type="submit">Zarejestruj</button>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">Rejestracja zakończona sukcesem!</p>}
      </form>
    </div>
  );
};

export default Register;
