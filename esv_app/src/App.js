import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import './App.css';

const App = () => {
  return (
    <div className="container">
      <header className="header">
        <div className="branding">
          <img src="/logo_esv.png" alt="ESV Logo" className="logo" />
          <span className="site-title">Ekstraklasa Statistics Visualisation</span>
        </div>
        <nav className="nav">
          <ul>
            <li><Link to="/">Strona Główna</Link></li>
            <li><Link to="/about">O nas</Link></li>
            <li><Link to="/contact">Kontakt</Link></li>
          </ul>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer>
        <p>
          Statystyki wykorzystane za zgodą strony <a href="https://www.ekstrastats.pl" target="_blank" rel="noreferrer">www.ekstrastats.pl</a>.
        </p>
      </footer>
    </div>
  );
};

export default App;
