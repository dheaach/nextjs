"use client";

import { useState } from 'react';
import { useAuth } from '../hooks/useAuth'; // Import your useAuth hook
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import Modal from './Modal'; // Import your Modal component

const Header = () => {
  const { user, logout } = useAuth(); // Get user and logout function from useAuth
  const [isDropdownOpen, setDropdownOpen] = useState(false); // State for dropdown
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false); // State for logout modal

  return (
    <header className="bg-blue-600 p-4 text-white flex items-center justify-between">
      <h1 className="text-2xl">Admin Dashboard</h1>
      <div className="relative">
        <div className="flex items-center cursor-pointer" onClick={() => setDropdownOpen(!isDropdownOpen)}>
          <FontAwesomeIcon icon={faUser} className="mr-2" />
          <span>{user?.displayName || user?.email}</span>
        </div>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg">
            <button
              onClick={() => setLogoutModalOpen(true)} // Open the logout modal
              className="block w-full text-left px-4 py-2 hover:bg-gray-200"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        title="Confirm Logout"
        confirmText="Yes"
        onConfirm={logout} // Pass the logout function to confirm
      >
        <p className='text-black'>Are you sure you want to log out?</p>
      </Modal>
    </header>
  );
};

export default Header;
