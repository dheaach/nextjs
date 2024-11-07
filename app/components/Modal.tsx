// components/Modal.tsx
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  confirmText?: string; // Optional confirm button text
  onConfirm?: () => void; // Optional confirm action
  disabled?: boolean; 
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  confirmText = 'Confirm',
  onConfirm,
  disabled = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-black text-lg font-bold">{title}</h2>
        <div className="mb-4">{children}</div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm?.(); // Call onConfirm if provided
              onClose(); // Close modal after confirming
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded" disabled={disabled}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
