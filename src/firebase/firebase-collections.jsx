import { db } from "./firebase-config"; // `db` must be initialized Firestore
import { addDoc, collection,doc ,deleteDoc } from "firebase/firestore";

export const addProduct = async (productData) => {
  try {
    const docRef = await addDoc(collection(db, "products"), productData);
    return docRef.id; 
  } catch (error) {
    console.error("Error adding product: ", error);
    throw error;
  }
};
export const updateProduct = async (productId, productData) => {
  try {
    const productRef = doc(db, "products", productId);
    await updateDoc(productRef, productData);
  } catch (error) {
    console.error("Error updating product: ", error);
    throw error;
  }
}
export const deleteProduct = async (productId) => {
  try {
    const productRef = doc(db, "products", productId);
    await deleteDoc(productRef);
    console.log("Product deleted successfully");
  } catch (error) {
    console.error("Error deleting product: ", error);
    throw error;
  }
};