"use client"

import React, { useEffect, useState } from 'react';
import { useAuth, Teams } from '../hooks/useAuth'; // Ensure Teams is imported
import TeamsFormModal from '../components/TeamsFormModal';
import Header from '../components/Header';
import Modal from '../components/Modal';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import { Timestamp } from 'firebase/firestore';

const TeamsPage: React.FC = () => {
  const { teams, fetchTeams, deleteTeams, loading } = useAuth(); // Include loading state
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedTeams, setselectedTeams] = useState<Teams | null>(null);
  const [isConfirmationOpen, setConfirmationOpen] = useState(false); 
  const [teamsToDelete, setTeamsToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>(''); // New state for search query
  const [filteredTeams, setFilteredTeams] = useState<Teams[]>(teams); // Filtered teams state

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  useEffect(() => {
    // Filter teams whenever the search query or the teams list changes
    setFilteredTeams(
      teams.filter((teams) =>
        `${teams.name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teams.country.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, teams]);

  const handleAddTeams = () => {
    setselectedTeams(null); // Clear the selected teams for adding a new one
    setModalOpen(true);
  };

  const handleEditTeams = (teams: Teams) => {
    setselectedTeams({
      ...teams
    }); // Set the selected teams for editing
    setModalOpen(true);
  };

  const handleDeleteTeams = (id: string) => {
    setTeamsToDelete(id); // Set the teams ID to delete
    setConfirmationOpen(true); // Open confirmation modal
  };

  const confirmDeleteTeams = async () => {
    if (teamsToDelete !== null) {
      await deleteTeams(teamsToDelete); // Perform the deletion
      setTeamsToDelete(null);
      setConfirmationOpen(false); // Close the modal after deletion
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4">
          <h2 className="text-xl mb-4">Teams</h2>
          <button onClick={handleAddTeams} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
            Add New Teams
          </button>
          <div className="mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // Update search query state
              placeholder="Search by teams name"
              className="border rounded p-2 w-full"
            />
          </div>
          {loading ? (
            <div>Loading teams...</div>
          ) : (
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2">#</th>
                  <th className="border border-gray-300 px-4 py-2">Teams Name</th>
                  <th className="border border-gray-300 px-4 py-2">Country</th>
                  <th className="border border-gray-300 px-4 py-2">Teams</th>
                  <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeams.map((teams, index) => (
                  <tr key={teams.id ?? `teams-${index}`}> 
                    <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                    <td className="border border-gray-300 px-4 py-2 cursor-pointer">
                      <a href="#" onClick={() => handleEditTeams(teams)}>
                        {teams.name}
                      </a>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">{teams.country}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                          onClick={() => handleDeleteTeams(teams.docId)}
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
          <TeamsFormModal
            isOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
            title={selectedTeams ? "Edit Teams" : "Add Teams"} // Adjust title based on context
            confirmText={selectedTeams ? "Update" : "Add"} // Change text based on action
            disabled={loading} // Disable the button when loading
            existingTeams={selectedTeams} // Pass selectedTeams to the modal
          />
          <Modal
            isOpen={isConfirmationOpen}
            onClose={() => setConfirmationOpen(false)}
            title="Confirm Delete"
            confirmText="Delete"
            onConfirm={confirmDeleteTeams} // Calls deleteTeams on confirmation
            disabled={loading}
          >
            <p>Are you sure you want to delete this teams?</p>
          </Modal>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default TeamsPage;