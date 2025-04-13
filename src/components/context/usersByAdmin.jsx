import React, { createContext, useContext, useEffect, useState } from 'react';
import { collection, getDocs, doc, getDoc ,query, where , deleteDoc} from 'firebase/firestore';
import { db  } from '../../firebase/firebase-config'; 
import { auth } from '../../firebase/firebase-auth'; 
import { useAuthState } from "react-firebase-hooks/auth";
import {  useFirestoreUser } from '../../User_crud/users_crud';
// Create a context for users data
const UsersByAdminContext = createContext(null);

export const UseUserByAdmin = ({ children }) => {
  
    const { firebaseUser } = useFirestoreUser();
    const adminId = firebaseUser?.uid;
    const [users, setUsers] = useState([]);
    const [count, setCount] = useState(0);
    
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
    }, [adminId,count]);
    

    
  return (
    <UsersByAdminContext.Provider value={{users,setCount,count}}>
      {children}
    </UsersByAdminContext.Provider>
  );
};


// Custom hook to access the UsersContext
export const useUsersByAdmin = () => useContext(UsersByAdminContext);


