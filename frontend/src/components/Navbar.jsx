import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext'; 

const Navbar = () => {
     const { cartItemCount } = useCart(); 

    return (
        <nav>
            <ul>
                <li><Link to="/">Menu</Link></li>
                <li><Link to="/cart">Cart ({cartItemCount})</Link></li>
                <li><Link to="/order-lookup">Order History</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;