import React from 'react';
import { useProductsOrdered } from '../context/ProductsOrdered';

export default function KithenDash() {
  const ProductsOrder = useProductsOrdered();
  console.log('ProductsOrder:', ProductsOrder);

  return (
    <>
      <div className='mt-24'>KithenDash</div>
      {
        ProductsOrder.products.map((product) => (
          <div key={product.id} className='mb-5 p-3'>
            <h2>Client ID: {product.clientId}</h2>
            <h1>Order #: {product.numberOrder}</h1>
            <h2>Admin ID: {product.adminId}</h2>

            {product.items?.map((item, index) => (
              <div key={index} className='ml-5'>
                <p>Item Name: {item.name}</p>
                <p>Price: {item.price}</p>
              </div>
            ))}
            <br />
          </div>
        ))
      }
    </>
  );
}
