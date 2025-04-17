import React, { createContext, useContext, useEffect, useState } from 'react';
import { collection, getDocs, doc, getDoc ,query, where , deleteDoc} from 'firebase/firestore';
import { db  } from '../../firebase/firebase-config'; 
import { auth } from '../../firebase/firebase-auth'; 
import { useAuthState } from "react-firebase-hooks/auth";
import {  useFirestoreUser } from '../../User_crud/users_crud';
// Create a context for products data
const ProductsForClient = createContext(null);

export const UseProductsForClient = ({ children }) => {
  
    const { firebaseUser } = useFirestoreUser();
    const [products, setProducts] = useState([]);
    const [count2, setCount2] = useState(0);
    const [clientAdminId, setClientAdminId] = useState(null);
    
    useEffect(() => {
        if (!firebaseUser) return;
        const fetchClientAdmin = async () => {
            try {
                const userRef = doc(db, 'users', firebaseUser.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    setClientAdminId(userSnap.data().admin_id);
                }
            } catch (err) {
                console.error('Error fetching user admin_id:', err);
            }
        };
        fetchClientAdmin();
    }, [firebaseUser]);

    useEffect(() => {
        if (!clientAdminId) return;
    
        const fetchProducts = async () => {
        try {
            const productsRef = collection(db, 'products');
            const q = query(productsRef, where('admin_id', '==', clientAdminId));
            const querySnapshot = await getDocs(q);
            const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProducts(productsData);
        } catch (error) {
            console.error('Error fetching products by admin id:', error);
        }
        };
    
        fetchProducts();
    }, [clientAdminId,count2]);
    

    
  return (
    <ProductsForClient.Provider value={{products,setCount2,count2, clientAdminId}}>
      {children}
    </ProductsForClient.Provider>
  );
};


// Custom hook to access the ProductsContext
export const useProductsForClient= () => useContext(ProductsForClient);
