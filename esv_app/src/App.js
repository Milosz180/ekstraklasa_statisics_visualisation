import React, { useEffect, useState, useContext } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import Stats from './pages/Stats';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';
import { AuthContext } from './AuthContext';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark') {
      setDarkMode(true);
      document.body.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.body.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  return (
    <div className="container">
      <header className="header">
        <Link to="/" className="branding">
          <img src="/logo_esv.png" alt="ESV Logo" className="logo" />
          <span className="site-title">Ekstraklasa Statistics Visualisation</span>
        </Link>

        <nav className="nav">
          <ul>
            <li><Link to="/">Strona Główna</Link></li>
            <li><Link to="/about">O nas</Link></li>
            <li><Link to="/contact">Kontakt</Link></li>
            {user ? (
              <>
                <li className="user-info">Zalogowany jako: <strong>{user}</strong></li>
                <li><button className="logout-btn" onClick={logout}>Wyloguj</button></li>
              </>
            ) : (
              <>
                <li><Link to="/login">Zaloguj</Link></li>
                <li><Link to="/register">Zarejestruj</Link></li>
              </>
            )}
            <li>
              <button className="theme-toggle" onClick={toggleTheme}>
                {darkMode ? '☀️' : '🌙'}
              </button>
            </li>
          </ul>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer>
        <p>
          Statystyki wykorzystane za zgodą strony{' '}
          <a href="https://www.ekstrastats.pl" target="_blank" rel="noreferrer">
            www.ekstrastats.pl
          </a>.
        </p>
      </footer>
    </div>
  );
};

export default App;
