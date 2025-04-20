import React from 'react'
import { useProductsOrdered } from '../context/ProductsOrdered'

export default function KithenDash() {
    const ProductsOrder = useProductsOrdered();
  return (
    <div className='mt-24'>KithenDash</div>
  )
}
