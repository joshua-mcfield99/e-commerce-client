'use client';

import { createContext, useContext, useState, useMemo } from 'react';
import axios from 'axios';

// Create CartContext for managing cart state
const CartContext = createContext();

// Custom hook to access CartContext
export const useCart = () => {
    return useContext(CartContext);
};

// CartProvider component to wrap around the app or specific parts
export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    // Fetch the cart items from the backend
    const fetchCart = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/cart', { withCredentials: true });
            setCartItems(response.data.items);
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    };

    // Add an item to the cart
    const addToCart = async (product_id, quantity) => {
        try {
            const response = await axios.post(
                'http://localhost:3001/api/cart/items', 
                { product_id, quantity }, 
                { withCredentials: true }
            );
            setCartItems((prevItems) => [...prevItems, response.data]); // Update local state
        } catch (error) {
            console.error('Error adding item to cart:', error);
        }
    };

    // Remove an item from the cart
    const removeFromCart = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/api/cart/items/${id}`, { withCredentials: true });
            setCartItems((prevItems) => prevItems.filter(item => item.cart_item_id !== id)); // Update local state
        } catch (error) {
            console.error('Error removing item from cart:', error);
        }
    };

    // Calculate total quantity of items in the cart
    const totalQuantity = useMemo(() => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    }, [cartItems]);

    return (
        <CartContext.Provider value={{ cartItems, setCartItems, addToCart, removeFromCart, fetchCart, totalQuantity }}>
            {children}
        </CartContext.Provider>
    );
};