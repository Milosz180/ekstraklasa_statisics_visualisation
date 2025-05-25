import React, { useState } from 'react';
import './Register.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== repeatPassword) {
      setError('Hasła nie są takie same.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5050/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }), // 👈 tutaj poprawione
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Wystąpił błąd.');
      } else {
        setSuccess(data.message || 'Rejestracja zakończona sukcesem!');
        setEmail('');
        setPassword('');
        setRepeatPassword('');
      }
    } catch (err) {
      setError('Błąd połączenia z serwerem.');
    }
  };

  return (
    <div className="form-container">
      <h2>Rejestracja</h2>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Hasło"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Powtórz hasło"
          value={repeatPassword}
          required
          onChange={(e) => setRepeatPassword(e.target.value)}
        />
        <button type="submit">Zarejestruj</button>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
      </form>
    </div>
  );
};

export default Register;
