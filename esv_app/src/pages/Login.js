import React, { useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import './Login.css';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch('http://localhost:5050/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || 'Błąd logowania.');
      } else {
        login(email); // <- zapisz do contextu
        setMessage('Zalogowano pomyślnie!');
      }
    } catch (err) {
      setMessage('Błąd połączenia z serwerem.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Logowanie</h2>
        <form onSubmit={handleLogin}>
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
          <button type="submit">Zaloguj</button>
        </form>
        {message && <p className="auth-msg">{message}</p>}
      </div>
    </div>
  );
};

export default Login;
