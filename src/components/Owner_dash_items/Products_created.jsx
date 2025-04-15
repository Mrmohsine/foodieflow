import React, { useState } from 'react';
import { addProduct, updateProduct, deleteProduct } from "../../firebase/firebase-collections";
import Products from '../form/Products';
import ProductsShow from './ProductsShow';

export default function Products_created() {
  const [productId, setProductId] = useState(null);
  const [isOpen, setIsOpen] = useState(true);

  const cardStyle = {
    backgroundColor: '#fff',
    border: '2px solid orange',
    borderRadius: '8px',
    padding: '20px',
    width: '300px',
    margin: '20px auto',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
  };

  const buttonStyle = {
    backgroundColor: 'orange',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    margin: '5px',
    borderRadius: '4px',
    cursor: 'pointer'
  };

  const handleAddProduct = async () => {
    setIsOpen(!isOpen);
  };

  const handleUpdateProduct = async () => {
    
  };

  const handleDeleteProduct = async () => {
    
  };

  return (
    <>
    <div className='flex flex-row justify-around items-center p-4'>
      <h1 className="text-3xl font-bold text-orange-500 ">Products Management</h1>
      <button onClick={handleAddProduct} style={buttonStyle}>Add Product</button>
    </div>
    {isOpen ? <Products setIsOpen={setIsOpen}/> : <></>}
    <ProductsShow />
    </>
  );
}