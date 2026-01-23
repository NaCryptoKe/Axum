// client/src/App.jsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import { ToastProvider } from './components/Toast/ToastProvider';
import Routes from './routes/index';

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
          <Navbar />
          <Routes />
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;