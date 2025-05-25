import React, { useState, createContext } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';

// Kontekst logowania
export const AuthContext = createContext();

const App = () => {
  const [user, setUser] = useState(localStorage.getItem('loggedUser') || null);

  const logout = () => {
    localStorage.removeItem('loggedUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <div className="container">
        <header className="header">
          <div className="branding">
            <Link to="/">
              <img src="/logo_esv.png" alt="ESV Logo" className="logo" />
            </Link>
            <span className="site-title">Ekstraklasa Statistics Visualisation</span>
          </div>
          <nav className="nav">
            <ul>
              <li><Link to="/">Strona Główna</Link></li>
              <li><Link to="/about">O nas</Link></li>
              <li><Link to="/contact">Kontakt</Link></li>
              {!user && <li><Link to="/login">Zaloguj</Link></li>}
              {!user && <li><Link to="/register">Zarejestruj</Link></li>}
              {user && (
                <>
                  <li className="user-info">Zalogowany jako: <strong>{user}</strong></li>
                  <li><button className="logout-btn" onClick={logout}>Wyloguj</button></li>
                </>
              )}
            </ul>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <footer>
          <p>
            Statystyki wykorzystane za zgodą strony <a href="https://www.ekstrastats.pl" target="_blank" rel="noreferrer">www.ekstrastats.pl</a>.
          </p>
        </footer>
      </div>
    </AuthContext.Provider>
  );
};

export default App;
