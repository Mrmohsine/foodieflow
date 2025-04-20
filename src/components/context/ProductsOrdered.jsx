// import React, { createContext, useContext, useEffect, useState } from 'react';
// import { collection, getDocs, doc, getDoc ,query, where , deleteDoc,onSnapshot} from 'firebase/firestore';
// import { db  } from '../../firebase/firebase-config'; 
// import { auth } from '../../firebase/firebase-auth'; 
// import { useAuthState } from "react-firebase-hooks/auth";
// import {  useFirestoreUser } from '../../User_crud/users_crud';
// import { getAuth } from 'firebase/auth';
// import { useUser } from './user';
// // Create a context for products data
// const ProductsOrder = createContext(null);

// export const UseProductsOrdered =  ({ children }) => {
  
//   //   const { firebaseUser } = useFirestoreUser();     
//   // const userRecord = useUser(firebaseUser?.uid);  
//   const {user} = useUser();   
//   // console.log('User:', user?.admin_id);
//   const clientAdminId = user?.admin_id || null;

//   const [products, setProducts] = useState([]);
//   const [count2, setCount2]    = useState(0);

//   useEffect(() => {
//     if (!clientAdminId) return;

//     const fetchProducts = async () => {
//       try {
//         const productsRef = collection(db, 'products_ordered');
//         const q = query(productsRef, where('adminId', '==', clientAdminId));
//         const snap = await getDocs(q);
//         const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
//         setProducts(data);
//       } catch (err) {
//         console.error('Error fetching products:', err);
//       }
//     };

//     fetchProducts();
//   }, [clientAdminId, count2]);

    
//   return (
//     <ProductsOrder.Provider value={{products,setCount2,count2, clientAdminId}}>
//       {children}
//     </ProductsOrder.Provider>
//   );
// };


// // Custom hook to access the ProductsContext
// export const useProductsOrdered= () => useContext(ProductsOrder);


// Create a context for products data
// const ProductsOrder = createContext(null);

// export const UseProductsOrdered = ({ children }) => {
//   const { user } = useUser();
//   const clientAdminId = user?.admin_id || null;

//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     if (!clientAdminId) return;

//     const productsRef = collection(db, 'products_ordered');
//     const q = query(
//       productsRef,
//       where('admin_id', '==', clientAdminId)
//     );

//     // Subscribe to real-time updates
//     const unsubscribe = onSnapshot(
//       q,
//       snapshot => {
//         const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
//         setProducts(data);
//       },
//       error => {
//         console.error('Kitchen listener error:', error);
//       }
//     );

//     // Clean up listener on unmount or adminId change
//     return () => unsubscribe();
//   }, [clientAdminId]);

//   return (
//     <ProductsOrder.Provider value={{ products, clientAdminId }}>
//       {children}
//     </ProductsOrder.Provider>
//   );
// };

// // Custom hook to access the ProductsContext
// export const useProductsOrdered = () => useContext(ProductsOrder);


import React, { createContext, useContext, useEffect, useState } from 'react'; 
import { 
  collection, 
  query, 
  where, 
  orderBy,
  onSnapshot 
} from 'firebase/firestore'; 
import { db } from '../../firebase/firebase-config'; 
import { useUser } from './user'; 

// Create a context for products data
const ProductsOrder = createContext(null);

export const UseProductsOrdered = ({ children }) => {
  const { user } = useUser();
  const clientAdminId = user?.admin_id || null;
  const [products, setProducts] = useState([]); 
  const [count2, setCount2] = useState(0);
  
  useEffect(() => { 
    if (!clientAdminId) return;
    
    // Reference to products collection
    const productsRef = collection(db, 'products_ordered');
    
    // Create query - note: using 'adminId' as per your original code
    // Add orderBy to keep results consistent
    const q = query(
      productsRef, 
      where('adminId', '==', clientAdminId)
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
    
    // Clean up listener when component unmounts or when clientAdminId changes
    return () => unsubscribe();
  }, [clientAdminId]); // Remove count2 dependency as it's not needed with real-time updates
  
  return (
    <ProductsOrder.Provider value={{products, setCount2, count2, clientAdminId}}> 
      {children} 
    </ProductsOrder.Provider>
  ); 
};

// Custom hook to access the ProductsContext 
export const useProductsOrdered = () => useContext(ProductsOrder);