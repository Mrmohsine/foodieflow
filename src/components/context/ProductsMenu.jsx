import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  runTransaction,
  serverTimestamp,
  doc,
  collection,
  updateDoc
} from 'firebase/firestore';
import { toast } from 'react-hot-toast';

export const addProductOrder = async (cartItems) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) {
    toast.error("Please log in to place an order.");
    return;
  }

  if (!cartItems?.length) {
    toast.error("Your cart is empty.");
    return;
  }

  const adminId = cartItems[0].admin_id;
  if (!adminId) {
    toast.error("Cart items are missing an admin_id.");
    return;
  }
  const mismatch = cartItems.some(item => item.admin_id !== adminId);
  if (mismatch) {
    toast.error("All items in the cart must belong to the same admin.");
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
        valid: false,
        payed: false,
      });

      tx.update(counterRef, { value: next });
    });

    toast.success("Order submitted!");
  } catch (err) {
    console.error("Transaction failed: ", err);
    toast.error("Failed to submit order — please try again.");
  }
};


export const validateOrder = async (orderId) => {
  const db = getFirestore();
  const orderRef = doc(db, "products_ordered", orderId);
  try {
    await updateDoc(orderRef, { valid: true });
    toast.success("Order validated!");
  } catch (err) {
    console.error("Validation failed: ", err);
    toast.error("Failed to validate order — please try again.");
  }
};


export const paymentOrder = async (orderId) => {
  const db = getFirestore();
  const orderRef = doc(db, "products_ordered", orderId);
  try {
    await updateDoc(orderRef, { payed: true });
    toast.success("Order paid!");
  } catch (err) {
    console.error("Payment failed: ", err);
    toast.error("Failed to pay order — please try again.");
  }
};
