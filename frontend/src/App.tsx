import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import ProductList from './component/Products/ProductList';
import Cart from './component/Cart/Cart';
import Login from './component/Auth/Login';
import Signup from './component/Auth/Register';
import { FaCartShopping } from "react-icons/fa6";
import { ProductType } from './types/cartItem.type';
import AddProductItem from './component/Products/AddProductItem';



function App() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [cartItems, setCartItems] = useState<ProductType[]>([]);
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/product');
        setProducts(response.data.data); 
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: ProductType) => {
    if (!loggedInUser) {
      alert("Please log in to add items to your cart.");
      return;
    }
    setCartItems((prevCartItems) => [...prevCartItems, product]);
  };

  return (
    <Router>
      <div>
        <div className="header">
          <h2>Groceries</h2>
          <Link to="/cart" className="cart-link">
            <FaCartShopping /> {cartItems.length}
          </Link>
          <div className="auth-links">
            {loggedInUser ? (
              <>
                <span>{loggedInUser}</span>
                <button onClick={() => setLoggedInUser(null)}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link> | <Link to="/signup">Signup</Link>
              </>
            )}
          </div>
        </div>
        <Routes>
        <Route path="/admin/product/:id" element={<AddProductItem/>} /> 
        <Route path="/admin/product" element={<AddProductItem />} />
          <Route
            path="/"
            element={
              <ProductList
                products={products}
                onAddToCart={handleAddToCart}
              />
            }
          />
          <Route
            path="/cart"
            element={
              loggedInUser ? (
                <Cart cartItems={cartItems} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/login"
            element={<Login onLogin={(user) => setLoggedInUser(user)} />}
          />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
