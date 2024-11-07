// components/DriverFormModal.tsx
"use client";

import React, { useEffect } from 'react';
import Modal from './Modal';
import { useAuth } from '../hooks/useAuth';
import { Timestamp} from 'firebase/firestore';

interface DriverFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  existingDriver: Driver | null;
  confirmText: string;
  disabled?: boolean; 
}

interface Driver {
  id?: number; 
  first_name: string;
  last_name: string;
  dob: string | Timestamp;
  country: string;
}

const DriverFormModal: React.FC<DriverFormModalProps> = ({
  isOpen,
  onClose,
  existingDriver
}) => {
  const { addDriver, updateDriver } = useAuth();

  const [driver, setDriver] = React.useState<Driver>({
    first_name: '',
    last_name: '',
    dob: '',
    country: '',
    id: undefined, 
  });

  useEffect(() => {
    if (existingDriver) {
      setDriver(existingDriver); // Set the driver data for editing
    } else {
        // Reset to empty values if no driver is selected
        setDriver({
            first_name: '',
            last_name: '',
            dob: '',
            country: '',
            id: undefined,
        });
    }
  }, [existingDriver]);
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDriver({ ...driver, [e.target.name]: e.target.value });
  };

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
  
    try {
      const driverToSave = {
        ...driver,
        dob: driver.dob instanceof Timestamp ? driver.dob : Timestamp.fromDate(new Date(driver.dob)),
      };
      
      if (existingDriver) {
        const driverId = existingDriver.id;
        if (driverId !== undefined && !isNaN(driverId)) {
          await updateDriver(driverId, driverToSave);
        } else {
          console.error('Invalid driver ID:', driverId);
          return; // Exit if the ID is not valid
        }
      } else {
        await addDriver(driverToSave);
      }

      onClose(); // Close modal on successful save
    } catch (error) {
      setError("Failed to save driver data. Please try again.");
    } finally {
      setLoading(false);
    }
  };  


  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={existingDriver ? 'Edit Driver' : 'Add New Driver'}
      confirmText={loading ? "Submitting..." : "Submit"}
      onConfirm={handleSubmit}
      disabled={loading}
    >
      <div>
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={driver.first_name}
          onChange={handleChange}
          className="border rounded p-2 mb-2 w-full"
          required
          disabled={loading}
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={driver.last_name}
          onChange={handleChange}
          className="border rounded p-2 mb-2 w-full"
          required
          disabled={loading}
        />
        <input
          type="date"
          name="dob"
          placeholder="Date of Birth"
          value={existingDriver ? existingDriver.dob.toString().split('T')[0] : ''}
          onChange={handleChange}
          className="border rounded p-2 mb-2 w-full"
          required
          disabled={loading}
        />
        <input
          type="text"
          name="country"
          placeholder="Country"
          value={driver.country}
          onChange={handleChange}
          className="border rounded p-2 mb-2 w-full"
          required
          disabled={loading}
        />
        {error && <p className="text-red-500 mt-2">{error}</p>} {/* Display error */}
      </div>
    </Modal>
  );
  
};

export default DriverFormModal;
