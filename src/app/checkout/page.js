'use client'
import React, { useEffect, useState } from 'react';
import { useCart } from '../components/CartContext';
import StripeProvider from '../stripeProvider';
import CheckoutForm from '../components/CheckoutForm'; // Assuming the form content is here
import styles from '../styles/checkout.module.css';
import axios from 'axios';

const CheckoutPage = () => {
    const { cartItems } = useCart();
    const [clientSecret, setClientSecret] = useState(null);

    // Calculate total price, ensuring it's parsed as a float and then converted to cents
    const totalPrice = cartItems.reduce((acc, item) => acc + parseFloat(item.total_price || 0), 0).toFixed(2);
    const amountInCents = Math.round(parseFloat(totalPrice) * 100);
    
    console.log("Total Price:", totalPrice); // Debugging output
    console.log("Amount in Cents:", amountInCents); // Debugging output
    
    useEffect(() => {
        // Fetch clientSecret from backend to initialize Stripe Elements
        const fetchClientSecret = async () => {
            try {
                const { data } = await axios.post('http://localhost:3001/api/payments/create-payment-intent', {
                    amount: amountInCents, // Stripe expects the amount in cents
                });
                setClientSecret(data.clientSecret);
            } catch (error) {
                console.error('Error fetching client secret:', error);
            }
        };
        fetchClientSecret();
    }, [amountInCents]);

    if (!clientSecret) return <p>Loading...</p>;

    return (
        <main className={`${styles.checkout_page}`}>
            <StripeProvider clientSecret={clientSecret}>
                <h1>Checkout</h1>
                <CheckoutForm cartItems={cartItems} totalPrice={totalPrice} />
            </StripeProvider>
        </main>
    );
};

export default CheckoutPage;