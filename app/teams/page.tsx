"use client"

import React, { useEffect, useState } from 'react';
import { useAuth, Driver } from '../hooks/useAuth'; // Ensure Driver is imported
import DriverFormModal from '../components/DriverFormModal';
import Header from '../components/Header';
import Modal from '../components/Modal';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import { Timestamp } from 'firebase/firestore';

const DriversPage: React.FC = () => {
  const { drivers, fetchDrivers, deleteDriver, loading } = useAuth(); // Include loading state
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [isConfirmationOpen, setConfirmationOpen] = useState(false); 
  const [driverToDelete, setDriverToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>(''); // New state for search query
  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>(drivers); // Filtered drivers state

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  useEffect(() => {
    // Filter drivers whenever the search query or the drivers list changes
    setFilteredDrivers(
      drivers.filter((driver) =>
        `${driver.first_name} ${driver.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.country.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, drivers]);

  const handleAddDriver = () => {
    setSelectedDriver(null); // Clear the selected driver for adding a new one
    setModalOpen(true);
  };

  const handleEditDriver = (driver: Driver) => {
    setSelectedDriver({
      ...driver,
      dob: driver.dob instanceof Timestamp ? driver.dob.toDate().toISOString().split('T')[0] : driver.dob, // Convert to ISO format (YYYY-MM-DD)
    }); // Set the selected driver for editing
    setModalOpen(true);
  };

  const handleDeleteDriver = (id: string) => {
    setDriverToDelete(id); // Set the driver ID to delete
    setConfirmationOpen(true); // Open confirmation modal
  };

  const confirmDeleteDriver = async () => {
    if (driverToDelete !== null) {
      await deleteDriver(driverToDelete); // Perform the deletion
      setDriverToDelete(null);
      setConfirmationOpen(false); // Close the modal after deletion
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4">
          <h2 className="text-xl mb-4">Drivers</h2>
          <button onClick={handleAddDriver} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
            Add New Driver
          </button>
          <div className="mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // Update search query state
              placeholder="Search by driver name"
              className="border rounded p-2 w-full"
            />
          </div>
          {loading ? (
            <div>Loading drivers...</div>
          ) : (
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2">#</th>
                  <th className="border border-gray-300 px-4 py-2">Driver Name</th>
                  <th className="border border-gray-300 px-4 py-2">Date of Birth</th>
                  <th className="border border-gray-300 px-4 py-2">Country</th>
                  <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDrivers.map((driver, index) => (
                  <tr key={driver.id ?? `driver-${index}`}> 
                    <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                    <td className="border border-gray-300 px-4 py-2 cursor-pointer">
                      <a href="#" onClick={() => handleEditDriver(driver)}>
                        {driver.first_name} {driver.last_name}
                      </a>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {driver.dob instanceof Timestamp ? driver.dob.toDate().toLocaleDateString() : driver.dob}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">{driver.country}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                          onClick={() => handleDeleteDriver(driver.docId)}
                          className="bg-red-500 text-white px-2 py-1 rounded ml-2"
                        >
                          Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <DriverFormModal
            isOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
            title={selectedDriver ? "Edit Driver" : "Add Driver"} // Adjust title based on context
            confirmText={selectedDriver ? "Update" : "Add"} // Change text based on action
            disabled={loading} // Disable the button when loading
            existingDriver={selectedDriver} // Pass selectedDriver to the modal
          />
          <Modal
            isOpen={isConfirmationOpen}
            onClose={() => setConfirmationOpen(false)}
            title="Confirm Delete"
            confirmText="Delete"
            onConfirm={confirmDeleteDriver} // Calls deleteDriver on confirmation
            disabled={loading}
          >
            <p>Are you sure you want to delete this driver?</p>
          </Modal>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default DriversPage;