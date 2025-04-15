import { db } from "./firebase-config"; // `db` must be initialized Firestore
import { addDoc, collection,doc ,deleteDoc,updateDoc,serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Function to add a product document to Firestore with the uploaded image URL
export const addProduct = async (productData, imageUrl ,admin_id ) => {
  try {
    // Upload the image file and get the download URL
    // const imageUrl = await uploadProductImage(imageFile);
    // Merge the product data with the image URL

    const payload = { ...productData, img: imageUrl, admin_id : admin_id ,createdAt: serverTimestamp() };  
    const docRef = await addDoc(collection(db, "products"), payload);
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
