import React, { createContext, useContext, useEffect, useState } from 'react';
import { collection, getDocs, doc, getDoc ,query, where , deleteDoc} from 'firebase/firestore';
import { db  } from '../../firebase/firebase-config'; 
import { auth } from '../../firebase/firebase-auth'; 
import { useAuthState } from "react-firebase-hooks/auth";
import {  useFirestoreUser } from '../../User_crud/users_crud';
// Create a context for products data
const ProductsByAdminContext = createContext(null);

export const UseProductsByAdmin = ({ children }) => {
  
    const { firebaseUser } = useFirestoreUser();
    const adminId = firebaseUser?.uid;
    const [products, setProducts] = useState([]);
    const [count, setCount] = useState(0);
    
    useEffect(() => {
        if (!adminId) return;
    
        const fetchProducts = async () => {
        try {
            const productsRef = collection(db, 'products');
            const q = query(productsRef, where('admin_id', '==', adminId));
            const querySnapshot = await getDocs(q);
            const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProducts(productsData);
        } catch (error) {
            console.error('Error fetching products by admin id:', error);
        }
        };
    
        fetchProducts();
    }, [adminId,count]);
    

    
  return (
    <ProductsByAdminContext.Provider value={{products,setCount,count}}>
      {children}
    </ProductsByAdminContext.Provider>
  );
};


// Custom hook to access the ProductsContext
export const useProductsByAdmin = () => useContext(ProductsByAdminContext);


