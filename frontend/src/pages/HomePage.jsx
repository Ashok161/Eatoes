import React from 'react';
import MenuList from '../components/MenuList';

const HomePage = () => {
    return (
        <div>
            <h1>Welcome to The Digital Diner!</h1>
            <p>Browse our menu below and add items to your cart.</p>
            <MenuList />
        </div>
    );
};

export default HomePage;