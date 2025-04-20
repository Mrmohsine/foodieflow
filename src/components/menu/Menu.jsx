import React from 'react'
import MenuForClients from './MenuForClients'
import { useFirestoreUser } from '../../User_crud/users_crud';
import ProductsShow from '../Owner_dash_items/ProductsShow';
import { useProductsByAdmin } from '../context/productsByAdmin';
import { useUser } from '../context/user';

export default function Menu() {
  const { firestoreUser, loading } = useFirestoreUser();
  const {user}  = useUser();

     const { products, count, setCount } = useProductsByAdmin(0);

  if (loading) {
    return null; 
  }

  return (
    <>
    <div className='mt-12 '>
    {/* <MenuForClients /> */}
      {user?.role === 'client' ? <MenuForClients /> :user?.role === 'admin' ? <ProductsShow products={products}  /> : <></>}
    </div>
    </>
  );
}