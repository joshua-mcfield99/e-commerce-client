'use client';

import React, { useEffect, useState } from 'react';
import { useCart } from '../components/CartContext';
import StripeProvider from '../stripeProvider';
import CheckoutForm from '../components/CheckoutForm';
import styles from '../styles/checkout.module.css';
import axios from 'axios';

const CheckoutPage = () => {
    const { cartItems } = useCart(); // Access cart items from the context
    const [clientSecret, setClientSecret] = useState(null); // Stripe client secret for payment
    const [cartId, setCartId] = useState(null); // Cart ID for the current user

    // Calculate total price of the cart and convert to cents for Stripe
    const totalPrice = cartItems.reduce((acc, item) => acc + parseFloat(item.total_price || 0), 0).toFixed(2);
    const amountInCents = Math.round(parseFloat(totalPrice) * 100);

    useEffect(() => {
        // Fetch cart ID and create a payment intent
        const fetchClientSecretAndCartId = async () => {
            try {
                // Get the cart details from the backend
                const cartResponse = await axios.get('http://localhost:3001/api/cart', { withCredentials: true });
                setCartId(cartResponse.data.cart_id);

                // Create a payment intent with the total amount
                const { data } = await axios.post('http://localhost:3001/api/payments/create-payment-intent', {
                    amount: amountInCents,
                });
                setClientSecret(data.clientSecret);
            } catch (error) {
                console.error('Error fetching cartId or clientSecret:', error);
            }
        };

        fetchClientSecretAndCartId();
    }, [amountInCents]);

    // Display a loading message until clientSecret and cartId are available
    if (!clientSecret || !cartId) return <p>Loading...</p>;

    return (
        <main className={styles.checkout_page}>
            <StripeProvider clientSecret={clientSecret}>
                <div className={styles.title}>
                    <h1>Checkout</h1>
                </div>
                <CheckoutForm 
                    cartItems={cartItems} 
                    totalPrice={totalPrice} 
                    cartId={cartId} 
                    clientSecret={clientSecret} 
                />
            </StripeProvider>
        </main>
    );
};

export default CheckoutPage;