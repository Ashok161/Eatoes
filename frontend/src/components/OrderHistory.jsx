import React, { useState } from 'react';
import { fetchOrdersByPhone } from '../api/apiService';

const OrderHistory = () => {
    const [phone, setPhone] = useState('');
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!phone) {
            setError('Please enter a phone number.');
            return;
        }
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone)) {
            setError('Please enter a valid 10-digit phone number.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setSearched(true);
        setOrders([]);

        try {
            const response = await fetchOrdersByPhone(phone);
            setOrders(response.data.data);
        } catch (err) {
            console.error("Error fetching order history:", err);
            if (err.response && err.response.status === 404) {
                setOrders([]);
            } else {
                setError(err.response?.data?.error || err.message || 'Failed to fetch order history.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="order-lookup-form">
            <h3>Look Up Past Orders</h3>
            <form onSubmit={handleSearch}>
                <div className="form-group">
                    <label htmlFor="searchPhone">Enter Phone Number:</label>
                    <input
                        type="tel"
                        id="searchPhone"
                        value={phone}
                        onChange={(e) => {
                            setPhone(e.target.value);
                            setError(null);
                            setSearched(false);
                            setOrders([]);
                        }}
                        required
                        disabled={isLoading}
                        placeholder="e.g., 1234567890"
                    />
                </div>
                {error && <p className="error-message" style={{marginBottom: '1rem'}}>{error}</p>}
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Searching...' : 'Find Orders'}
                </button>
            </form>

            <div className="order-history" style={{marginTop: '2rem'}}>
                {isLoading && <p>Loading orders...</p>}
                {!isLoading && searched && orders.length === 0 && <p>No orders found for this phone number.</p>}
                {!isLoading && orders.length > 0 && (
                    <>
                    <h4>Order History for {phone}</h4>
                    {orders.map(order => (
                        <div key={order.id} className="order-card">
                            <h4>Order ID: {order.id}</h4>
                            <p>Placed on: {new Date(order.createdAt).toLocaleString()}</p>
                            <p>Status: {order.orderStatus}</p>
                            <p><strong>Total: ${parseFloat(order.totalPrice).toFixed(2)}</strong></p>
                            <h5>Items:</h5>
                            <ul>
                                {order.cartItems.map((item, index) => (
                                    <li key={`${order.id}-${item.menuItemId}-${index}`}>
                                        {item.name} - Qty: {item.quantity} @ ${parseFloat(item.price).toFixed(2)} each
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                    </>
                )}
            </div>
        </div>
    );
};

export default OrderHistory;