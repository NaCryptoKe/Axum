// client/src/App.jsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';

function App() {
  // These links match the paths in your routes/index.jsx
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Products', href: '/products' },
    { name: 'Contact', href: '/contact' },
    { name: 'Toast Test', href: '/toast-test' },
  ];

  return (
    <BrowserRouter>
        <Navbar links={navLinks} />
    </BrowserRouter>
  );
}

export default App;