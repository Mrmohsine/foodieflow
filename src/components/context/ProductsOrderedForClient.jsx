// src/context/ProductsOrderedForClient.jsx
import React, { createContext, useContext, useEffect, useState } from 'react'; 
import { 
  collection, 
  query, 
  where, 
  onSnapshot 
} from 'firebase/firestore'; 
import { db } from '../../firebase/firebase-config'; 
import { useUser } from './user'; 

const ProductsOrderedForClient = createContext(null);

export const UseProductsOrderedForClientProvider = ({
  children,
  payed = false,
  valid = true
}) => {
  const { user } = useUser();
  const clientId = user?.admin_id;
  const [products, setProducts] = useState([]); 
  const [count2, setCount2] = useState(0);
  
  useEffect(() => { 
    if (!clientId) return;
    
    const productsRef = collection(db, 'products_ordered');
    const q = query(
      productsRef,
      where('adminId', '==', clientId),
      where('payed', '==', payed),
      where('valid', '==', valid)
    );
    
    const unsubscribe = onSnapshot(
      q,
      snapshot => {
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(docs);
        setCount2(docs.length);
      },
      error => console.error('Error in products listener:', error)
    );
    
    return () => unsubscribe();
  }, [clientId, payed, valid]);  // re-run if payed/valid props ever change
  
  return (
    <ProductsOrderedForClient.Provider value={{ products, count2, clientId }}>
      {children}
    </ProductsOrderedForClient.Provider>
  );
};

export const useProductsOrderedForClient = () =>
  useContext(ProductsOrderedForClient);
