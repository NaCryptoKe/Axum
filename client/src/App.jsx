// client/src/App.jsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import { ToastProvider } from './components/Toast/ToastProvider';
import Home from './pages/Home'

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
          <Navbar />
          <Home />
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;