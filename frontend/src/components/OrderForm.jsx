import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { placeOrder } from '../api/apiService';
import { useNavigate } from 'react-router-dom';

const OrderForm = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!customerName || !customerPhone) {
            setError('Please enter both name and phone number.');
            return;
        }
        if (cartItems.length === 0) {
            setError('Your cart is empty. Please add items before placing an order.');
            return;
        }

        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(customerPhone)) {
            setError('Please enter a valid 10-digit phone number.');
            return;
        }

        setIsLoading(true);

        const orderCartItems = cartItems.map(item => ({
            menuItemId: item._id,
            name: item.name,
            quantity: item.quantity,
            price: item.price
        }));

        const orderData = {
            customerName,
            customerPhone,
            cartItems: orderCartItems
        };

        try {
            const response = await placeOrder(orderData);
            clearCart();
            navigate('/confirmation', { state: { order: response.data.data } });
        } catch (err) {
            console.error("Order placement error:", err);
            setError(err.response?.data?.error || err.message || 'Failed to place order. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="order-form">
            <h3>Enter Your Details for Pickup</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="customerName">Name:</label>
                    <input
                        type="text"
                        id="customerName"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="customerPhone">Phone Number:</label>
                    <input
                        type="tel"
                        id="customerPhone"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        required
                        disabled={isLoading}
                        placeholder="e.g., 1234567890"
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" disabled={isLoading || cartItems.length === 0}>
                    {isLoading ? 'Placing Order...' : `Place Order ($${cartTotal.toFixed(2)})`}
                </button>
            </form>
        </div>
    );
};

export default OrderForm;