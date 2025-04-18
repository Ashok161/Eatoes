import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CartProvider } from './context/CartContext';

import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ConfirmationPage from './pages/ConfirmationPage';
import OrderLookupPage from './pages/OrderLookupPage';

import './index.css';

function App() {
    return (
        <CartProvider>
            <Router>
                <Navbar />
                <div className="container">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route path="/confirmation" element={<ConfirmationPage />} />
                        <Route path="/order-lookup" element={<OrderLookupPage />} />
                        <Route path="*" element={<HomePage />} />
                    </Routes>
                </div>
            </Router>
        </CartProvider>
    );
}

export default App;