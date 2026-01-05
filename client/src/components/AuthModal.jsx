import React from 'react';
import { useModal } from './ModalContext';
import Login from '../pages/Login';
import Register from '../pages/Register';
import './AuthModal.css';

const AuthModal = () => {
  const { isOpen, view, closeModal, switchTo } = useModal();

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={closeModal}>&times;</button>
        {view === 'login' ? (
          <div>
            <Login isModal={true} />
            <p className="switch-view">
              Don't have an account?{' '}
              <button onClick={() => switchTo('register')} className="switch-button">
                Sign Up
              </button>
            </p>
          </div>
        ) : (
          <div>
            <Register isModal={true} />
            <p className="switch-view">
              Already have an account?{' '}
              <button onClick={() => switchTo('login')} className="switch-button">
                Sign In
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
