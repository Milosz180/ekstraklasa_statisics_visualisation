import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-container">
      <h2>O nas</h2>
      <p>
        Jesteśmy studentami czwartego roku informatyki, których połączyła wspólna pasja – piłka nożna. 
        Przez lata śledziliśmy rozgrywki Ekstraklasy, ale zawsze brakowało nam jednego: przejrzystej i atrakcyjnej wizualizacji statystyk meczowych.
      </p>
      <p>
        Dlatego postanowiliśmy stworzyć ESV – projekt, który pozwala nie tylko analizować dane, ale przede wszystkim zobaczyć je na własne oczy. 
        Intuicyjnie, interaktywnie i tak, jak sami chcielibyśmy to kiedyś oglądać.
      </p>
      <p>
        Podziękowania dla strony{' '}
        <a href="https://www.ekstrastats.pl" target="_blank" rel="noreferrer">
            www.ekstrastats.pl
        </a>
        {' '}za zgodę na wykorzystanie zebranych statystyk.
      </p>
      <p>
        Mamy nadzieję, że nasza aplikacja będzie równie przydatna dla Was, jak była ekscytująca dla nas podczas tworzenia!
      </p>
    </div>
  );
};

export default About;
