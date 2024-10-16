'use client'
import React, { useEffect } from 'react';
import { useCart } from '../components/CartContext';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import styles from '../styles/cart.module.css'
import Image from 'next/image';

const Cart = () => {
    const { cartItems, fetchCart } = useCart(); // Use fetchCart from CartContext
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const router = useRouter();
    
    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login'); // Redirect to login if not authenticated
            return;
        }

        fetchCart(); // Fetch the cart items when the user is authenticated
    }, [isAuthenticated, fetchCart, router]);

    if (!isAuthenticated) {
        return <div>Redirecting to login...</div>;
    }

    return (
        <main className={`${styles.cart_page}`}>
            <h1>Your Cart</h1>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <ul className={`${styles.cart}`}>
                    {cartItems.map((item) => (
                        <li key={item.cart_item_id} className={`${styles.cart_item}`}>
                            <h3>{item.name}</h3>
                            <Image
                                src={item.image_url || '/placeholder.png'} // Show placeholder if image_url is missing
                                alt={item.name}
                                width={150}
                                height={150}
                                className={`${styles.product_image}`}
                            />
                            <p>
                                Quantity: {item.quantity} - Price: ${item.price}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </main>
    );
};

export default Cart;
