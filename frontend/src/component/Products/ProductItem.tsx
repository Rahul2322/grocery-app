import React from 'react';
import './productitem.css'
import { ProductType } from '../../types/cartItem.type';
interface Props {
    product: ProductType;
    onAddToCart():void
  }
const ProductItem:React.FC<Props> = ({product,onAddToCart}) => {   
  return (
    <div className="product-item-conatiner">
      <img src="" alt="product"/>
      <div>
      <h2>{product.name}</h2>
      <h2>Price {product.price}</h2>
      </div>
      <button className='cart-button' onClick={onAddToCart}>Add To Cart</button>
    </div>
  )
}

export default ProductItem
