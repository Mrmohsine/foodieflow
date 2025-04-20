import React from 'react'
import { getAuth } from 'firebase/auth';
import { getFirestore, addDoc, serverTimestamp,
    doc,
    collection,
    runTransaction,
     } from 'firebase/firestore';

// export const addProductOrder =async (cartItems) => {
//     const auth = getAuth();
//     const user = auth.currentUser;
//     if (!user) {
//     alert('Please log in to place an order.');
//     return;
//     }
//     const db = getFirestore();
//     await addDoc(collection(db, 'products_ordered'), {
//     clientId: user.uid,
//     items: cartItems,
//     createdAt: serverTimestamp(),
//     });
//     alert('Order submitted!')
// }


// export const addProductOrder = async (cartItems) => {
//     const auth = getAuth();
//     const user = auth.currentUser;
//     if (!user) {
//       alert('Please log in to place an order.');
//       return;
//     }
  
//     const db = getFirestore();
//     const counterRef = doc(db, 'ordernumber', 'counter');
  
//     try {
//       await runTransaction(db, async (tx) => {

//         const snap = await tx.get(counterRef);
//         let current = 0;
//         if (!snap.exists()) {

//           tx.set(counterRef, { value: 0 });
//         } else {
//           current = snap.data().value;
//         }
  

//         const next = current + 1;
  

//         const ordersCol = collection(db, 'products_ordered');
//         tx.set(doc(ordersCol), {
//           clientId:   user.uid,
//           items:      cartItems,
//           numberOrder: next,
//           createdAt:  serverTimestamp(),
//         });
  

//         tx.update(counterRef, { value: next });
//       });
  
//       alert('Order submitted!');
//     } catch (err) {
//       console.error("Transaction failed: ", err);
//       alert('Failed to submit order — please try again.');
//     }
//   };


export const addProductOrder = async (cartItems) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      alert("Please log in to place an order.");
      return;
    }
  
    if (!cartItems?.length) {
      alert("Your cart is empty.");
      return;
    }
  

    const adminId = cartItems[0].admin_id;
    if (!adminId) {
      alert("Cart items are missing an admin_id.");
      return;
    }
    const mismatch = cartItems.some(item => item.admin_id !== adminId);
    if (mismatch) {
      alert("All items in the cart must belong to the same admin.");
      return;
    }
  
    const db = getFirestore();
    const counterRef = doc(db, "ordernumber", adminId);
  
    try {
      await runTransaction(db, async (tx) => {
        const snap = await tx.get(counterRef);
        let current = 0;
        if (!snap.exists()) {
          tx.set(counterRef, { value: 0 });
        } else {
          current = snap.data().value;
        }
  
        const next = current + 1;
  
        const ordersCol = collection(db, "products_ordered");
        tx.set(doc(ordersCol), {
          clientId:    user.uid,
          adminId,                   
          items:       cartItems,
          numberOrder: next,
          createdAt:   serverTimestamp(),
        });
  
        tx.update(counterRef, { value: next });
      });
  
      alert("Order submitted!");
    } catch (err) {
      console.error("Transaction failed: ", err);
      alert("Failed to submit order — please try again.");
    }
  };