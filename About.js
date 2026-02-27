import React from 'react';

function About() {
  return (
    <div style={{ 
      maxWidth: '900px', 
      margin: '60px auto', 
      padding: '0 20px', 
      color: 'var(--text-color)',
      lineHeight: '1.6'
    }}>
      {/* Heading*/}
      <section style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '10px' }}>
           Blogger 's choice '
        </h1>
        <p style={{ fontSize: '1.4rem', opacity: 0.9, fontStyle: 'italic' }}>
          "Where every voice finds a home and every story finds a listener."
        </p>
      </section>

      {/* Featured Quote */}
      <div style={{ 
        padding: '40px', 
        backgroundColor: 'var(--card-bg)', 
        borderRadius: '15px',
        borderLeft: '8px solid #007bff',
        marginBottom: '60px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
      }}>
        <p style={{ fontSize: '1.8rem', fontWeight: '300', marginBottom: '15px' }}>
          "There is no greater agony than bearing an untold story inside you."
        </p>
        <cite style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#007bff' }}>
          — Maya Angelou
        </cite>
      </div>

      {/* Expanded Content Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '40px',
        marginTop: '20px' 
      }}>
        <div>
          <h2 style={{ borderBottom: '2px solid #007bff', display: 'inline-block', paddingBottom: '5px' }}>
            Our Mission
          </h2>
          <p>
            This Blogging platform was built on the principle that ideas change the world. 
            We provide a secure, minimalistic, and high-performance environment 
            for thinkers, creators, and everyday observers to document their journeys.
            So don't be shy share your honest view about this world and things you can't share With
            anyone else .
          </p>
        </div>

        <div>
          <h2 style={{ borderBottom: '2px solid #007bff', display: 'inline-block', paddingBottom: '5px' }}>
            The Technology
          </h2>
          <p>
            Powered by the MERN stack (MongoDB, Express, React, and Node.js), 
            our platform ensures real-time data integrity and a seamless 
            single-page application experience.
          </p>
        </div>

        <div>
          <h2 style={{ borderBottom: '2px solid #007bff', display: 'inline-block', paddingBottom: '5px' }}>
            Secure & Personal
          </h2>
          <p>
            With JWT-based authentication and individual post management, 
            you have full control over your digital footprint. Create, edit, 
            and delete your stories at any time.
          </p>
        </div>
      </div>

      {/* Footer Note */}
      <footer style={{ marginTop: '80px', textAlign: 'center', opacity: 0.6, fontSize: '0.9rem' }}>
        <p>&copy; 2026 Capstone Blog Project. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default About;