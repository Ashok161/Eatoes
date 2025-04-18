import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const ConfirmationPage = () => {
    const location = useLocation();
    const order = location.state?.order;

    if (!order) {
        return (
            <div>
                <h2>Order Confirmation</h2>
                <p>No order details found. You might have refreshed the page or navigated here directly.</p>
                <p>You can check your <Link to="/order-lookup">Order History</Link> using your phone number.</p>
                <p><Link to="/">Return to Menu</Link></p>
            </div>
        );
    }

    return (
        <div>
            <h2>Order Confirmed!</h2>
            <p>Thank you for your order, {order.customerName}!</p>
            <p>Your order has been received and is being prepared for pickup.</p>
            <div className="order-card" style={{marginTop: '1.5rem'}}>
                 <h4>Order Summary (ID: {order.id})</h4>
                 <p><strong>Name:</strong> {order.customerName}</p>
                 <p><strong>Phone:</strong> {order.customerPhone}</p>
                 <p><strong>Total Paid:</strong> ${parseFloat(order.totalPrice).toFixed(2)}</p>
                 <p><strong>Status:</strong> {order.orderStatus}</p>
                 <h5>Items Ordered:</h5>
                  <ul>
                       {order.cartItems.map((item, index) => (
                           <li key={`${order.id}-confirm-${item.menuItemId}-${index}`}>
                               {item.name} - Qty: {item.quantity}
                           </li>
                       ))}
                   </ul>
             </div>
            <p style={{marginTop: '2rem'}}>
                <Link to="/">Place Another Order</Link> | <Link to="/order-lookup">Check Order History</Link>
            </p>
        </div>
    );
};

export default ConfirmationPage;