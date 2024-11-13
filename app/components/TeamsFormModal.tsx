// components/TeamsFormModal.tsx
"use client";

import React, { useEffect } from 'react';
import Modal from './Modal';
import { useAuth } from '../hooks/useAuth';
import { Timestamp} from 'firebase/firestore';

interface TeamsFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  existingTeams: Teams | null;
  confirmText: string;
  disabled?: boolean; 
}

interface Teams {
  id?: number; 
  name: string;
  country: string;
  driver: string;
  docId: string;
}

const TeamsFormModal: React.FC<TeamsFormModalProps> = ({
  isOpen,
  onClose,
  existingTeams
}) => {
  const { addTeams, updateTeams } = useAuth();

  const [teams, setTeams] = React.useState<Teams>({
    name: '',
    country: '',
    id: undefined, 
    driver:'',
    docId: '',
  });

  useEffect(() => {
    if (existingTeams) {
      setTeams(existingTeams); // Set the teams data for editing
    } else {
        setTeams({
            name: '',
            country: '',
            id: undefined,
            driver:'',
            docId: '',
        });
    }
  }, [existingTeams]);
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTeams({ ...teams, [e.target.name]: e.target.value });
  };

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
  
    try {
      const teamsToSave = {
        ...teams
      };
      
      if (existingTeams) {
        const teamsId = existingTeams.docId;
        if (teamsId !== undefined || teamsId !== '') {
          await updateTeams(teamsId, teamsToSave);
        } else {
          console.error('Invalid teams ID:', teamsId);
          return;
        }
      } else {
        await addTeams(teamsToSave);
      }

      onClose(); // Close modal on successful save
    } catch (error) {
      setError("Failed to save teams data. Please try again.");
    } finally {
      setLoading(false);
    }
  };  


  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={existingTeams ? 'Edit Teams' : 'Add New Teams'}
      confirmText={loading ? "Submitting..." : "Submit"}
      onConfirm={handleSubmit}
      disabled={loading}
    >
      <div>
        <input
          type="text"
          name="name"
          placeholder="First Name"
          value={teams.name}
          onChange={handleChange}
          className="border rounded p-2 mb-2 w-full"
          required
          disabled={loading}
        />
        <input
          type="text"
          name="country"
          placeholder="Country"
          value={teams.country}
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

export default TeamsFormModal;