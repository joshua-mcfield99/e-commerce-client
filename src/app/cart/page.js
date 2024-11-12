'use client'
import React, { useEffect, useState } from 'react';
import { useCart } from '../components/CartContext';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import styles from '../styles/cart.module.css';
import Image from 'next/image';
import Link from 'next/link';

const Cart = () => {
    const { cartItems, fetchCart, setCartItems } = useCart(); // Use fetchCart from CartContext
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const [loading, setLoading] = useState(false); // Loading state for update/delete
    const router = useRouter();
    
    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login'); // Redirect to login if not authenticated
            return;
        }

        fetchCart(); // Fetch the cart items when the user is authenticated
    }, [isAuthenticated, fetchCart, router]);

    const updateCartItem = async (cart_item_id, newQuantity) => {
        if (newQuantity < 0) return; // Do not allow negative quantities

        if (newQuantity === 0) {
            removeCartItem(cart_item_id); // Remove the item if quantity is zero
            return;
        }

        try {
            setLoading(true);
            const response = await axios.put(`http://localhost:3001/api/cart/items/${cart_item_id}`, {
                quantity: newQuantity
            }, { withCredentials: true });

            // Update the cart state with the updated item
            setCartItems(prevItems => 
                prevItems.map(item => 
                    item.cart_item_id === cart_item_id 
                        ? { ...item, quantity: newQuantity, total_price: response.data.total_price } // Update quantity and total_price
                        : item
                )
            );
            setLoading(false);
        } catch (error) {
            console.error('Error updating item:', error);
            setLoading(false);
        }
    };

    const removeCartItem = async (cart_item_id) => {
        try {
            setLoading(true);
            await axios.delete(`http://localhost:3001/api/cart/items/${cart_item_id}`, { withCredentials: true });

            // Remove the item from the cart state
            setCartItems(prevItems => prevItems.filter(item => item.cart_item_id !== cart_item_id));
            setLoading(false);
        } catch (error) {
            console.error('Error removing item:', error);
            setLoading(false);
        }
    };

    // Calculate total price and number of items
    const totalPrice = cartItems.reduce((acc, item) => {
        const itemTotalPrice = parseFloat(item.total_price) || 0; // Ensure total_price is converted to a number
        return acc + itemTotalPrice;
    }, 0);
    
    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const formattedTotalPrice = totalPrice.toFixed(2);
    

    if (!isAuthenticated) {
        return <div>Redirecting to login...</div>;
    }

    return (
        <main className={`${styles.cart_page}`}>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div className={`${styles.cart}`}>
                    <h1>Your Cart</h1>
                    <ul>
                        {cartItems.map((item) => (
                            <li key={item.cart_item_id} className={`${styles.cart_item}`}>
                                <h2>{item.name}</h2>
                                <Image
                                    src={item.image_url || '/placeholder.png'} // Show placeholder if image_url is missing
                                    alt={item.name}
                                    width={150}
                                    height={150}
                                    className={`${styles.product_image}`}
                                />
                                <label htmlFor='quantity'>
                                    <h3>Quantity:</h3> 
                                </label>
                                <input 
                                    type="number" 
                                    value={item.quantity} 
                                    name='quantity'
                                    onChange={(e) => updateCartItem(item.cart_item_id, parseInt(e.target.value, 10))} 
                                    min="0" // Allow 0 to trigger removal
                                    className={`${styles.quantity_input}`}
                                />
                                <h3>Price: ${item.total_price}</h3> {/* Show updated total price per item */}
                                <button 
                                    className={`${'button'}`} 
                                    onClick={() => removeCartItem(item.cart_item_id)}
                                    disabled={loading}
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                    <div className={styles.cart_summary}>
                        <h3>Total Items: {totalItems}</h3>
                        <h3>Total Price: ${formattedTotalPrice}</h3> {/* Show total price */}
                        <Link href='/checkout' className={`${'button'}`}>Checkout</Link>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Cart;
