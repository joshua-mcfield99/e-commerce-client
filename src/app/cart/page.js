'use client';

import React, { useEffect, useState } from 'react';
import { useCart } from '../components/CartContext';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import styles from '../styles/cart.module.css';
import Image from 'next/image';
import Link from 'next/link';

const Cart = () => {
    const { cartItems, fetchCart, setCartItems } = useCart(); // Cart context methods
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated); // Check user authentication
    const [loading, setLoading] = useState(false); // State to handle loading
    const router = useRouter();

    // Redirect to login if user is not authenticated and fetch cart data when logged in
    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        fetchCart();
    }, [isAuthenticated, fetchCart, router]);

    // Update cart item quantity
    const updateCartItem = async (cart_item_id, newQuantity) => {
        if (newQuantity < 0) return; // Prevent negative quantities

        if (newQuantity === 0) {
            removeCartItem(cart_item_id); // Remove item if quantity is zero
            return;
        }

        try {
            setLoading(true);
            const response = await axios.put(
                `http://localhost:3001/api/cart/items/${cart_item_id}`,
                { quantity: newQuantity },
                { withCredentials: true }
            );

            // Update the local cart state with the new quantity and total price
            setCartItems((prevItems) =>
                prevItems.map((item) =>
                    item.cart_item_id === cart_item_id
                        ? { ...item, quantity: newQuantity, total_price: response.data.total_price }
                        : item
                )
            );
        } catch (error) {
            console.error('Error updating item:', error);
        } finally {
            setLoading(false);
        }
    };

    // Remove item from the cart
    const removeCartItem = async (cart_item_id) => {
        try {
            setLoading(true);
            await axios.delete(`http://localhost:3001/api/cart/items/${cart_item_id}`, { withCredentials: true });

            // Update the local cart state to remove the deleted item
            setCartItems((prevItems) => prevItems.filter((item) => item.cart_item_id !== cart_item_id));
        } catch (error) {
            console.error('Error removing item:', error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate total price and item count
    const totalPrice = cartItems.reduce((acc, item) => acc + (parseFloat(item.total_price) || 0), 0);
    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const formattedTotalPrice = totalPrice.toFixed(2);

    // Redirect message for unauthenticated users
    if (!isAuthenticated) {
        return <div>Redirecting to login...</div>;
    }

    return (
        <main className={styles.cart_page}>
            {cartItems.length === 0 ? (
                <p className={styles.empty}>Your cart is empty.</p>
            ) : (
                <div className={styles.cart}>
                    <h1>Your Cart</h1>
                    <ul>
                        {cartItems.map((item) => (
                            <li key={item.cart_item_id} className={styles.cart_item}>
                                <h2>{item.name}</h2>
                                <Image
                                    src={item.image_url || '/placeholder.png'} // Show placeholder image if URL is missing
                                    alt={item.name}
                                    width={150}
                                    height={150}
                                    className={styles.product_image}
                                />
                                <label htmlFor='quantity'>
                                    <h3>Quantity:</h3>
                                </label>
                                <input
                                    type="number"
                                    value={item.quantity}
                                    name='quantity'
                                    onChange={(e) => updateCartItem(item.cart_item_id, parseInt(e.target.value, 10))}
                                    min="0" // Allow 0 to remove the item
                                    className={styles.quantity_input}
                                />
                                <h3>Price: ${item.total_price}</h3>
                                <button
                                    className="button"
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
                        <h3>Total Price: ${formattedTotalPrice}</h3>
                        <Link href='/checkout' className="button">
                            Checkout
                        </Link>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Cart;
