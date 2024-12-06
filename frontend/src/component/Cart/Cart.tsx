import "./cart.css";
import { ProductType } from "../../types/cartItem.type";

interface CartProps {
  cartItems: ProductType[];
}

// const Cart: React.FC<CartProps> = ({ cartItems }) => {
//   return (
//     <div className="cart-container">
//       <h3>Cart Items</h3>
//       {cartItems.length === 0 ? (
//         <p>No items in the cart</p>
//       ) : (
//         cartItems.map((item, index) => (
//           <div key={index} className="cart-item">
//             <p>{item.name}</p>
//             <p>Price: {item.price}</p>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default Cart;

const Cart: React.FC<CartProps> = ({ cartItems }) => {
  return (
    <div>
      <h3>Cart Items</h3>
      {cartItems.length === 0 ? (
        <p>No items in the cart</p>
      ) : (
        cartItems.map((item, index) => (
          <div key={index} className="cart-item">
            <p>{item.name}</p>
            <p>Price: {item.price}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Cart;
