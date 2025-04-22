import React, { createContext, useContext, useEffect, useState } from 'react'; 
import { 
  collection, 
  query, 
  where, 
  onSnapshot 
} from 'firebase/firestore'; 
import { db } from '../../firebase/firebase-config'; 
import { useUser } from './user'; 

// Create a context for products data
const ProductsOrderedForClient = createContext(null);

export const UseProductsOrderedForClientProvider = ({ children }) => {
  const { user } = useUser();
  const clientId = user?.admin_id || null;
  const [products, setProducts] = useState([]); 
  const [count2, setCount2] = useState(0);
  
  useEffect(() => { 
    if (!clientId) return;
    
    // Reference to products collection
    const productsRef = collection(db, 'products_ordered');
    
    // Create query - note: using 'clientId' as per your original code
    // Add orderBy to keep results consistent
    const q = query(
      productsRef, 
      productsRef,
      where('adminId', '==', clientId),
      where('payed', '==', false),
      where('valid', '==', true)
    );
    
    // Set up real-time listener with onSnapshot
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(docs);
        setCount2(docs.length);
      },
      (error) => {
        console.error('Error in products listener:', error);
      }
    );
    
    // Clean up listener when component unmounts or when clientId changes
    return () => unsubscribe();
  }, [clientId]); // Remove count2 dependency as it's not needed with real-time updates
  
  return (
    <ProductsOrderedForClient.Provider value={{products, count2, clientId}}> 
      {children} 
    </ProductsOrderedForClient.Provider>
  ); 
};

// Custom hook to access the ProductsContext 
export const useProductsOrderedForClient = () => useContext(ProductsOrderedForClient);