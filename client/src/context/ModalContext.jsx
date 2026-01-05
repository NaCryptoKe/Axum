import React, { createContext, useState, useContext } from 'react';

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    view: 'login', // 'login' or 'register'
  });

  const openModal = (view = 'login') => {
    setModalState({ isOpen: true, view });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, view: 'login' });
  };

  const switchTo = (view) => {
    setModalState(prevState => ({ ...prevState, view }));
  };

  const value = {
    ...modalState,
    openModal,
    closeModal,
    switchTo,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
};
