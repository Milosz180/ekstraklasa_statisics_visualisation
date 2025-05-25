import React, { useState } from 'react';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loggedInUser, setLoggedInUser] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5050/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Błędne dane logowania.');
      } else {
        setSuccess('Zalogowano pomyślnie!');
        setLoggedInUser(email);
        localStorage.setItem('loggedUser', email);
      }
    } catch (err) {
      setError('Błąd połączenia z serwerem.');
    }
  };

  return (
    <div className="form-wrapper">
      <h2>Logowanie</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Hasło" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Zaloguj</button>
      </form>
      {error && <p className="error">{error}</p>}
      {success && (
        <>
          <p className="success">{success}</p>
          <p className="user-info">Zalogowany jako: <strong>{loggedInUser}</strong></p>
        </>
      )}
    </div>
  );
};

export default Login;
