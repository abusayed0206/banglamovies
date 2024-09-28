import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex justify-center items-center">
      <button
        className="absolute top-4 right-4 bg-red-600 text-white text-lg px-4 py-2 rounded shadow-lg z-50"
        onClick={onClose}
      >
        বন্ধ করুন
      </button>
      <div className="relative bg-white w-full h-auto max-w-[85vw] max-h-[90vh] sm:max-w-[50vw] rounded-lg overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default Modal;
