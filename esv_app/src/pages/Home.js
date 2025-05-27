import React from 'react';
import { Link } from 'react-router-dom';
import { FaChartBar, FaCalendarAlt } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="hero">
        <h2>Wizualizacja statystyk Ekstraklasy ⚽</h2>
        <p>Analizuj i wizualizuj statystyki Ekstraklasy w dowolny sposób!<br></br>
          Twórz tabele, wykresy i analizy dla 28 klubów i 65 unikalnych statystyk na przestrzeni 7 sezonów!</p>
        <Link to="/stats" className="btn-cta">Przejdź do analizy</Link>
      </div>

      {/* NOWA SEKCJA */}
      <section className="stats">
        <div className="stat-box">
          <h3>⚽ 28</h3>
          <p>Drużyn</p>
        </div>
        <div className="stat-box">
          <h3>📊 65</h3>
          <p>Analizowanych statystyk</p>
        </div>
        <div className="stat-box">
          <h3>📅 7</h3>
          <p>Sezonów</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
