import React from 'react';
import OrderForm from '../components/OrderForm';
import { useCart } from '../context/CartContext'; 

const CheckoutPage = () => {
     const { cartItems, cartTotal } = useCart();

     if (cartItems.length === 0) {
         return (
             <div>
                 <h2>Checkout</h2>
                 <p>Your cart is empty. Please add items from the <a href="/">menu</a> first.</p>
             </div>
         );
     }

    return (
        <div>
            <h2>Checkout</h2>
            <div style={{marginBottom: '1.5rem', padding: '1rem', background: '#eee', borderRadius: '4px'}}>
                <h4>Order Summary</h4>
                <p>Total Items: {cartItems.reduce((count, item) => count + item.quantity, 0)}</p>
                <p><strong>Total Price: ${cartTotal.toFixed(2)}</strong></p>
            </div>
            <OrderForm />
        </div>
    );
};

export default CheckoutPage;