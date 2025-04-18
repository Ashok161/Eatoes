import React, { useState, useEffect } from 'react';
import { fetchMenuItems } from '../api/apiService';
import MenuItemCard from './MenuItemCard';

const MenuList = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('');

    const categories = ['Appetizer', 'Main Course', 'Dessert', 'Drink'];

    useEffect(() => {
        const loadMenu = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetchMenuItems(selectedCategory);
                setMenuItems(response.data.data);
            } catch (err) {
                console.error(err);
                setError(err.response?.data?.error || err.message || 'Failed to load menu items.');
            } finally {
                setLoading(false);
            }
        };

        loadMenu();
    }, [selectedCategory]);

    return (
        <div>
            <h2>Menu</h2>
            <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="category-select">Filter by Category: </label>
                <select
                    id="category-select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            {loading && <p>Loading menu...</p>}
            {error && <p className="error-message">Error: {error}</p>}
            {!loading && !error && menuItems.length === 0 && <p>No menu items found.</p>}
            {!loading && !error && menuItems.length > 0 && (
                <div className="menu-list">
                    {menuItems.map((item) => (
                        <MenuItemCard key={item._id} item={item} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MenuList;