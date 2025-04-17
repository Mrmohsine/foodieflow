import React, { useState } from 'react';
import Products from '../form/Products';
import ProductsShow from './ProductsShow';
import { deleteProduct } from '../../firebase/firebase-collections';
import { useProductsByAdmin } from '../context/productsByAdmin';

export default function Products_created() {
  const [productToEdit, setProductToEdit] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const { products, count, setCount } = useProductsByAdmin(0);

  const handleAddClick = () => {
    setProductToEdit(null);
    setIsOpen(prev => !prev);
  };

  const handleEdit = (product) => {
    setProductToEdit(product);
    setIsOpen(true);
  };

  const handleDelete = async (id) => {
    await deleteProduct(id);
    setCount(count + 1);
  };

  return (
    <>
      <div className="flex justify-between items-center p-4 w-[85%] mx-auto">
        <h1 className="text-3xl font-bold text-orange-500">Products Management</h1>
        <button onClick={handleAddClick} className="bg-orange-500 text-white px-5 py-2 rounded">
          {isOpen ? 'Close Form' : 'Add Product'}
        </button>
      </div>
      {isOpen && (
        <Products
          productToEdit={productToEdit}
          setProductToEdit={setProductToEdit}
          setIsOpen={setIsOpen}
        />
      )}
      <ProductsShow products={products} onEdit={handleEdit} onDelete={handleDelete} />
    </>
  );
}
