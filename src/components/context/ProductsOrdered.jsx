import React, { createContext, useContext, useEffect, useState } from 'react';
import { collection, getDocs, doc, getDoc ,query, where , deleteDoc} from 'firebase/firestore';
import { db  } from '../../firebase/firebase-config'; 
import { auth } from '../../firebase/firebase-auth'; 
import { useAuthState } from "react-firebase-hooks/auth";
import {  useFirestoreUser, useUser } from '../../User_crud/users_crud';
import { getAuth } from 'firebase/auth';
// Create a context for products data
const ProductsOrder = createContext(null);

export const UseProductsOrdered =  ({ children }) => {
  
    const { firebaseUser } = useFirestoreUser();     
  const userRecord = useUser(firebaseUser?.uid);     
  const clientAdminId = userRecord?.admin_id || null;

  const [products, setProducts] = useState([]);
  const [count2, setCount2]    = useState(0);

  useEffect(() => {
    if (!clientAdminId) return;

    const fetchProducts = async () => {
      try {
        const productsRef = collection(db, 'products_ordered');
        const q = query(productsRef, where('adminId', '==', clientAdminId));
        const snap = await getDocs(q);
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };

    fetchProducts();
  }, [clientAdminId, count2]);
    console.log('Products:', products);

    
  return (
    <ProductsOrder.Provider value={{products,setCount2,count2, clientAdminId}}>
      {children}
    </ProductsOrder.Provider>
  );
};


// Custom hook to access the ProductsContext
export const useProductsOrdered= () => useContext(ProductsOrder);
