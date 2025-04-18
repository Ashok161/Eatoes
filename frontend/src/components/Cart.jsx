import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const Cart = () => {
    const { cartItems, cartTotal, removeFromCart, addToCart, decreaseQuantity } = useCart(); 

    if (cartItems.length === 0) {
        return (
             <div>
                 <h2>Your Cart</h2>
                 <p>Your cart is empty.</p>
             </div>
         );
    }

    return (
        <div>
            <h2>Your Cart</h2>
            <div className="cart-items">
                {cartItems.map(item => (
                    <div key={item._id} className="cart-item">
                        <h4>{item.name}</h4>
                        <p>Price: ${item.price.toFixed(2)}</p>
                        <p>Quantity: {item.quantity}</p>
                        <p>Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
                        <div>
                             <button onClick={() => addToCart(item)}>+</button>
                             <button onClick={() => decreaseQuantity(item._id)} disabled={item.quantity <= 1}>-</button> 
                             <button onClick={() => removeFromCart(item._id)} className="remove-btn">Remove</button>
                         </div>
                    </div>
                ))}
            </div>
            <div className="cart-summary">
                <h3>Cart Summary</h3>
                <p>Total Items: {cartItems.reduce((count, item) => count + item.quantity, 0)}</p>
                <p><strong>Total Price: ${cartTotal.toFixed(2)}</strong></p>
                 <Link to="/checkout">
                     <button style={{ marginTop: '1rem', width: '100%', padding: '0.8rem' }}>
                         Proceed to Checkout
                     </button>
                 </Link>
            </div>
        </div>
    );
};

export default Cart;