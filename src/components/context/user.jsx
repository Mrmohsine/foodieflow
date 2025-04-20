import React, { createContext, useContext, useEffect, useState } from 'react';
import { collection, getDocs, doc, getDoc ,query, where , deleteDoc} from 'firebase/firestore';
import { db  } from '../../firebase/firebase-config'; 
import { auth } from '../../firebase/firebase-auth'; 
import { useAuthState } from "react-firebase-hooks/auth";

// Create a context for users data
const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [firebaseUser, loadingAuth] = useAuthState(auth);
  // const firestoreUser = useUser(firebaseUser?.uid)
  const [count, setCount] = useState(0);
  const uid = firebaseUser?.uid;
  useEffect(() => {
    
    const fetchUser = async () => {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUser(docSnap.data());
      } else {
        setUser(null);
      }
    };

    uid ? fetchUser() : setUser(null);
  }, [uid,count]);

  return (
    <UserContext.Provider value={{ user, count, setCount,loadingAuth }}>
      {children}
    </UserContext.Provider>
  );
};


// Custom hook to access the UserContext
export const useUser = () => useContext(UserContext);


