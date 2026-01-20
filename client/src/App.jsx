// client/src/App.jsx
import React from 'react';
import { ToastProvider } from './components/Toast/ToastProvider';
import { TOAST_THEME } from './config/toastTheme'; // Import your config
import Routes from './routes'; // Assuming you have a routes file

function App() {
  return (
    <ToastProvider theme={TOAST_THEME} position="bottom-right">
      <Routes /> 
    </ToastProvider>
  );
}

export default App;