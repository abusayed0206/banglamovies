import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex">
      <div className="relative p-8 bg-white w-full h-auto max-w-[85vw] max-h-[auto] sm:max-w-[50vw] m-auto flex-col flex rounded-lg overflow-auto">
        <button
          className="absolute top-0 right-0 mt-4 mr-4 text-black text-3xl leading-none"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
