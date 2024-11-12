'use client'
import { createContext, useContext, useState, useMemo } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const fetchCart = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/cart', { withCredentials: true });
            setCartItems(response.data.items);
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    };

    const addToCart = async (product_id, quantity) => {
        try {
            const response = await axios.post('http://localhost:3001/api/cart/items', 
                { product_id, quantity }, 
                { withCredentials: true }
            );
            // Update the local state after successfully adding to cart
            setCartItems((prevItems) => [...prevItems, response.data]);
        } catch (error) {
            console.error('Error adding item to cart:', error);
        }
    };

    const removeFromCart = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/api/cart/items/${id}`, { withCredentials: true });
            setCartItems((prevItems) => prevItems.filter(item => item.cart_item_id !== id));
        } catch (error) {
            console.error('Error removing item from cart:', error);
        }
    };

    // Function to calculate the total quantity of items in the cart
    const totalQuantity = useMemo(() => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    }, [cartItems]);

    return (
        <CartContext.Provider value={{ cartItems, setCartItems, addToCart, removeFromCart, fetchCart, totalQuantity }}>
            {children}
        </CartContext.Provider>
    );
};