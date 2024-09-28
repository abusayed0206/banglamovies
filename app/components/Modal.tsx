import React, { MouseEvent } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  const handleBackgroundClick = (e: MouseEvent<HTMLDivElement>) => {
    // Ensure the click was outside the modal content
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex justify-center items-center"
      onClick={handleBackgroundClick} // Listen for clicks on the background
    >
      <div className="relative bg-white w-full h-auto max-w-[85vw] max-h-[90vh] sm:max-w-[50vw] rounded-lg overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default Modal;
