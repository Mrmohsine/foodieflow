import React, { createContext, useContext, useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase-config'; 

const UsersContext = createContext(null);

export const UsersProvider = ({ children }) => {
  const [users, setUsers] = useState(null);

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const usersCollectionRef = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollectionRef);
        const usersData = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users data:", error);
      }
    };

    fetchUsersData();
  }, []);

  return (
    <UsersContext.Provider value={users}>
      {children}
    </UsersContext.Provider>
  );
};

// Custom hook for accessing the users context
export const useUsers = () => useContext(UsersContext);
export const useUser = (userId) => {
    const users = useUsers();
    return users ? users.find((user) => user.id === userId) : null;
  };