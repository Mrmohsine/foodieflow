import { db } from "./firebase-config"; // `db` must be initialized Firestore
import { addDoc, collection } from "firebase/firestore";

export const addProduct = async (productData) => {
  try {
    const docRef = await addDoc(collection(db, "products"), productData);
    return docRef.id; 
  } catch (error) {
    console.error("Error adding product: ", error);
    throw error;
  }
};
