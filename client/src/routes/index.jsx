// client/src/routes/index.jsx
import React from 'react';
import { Routes as RouterRoutes, Route } from 'react-router-dom';
import ToastTest from '../pages/ToastTest';
import Home from '../pages/Home';
import About from '../pages/About';
import Products from '../pages/Products';
import Contact from '../pages/Contact';

const Routes = () => {
  return (
    <RouterRoutes>
      <Route path="/" element={<Home />} /> {/* Set Home as the default route */}
      <Route path="/about" element={<About />} />
      <Route path="/products" element={<Products />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/toast-test" element={<ToastTest />} /> {/* Keep ToastTest for testing */}
    </RouterRoutes>
  );
};

export default Routes;