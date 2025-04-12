import React from 'react'
import { addProduct } from "../../firebase/firebase-collections";



export default function Products_created() {
    const handleAddProduct = async () => {
        const newProduct = {
          name: "Apple Juice",
          price: 9.99,
          stock: 100,
          category: "Drinks",
        };
      
        try {
          const id = await addProduct(newProduct);
          console.log("Product added with ID:", id);
        } catch {
          alert("Failed to add product.");
        }
      };
  return (
    <>
    <div>Products_created</div>
    <button onClick={handleAddProduct}>creer product</button>
    <button onClick={handleAddProduct}>modifie</button>
    <button onClick={handleAddProduct}>supprime</button>
    </>
  )
}
