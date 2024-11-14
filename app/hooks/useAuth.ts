import { useEffect, useState } from 'react';
import { auth } from '../firebase';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { setSession, getSession, clearSession } from '../utils/session';
import { firestore } from '../firebase';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  Timestamp,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';


export interface Driver {
  first_name: string;
  last_name: string;
  dob: string | Timestamp; // Keep as string or Timestamp for flexibility
  country: string;
  id?: number; 
  docId: string;
}

export interface Teams {
  name: string;// Keep as string or Timestamp for flexibility
  driver: string[];
  country: string;
  id?: number; 
  docId: string;
}

export const useAuth = () => {
  const [user, setUser] = useState(getSession());
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [teams, setTeams] = useState<Teams[]>([]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setSession(user);
      } else {
        clearSession();
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setError(null);
      setUser(userCredential.user);
      setSession(userCredential.user);
      router.push('/admin');
    } catch (err: any) {
      setError("Login failed. Please check your credentials.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      clearSession();
      setUser(null);
      router.push('/login');
    } catch (err: any) {
      setError("Logout failed. Please try again.");
    }
  };

  const register = async (email: string, password: string) => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setError(null);
      setUser(userCredential.user);
      setSession(userCredential.user);
      router.push('/admin');
    } catch (err: any) {
      setError("Registration failed. Please check your details.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchDrivers = async () => {
    try {
      const driverCollection = collection(firestore, 'tbl_driver');
      const driverSnapshot = await getDocs(driverCollection);
      const driverList = driverSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          docId: doc.id,
          id: parseInt(data.id), // Convert document ID to number if required
          first_name: data.first_name,
          last_name: data.last_name,
          dob: data.dob instanceof Timestamp ? data.dob : Timestamp.fromDate(new Date(data.dob)),
          country: data.country,
        } as Driver;
      });
      setDrivers(driverList);
    } catch (err: any) {
      setError("Failed to fetch drivers.");
    } finally {
      setLoading(false);
    }
  };


  const addDriver = async (driverData: Driver) => {
    try {
      setLoading(true);
      const driversRef = collection(firestore, 'tbl_driver');
      const maxIdQuery = query(driversRef, orderBy("id", "desc"), limit(1));
      const querySnapshot = await getDocs(maxIdQuery);

      let maxId = 0;
      if (!querySnapshot.empty) {
        const lastDriver = querySnapshot.docs[0].data() as Driver; // Typecast to Driver
        maxId = lastDriver.id || 0;
      }
      const newId = maxId + 1;

      const driverToSave = {
        ...driverData,
        dob: driverData.dob instanceof Timestamp ? driverData.dob : Timestamp.fromDate(new Date(driverData.dob)),
        id: newId,
      };

      const docRef = await addDoc(driversRef, driverToSave);
      console.log('Driver added with ID:', docRef.id);
      return docRef;
    } catch (error) {
      console.error('Error adding driver:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateDriver = async (driverId: string, updatedDriverData: Driver) => {
    try {
      const driverRef = doc(firestore, 'tbl_driver', driverId.toString());
      const driverToUpdate = {
        ...updatedDriverData,
        dob: updatedDriverData.dob instanceof Timestamp ? updatedDriverData.dob : Timestamp.fromDate(new Date(updatedDriverData.dob)),
      };

      await updateDoc(driverRef, driverToUpdate);
      console.log('Driver updated with ID:', driverId);
    } catch (error) {
      console.error('Error updating driver:', error);
      throw error;
    }
  };

  const deleteDriver = async (driverId: string) => {
    try {
      setLoading(true);
    
      // Optimistic UI update: Immediately remove the driver from the UI
      const updatedDrivers = drivers.filter(driver => driver.docId !== driverId);
      setDrivers(updatedDrivers); // Update the state to reflect the change

      const driverRef = doc(firestore, 'tbl_driver', driverId.toString());
      
      await deleteDoc(driverRef);
      
      fetchDrivers();
    } catch (err: any) {
      setError("Failed to delete driver.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = async () => {
    try {
      const teamsCollection = collection(firestore, 'tbl_team');
      const teamsSnapshot = await getDocs(teamsCollection);
  
      if (teamsSnapshot.empty) {
        console.log("No teams found.");
        return;
      }
  
      const driversSnapshot = await getDocs(collection(firestore, 'tbl_driver'));
  
      const driversData: Record<string, any> = driversSnapshot.docs.reduce((acc, doc) => {
        acc[doc.id] = doc.data();
        return acc;
      }, {} as Record<string, any>);
  
      const teamsList = await Promise.all(teamsSnapshot.docs.map(async (doc) => {
        const data = doc.data();
  
        const driverNames = await Promise.all(
          (data.id_driver || []).map(async (driverId: string) => {
            const driverData = driversData[driverId];
            return driverData ? `${driverData.first_name} ${driverData.last_name}` : driverId;
          })
        );
  
        return {
          docId: doc.id,
          id: parseInt(data.id),
          name: data.name,
          country: data.country,
          driver: driverNames,
        } as Teams;
      }));
  
      console.log("Teams list:", teamsList);
      setTeams(teamsList);
    } catch (err: any) {
      console.error("Error fetching teams:", err);
      setError("Failed to fetch teams.");
    } finally {
      setLoading(false);
    }
  };
  
  
  const addTeams = async (teamsData: Teams) => {
    try {
      // setLoading(true);
      const teamsRef = collection(firestore, 'tbl_team');
      const maxIdQuery = query(teamsRef, orderBy("id", "desc"), limit(1));
      const querySnapshot = await getDocs(maxIdQuery);
  
      let maxId = 0;
      if (!querySnapshot.empty) {
        const lastTeam = querySnapshot.docs[0].data() as Teams; // Typecast to Teams
        maxId = lastTeam.id || 0;
      }
      const newId = maxId + 1;
  
      const teamsToSave = {
        ...teamsData,
        id: newId,
        id_driver: teamsData.driver, 
      };
  
      const docRef = await addDoc(teamsRef, teamsToSave);
      console.log('Teams added with ID:', docRef.id);
      return docRef;
    } catch (error) {
      console.error('Error adding teams:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateTeams = async (teamsId: string, updatedTeamsData: Teams) => {
    try {
      const teamsRef = doc(firestore, 'tbl_team', teamsId); // Use doc reference with team ID
      const teamsToUpdate = {
        ...updatedTeamsData,
        driver: updatedTeamsData.driver, 
      };
  
      await updateDoc(teamsRef, teamsToUpdate);
      console.log('Teams updated with ID:', teamsId);
    } catch (error) {
      console.error('Error updating teams:', error);
      throw error;
    }
  };

  const deleteTeams = async (teamsId: string) => {
    try {
      setLoading(true);
  
      const updatedTeams = teams.filter(teams => teams.docId !== teamsId);
      setTeams(updatedTeams); // Update the state to reflect the change

      const teamsRef = doc(firestore, 'tbl_team', teamsId.toString());
      
      await deleteDoc(teamsRef);
      
      fetchTeams();
    } catch (err: any) {
      setError("Failed to delete teams.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableDrivers = async () => {
    try {
      setLoading(true);
      const driverCollection = collection(firestore, 'tbl_driver');
      const driverSnapshot = await getDocs(driverCollection);
      const driverOptions = driverSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          label: `${data.first_name} ${data.last_name}`, // Label for display
          value: doc.id, // ID for selection
        };
      });
      return driverOptions;
    } catch (err: any) {
      setError("Failed to fetch available drivers.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  
  return {
    user,
    error,
    setError,
    loading,
    login,
    logout,
    register,
    drivers,
    fetchDrivers,
    addDriver,
    updateDriver,
    deleteDriver,
    teams,
    fetchTeams,
    addTeams,
    updateTeams,
    deleteTeams,
    fetchAvailableDrivers
  };
};
