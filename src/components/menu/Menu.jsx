import React from 'react'
import MenuForClients from './MenuForClients'
import { useFirestoreUser } from '../../User_crud/users_crud';
import ProductsShow from '../Owner_dash_items/ProductsShow';
import { useProductsByAdmin } from '../context/productsByAdmin';

export default function Menu() {
  const { firestoreUser, loading } = useFirestoreUser();

     const { products, count, setCount } = useProductsByAdmin(0);

  if (loading) {
    return null; 
  }

  return (
    <>
      {firestoreUser?.role === 'client' ? <MenuForClients /> :firestoreUser?.role === 'admin' ? <ProductsShow products={products}  /> : <></>}
    </>
  );
}