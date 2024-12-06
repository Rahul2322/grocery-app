import React from 'react';
import ProductItem from './ProductItem';
import { ProductType } from '../../types/cartItem.type';
import './productlist.css';

interface ProductListProps {
  products: ProductType[];
  onAddToCart: (product: ProductType) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onAddToCart }) => {
  return (
    <div className="products-container">
      {products.length === 0 ? (
        <p>No Products available</p>
      ) : (
        products.map((product) => (
          <ProductItem
            key={product.id}
            product={product}
            onAddToCart={() => onAddToCart(product)}
          />
        ))
      )}
    </div>
  );
};

export default ProductList;
