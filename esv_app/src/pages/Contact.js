import React from 'react';
import './Contact.css';

const Contact = () => {
  return (
    <div className="contact-container">
      <h2>Kontakt</h2>
      <p><strong>Twórcy strony:</strong></p>

      <div className="contact-person">
        <p><strong>Miłosz Gronowski</strong></p>
        <p>GitHub: <a href="https://github.com/Milosz180" target="_blank" rel="noreferrer">Milosz180</a></p>
        <p>E-mail: <a href="mailto:miloszgronowski@gmail.com">miloszgronowski@gmail.com</a></p>
      </div>

      <div className="contact-person">
        <p><strong>Kamil Skałbania</strong></p>
        <p>GitHub: <a href="https://github.com/skalbania2105" target="_blank" rel="noreferrer">skalbania2105</a></p>
        <p>E-mail: <a href="mailto:kamil.skalbania2105@gmail.com">kamil.skalbania2105@gmail.com</a></p>
      </div>
    </div>
  );
};

export default Contact;
