import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Home from './pages/Home.js';
import About from './pages/About.js';
import Contact from './pages/Contact.js';
import NotFound from './pages/NotFound.js';

const App = () => {
  return (
    <div className="container">
      <header>
      <img src="/logo.jpeg" alt="ESV Logo" style={{ height: '80px' }} />
        <h1>Ekstraklasa Statistics Visualisation</h1>
        <nav>
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
        <p>Statystyki wykorzystane za zgodą strony <Link class="ekstrastats-link" to="www.ekstrastats.pl">www.ekstrastats.pl</Link>.</p>
      </footer>
    </div>
  );
};

export default App;