import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        try {
            const localCart = localStorage.getItem('digitalDinerCart');
            return localCart ? JSON.parse(localCart) : [];
        } catch (error) {
            console.error("Could not parse cart from localStorage", error);
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('digitalDinerCart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (itemToAdd) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item._id === itemToAdd._id);
            if (existingItem) {
                return prevItems.map(item =>
                    item._id === itemToAdd._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prevItems, { ...itemToAdd, quantity: 1 }];
            }
        });
    };

    const removeFromCart = (itemIdToRemove) => {
        setCartItems(prevItems => prevItems.filter(item => item._id !== itemIdToRemove));
    };

    const decreaseQuantity = (itemIdToDecrease) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item._id === itemIdToDecrease);
            if (existingItem && existingItem.quantity > 1) {
                return prevItems.map(item =>
                    item._id === itemIdToDecrease
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                );
            } else {
                return prevItems.filter(item => item._id !== itemIdToDecrease);
            }
        });
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('digitalDinerCart');
    };

    const cartTotal = useMemo(() => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    }, [cartItems]);

    const cartItemCount = useMemo(() => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    }, [cartItems]);

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        decreaseQuantity,
        clearCart,
        cartTotal,
        cartItemCount,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};