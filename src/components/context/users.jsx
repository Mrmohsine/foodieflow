import React, { createContext, useContext, useEffect, useState } from 'react';
import { collection, getDocs, doc, getDoc ,query, where} from 'firebase/firestore';
import { db } from '../../firebase/firebase-config'; 
import { auth } from '../../firebase/firebase-auth'; 
import { useAuthState } from "react-firebase-hooks/auth";

// Create a context for users data
const UsersContext = createContext(null);

export const UsersProvider = ({ children }) => {
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const usersCollectionRef = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollectionRef);
        const usersData = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users data:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersData();
  }, []);

  return (
    <UsersContext.Provider value={{ users, loading, error }}>
      {children}
    </UsersContext.Provider>
  );
};

// Custom hook to access the UsersContext
export const useUsers = () => useContext(UsersContext);

// Custom hook to fetch a single user's data from Firestore by UID
export const useUser = (uid) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!uid) return;

    const fetchUser = async () => {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      } else {
        setUserData(null);
      }
    };

    fetchUser();
  }, [uid]);

  return userData;
};
export const useUserByAdmin = (adminId) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!adminId) return;

    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('admin_id', '==', adminId));
        const querySnapshot = await getDocs(q);
        const usersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users by admin id:', error);
      }
    };

    fetchUsers();
  }, [adminId]);

  return users;
};

// Custom hook that returns the Firestore user by first getting the Firebase user
export const useFirestoreUser = () => {
  const [firebaseUser] = useAuthState(auth);
  // Only call useUser when firebaseUser is defined
  const firestoreUser = useUser(firebaseUser?.uid);
  return { firebaseUser, firestoreUser };
};