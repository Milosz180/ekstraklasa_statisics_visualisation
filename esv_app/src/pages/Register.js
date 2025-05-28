import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import './Register.css';

const Register = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');

    if (password !== repeatPassword) {
      setMessage('Hasła nie są takie same.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5050/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || 'Błąd rejestracji.');
      } else {
        login(email);       // automatyczne logowanie
        navigate('/');      // przekierowanie na stronę główną
      }
    } catch (err) {
      setMessage('Błąd połączenia z serwerem.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
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
        </form>
        {message && <p className="auth-msg">{message}</p>}
      </div>
    </div>
  );
};

export default Register;
