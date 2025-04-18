import React from 'react';
import { useCart } from '../context/CartContext';

const MenuItemCard = ({ item }) => {
    const { addToCart } = useCart();

    return (
        <div className="menu-item-card" style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', marginBottom: '20px' }}>
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <p><strong>Category:</strong> {item.category}</p>
            <p><strong>Price:</strong> ${item.price.toFixed(2)}</p>
            <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => addToCart(item)}>Add to Cart</button>
            </div>
        </div>
    );
};

export default MenuItemCard;