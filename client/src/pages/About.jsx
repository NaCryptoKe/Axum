import React from 'react';
import Navbar from '../components/Navbar/Navbar'; // Import Navbar

const About = () => {
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Hello', href: '/about' }, // Changed 'HELLo' to 'About' for consistency
    { name: 'Products', href: '/products' },
    { name: 'Contact', href: '/contact' },
  ];
  return (
    <div style={{ padding: '200px', textAlign: 'center', color: '#1d1d1f' }}>
      <h2>About Page</h2>
      <p>Learn more about us here.</p>
      {/*This should act like a sub navigation */}
      <Navbar links={navLinks} variant="sub" /> {/* Add Navbar with sub variant */}
    </div>
  );
};

export default About;