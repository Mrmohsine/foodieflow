import React, { createContext, useContext, useEffect, useState } from 'react';
import { collection, getDocs, doc, getDoc ,query, where , deleteDoc, updateDoc} from 'firebase/firestore';
import { db  } from '../firebase/firebase-config';
import { auth } from '../firebase/firebase-auth';
import { useAuthState } from "react-firebase-hooks/auth";
import {useUsers} from '../components/context/users';
import { useUsersByAdmin } from '../components/context/usersByAdmin';
import { useUser } from '../components/context/user';
// Custom hook to access the UsersContext


// export const useUser = (uid) => {
//   const [userData, setUserData] = useState(null);
//   const [count, setCount] = useState(0);
//   useEffect(() => {
//     if (!uid) return;

//     const fetchUser = async () => {
//       const docRef = doc(db, 'users', uid);
//       const docSnap = await getDoc(docRef);
//       if (docSnap.exists()) {
//         setUserData(docSnap.data());
//       } else {
//         setUserData(null);
//       }
//     };

//     fetchUser();
//   }, [uid,count]);

//   return userData;
// };
// export function useUser(uid) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!uid) return;

//     const fetchUser = async () => {
//       setLoading(true);
//       const docRef = doc(db, "users", uid);
//       const docSnap = await getDoc(docRef);
//       if (docSnap.exists()) {
//         setUser(docSnap.data());
//       }
//       setLoading(false);
//     };

//     fetchUser();
//   }, [uid]);

//   return { user, loading };
// }


export const deleteUser = async (userId, count, setCount) => {
    try {
      const userRef = doc(db, 'users', userId);
      console.log(count);
      await deleteDoc(userRef);
      setCount(count + 1);  
      console.log('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };
  
export const updateUser = async (userId, userData) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, userData);
    console.log('User updated successfully');
  } catch (error) {
    console.error('Error updating user:', error);
  }
};


export const useFirestoreUser = () => {
    const [firebaseUser] = useAuthState(auth);
    // Only call useUser when firebaseUser is defined
    const firestoreUser = useUser();
    return { firebaseUser, firestoreUser };
  };

