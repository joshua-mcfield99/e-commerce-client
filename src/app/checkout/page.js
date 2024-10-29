'use client';
import React, { useEffect, useState } from 'react';
import { useCart } from '../components/CartContext';
import StripeProvider from '../stripeProvider';
import CheckoutForm from '../components/CheckoutForm';
import styles from '../styles/checkout.module.css';
import axios from 'axios';

const CheckoutPage = () => {
    const { cartItems } = useCart();
    const [clientSecret, setClientSecret] = useState(null);
    const [cartId, setCartId] = useState(null);

    const totalPrice = cartItems.reduce((acc, item) => acc + parseFloat(item.total_price || 0), 0).toFixed(2);
    const amountInCents = Math.round(parseFloat(totalPrice) * 100);

    useEffect(() => {
        const fetchClientSecretAndCartId = async () => {
            try {
                const cartResponse = await axios.get('http://localhost:3001/api/cart', { withCredentials: true });
                setCartId(cartResponse.data.cart_id);

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

    if (!clientSecret || !cartId) return <p>Loading...</p>;

    return (
        <main className={`${styles.checkout_page}`}>
            <StripeProvider clientSecret={clientSecret}>
                <h1>Checkout</h1>
                <CheckoutForm cartItems={cartItems} totalPrice={totalPrice} cartId={cartId} clientSecret={clientSecret} />
            </StripeProvider>
        </main>
    );
};

export default CheckoutPage;