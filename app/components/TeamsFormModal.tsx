// components/TeamsFormModal.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { useAuth } from '../hooks/useAuth';
import { Timestamp} from 'firebase/firestore';
import { firestore } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

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
  driver: string[];
  docId: string;
}

const countryList = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "East Timor",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Korea (North)",
  "Korea (South)",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe"
];

const TeamsFormModal: React.FC<TeamsFormModalProps> = ({
  isOpen,
  onClose,
  existingTeams
}) => {
  const { addTeams, updateTeams } = useAuth();
  const [selectedDrivers, setSelectedDrivers] = useState<string[]>([]);
  const [driverList, setDriverList] = useState<{ id: string; name: string }[]>([]); 

  const [teams, setTeams] = React.useState<Teams>({
    name: '',
    country: '',
    id: undefined, 
    driver:[],
    docId: '',
  });

  useEffect(() => {
    if (existingTeams) {
      setTeams(existingTeams); 
      setSelectedDrivers(existingTeams.driver);
    } else {
      setTeams({
        name: '',
        country: '',
        id: undefined,
        driver: [],
        docId: '',
      });
      setSelectedDrivers([]);
    }
  }, [existingTeams]);
  
  useEffect(() => {
    // Fetch drivers from Firestore when the modal opens
    const fetchDrivers = async () => {
      try {
        const driversSnapshot = await getDocs(collection(firestore, 'tbl_driver'));
        const driversData = driversSnapshot.docs.map(doc => {
          const driverData = doc.data();
          return { id: doc.id, name: `${driverData.first_name} ${driverData.last_name}` }; // Return id and name
        });
        setDriverList(driversData); // Correctly setting the list of drivers
      } catch (error) {
        setError("Failed to load drivers.");
      }
    };

    if (isOpen) {
      fetchDrivers();
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setTeams({ ...teams, [e.target.name]: e.target.value });
  };

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleDriverSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { options } = e.target;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setSelectedDrivers(selected); // Update the selected drivers
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
  
    try {
      const teamsToSave = {
        ...teams,
        driver: selectedDrivers, 
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
          placeholder="Teams Name"
          value={teams.name}
          onChange={handleChange}
          className="border rounded p-2 mb-2 w-full"
          required
          disabled={loading}
        />
        <select
          name="country"
          value={teams.country}
          onChange={handleChange}
          className="border rounded p-2 mb-2 w-full"
          required
          disabled={loading}
        >
          <option value="">Select a Country</option>
          {countryList.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
        <select
          name="driver"
          value={selectedDrivers}
          onChange={handleDriverSelect}
          className="border rounded p-2 mb-2 w-full"
          multiple
          required
          disabled={loading}
        >
          {driverList.map((driver) => (
            <option key={driver.id} value={driver.id}>
            {driver.name}
          </option>
          ))}
        </select>
        {error && <p className="text-red-500 mt-2">{error}</p>} {/* Display error */}
      </div>
    </Modal>
  );
  
};

export default TeamsFormModal;