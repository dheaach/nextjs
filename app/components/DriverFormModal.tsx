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
    docId: '',
  });

  useEffect(() => {
    if (existingDriver) {
      setDriver(existingDriver); // Set the driver data for editing
    } else {
        setDriver({
            first_name: '',
            last_name: '',
            dob: '',
            country: '',
            id: undefined,
            docId: '',
        });
    }
  }, [existingDriver]);
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
        const driverId = existingDriver.docId;
        if (driverId !== undefined || driverId !== '') {
          await updateDriver(driverId, driverToSave);
        } else {
          console.error('Invalid driver ID:', driverId);
          return;
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
          value={driver.dob ? driver.dob.toString().split('T')[0] : ''}
          onChange={handleChange}
          className="border rounded p-2 mb-2 w-full"
          required
          disabled={loading}
        />
        <select
          name="country"
          value={driver.country}
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
        {error && <p className="text-red-500 mt-2">{error}</p>} {/* Display error */}
      </div>
    </Modal>
  );
  
};

export default DriverFormModal;