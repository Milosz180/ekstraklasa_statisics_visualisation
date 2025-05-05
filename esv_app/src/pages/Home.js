import React from 'react';
import { Link } from 'react-router-dom';
import { FaChartBar, FaCalendarAlt } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="hero">
        <h2>Nowoczesna analiza Ekstraklasy ⚽</h2>
        <p>Zobacz dane meczowe i śledź trendy sezonów z najlepszych drużyn w Polsce.</p>
        <Link to="/stats" className="btn-cta">Zacznij analizować</Link>
      </div>

      <div className="cards">
        <div className="card">
          <FaChartBar size={32} />
          <h3>Statystyki</h3>
          <p>Zobacz porównanie punktów, goli i innych danych.</p>
          <Link to="/stats" className="card-link">Przejdź</Link>
        </div>
        <div className="card">
          <FaCalendarAlt size={32} />
          <h3>Sezony</h3>
          <p>Przeglądaj dane z wybranych sezonów Ekstraklasy.</p>
          <Link to="#" className="card-link">Wkrótce</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
