'use client';

import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import styles from '../styles/checkout.module.css';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const CheckoutForm = ({ cartItems, totalPrice, cartId }) => {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();
    const [address, setAddress] = useState({ name: '', street: '', city: '', state: '', postal_code: '', country: '' });
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [addressId, setAddressId] = useState(null);

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setAddress((prevAddress) => ({ ...prevAddress, [name]: value }));
    };

    const saveAddress = async () => {
        try {
            const response = await axios.post(
                'http://localhost:3001/api/addresses',
                address,
                { withCredentials: true } // This ensures the session cookie is sent with the request
            );
            setAddressId(response.data.address_id);
            return response.data.address_id;
        } catch (error) {
            console.error('Error saving address:', error);
            setErrorMessage('Failed to save address. Please try again.');
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return; // Ensure Stripe.js has loaded

        setIsSubmitting(true);

        // Step 1: Save the address and get the address ID
        const savedAddressId = await saveAddress();
        if (!savedAddressId) {
            setIsSubmitting(false);
            return;
        }

        // Step 2: Confirm payment with Stripe
        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: 'http://localhost:3000/order-confirmation',
            },
        });

        if (error) {
            setErrorMessage(error.message);
            setIsSubmitting(false);
            return;
        }

        // Step 3: If payment succeeds, create the order with the backend
        try {
            await axios.post(`http://localhost:3001/api/cart/${cartId}/checkout`, {
                payment_details: paymentIntent.id, // Using the payment intent ID as payment details
                address_id: savedAddressId,
            });
            router.push('/order-confirmation'); // Redirect to order confirmation page
        } catch (orderError) {
            console.error('Error creating order:', orderError);
            setErrorMessage('Failed to create order. Please contact support.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <section className={styles.summary}>
                <h2>Order Summary</h2>
                <ul>
                    {cartItems.map((item) => (
                        <li key={item.cart_item_id}>
                            <span>{item.name} </span>
                            <br></br>
                            <span>{item.quantity}x ${parseFloat(item.price).toFixed(2)}</span>
                        </li>
                    ))}
                </ul>
                <h3>Total: ${totalPrice}</h3>
            </section>

            <section className={styles.address_form}>
                <h2>Shipping Address</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor='name'>Full Name:</label>
                    <input type="text" name="name" placeholder="Full Name" value={address.name} onChange={handleAddressChange} required />
                    <label htmlFor='street'>Street and Number:</label>
                    <input type="text" name="street" placeholder="Street Address" value={address.street} onChange={handleAddressChange} required />
                    <label htmlFor='city'>City:</label>
                    <input type="text" name="city" placeholder="City" value={address.city} onChange={handleAddressChange} required />
                    <label htmlFor='state'>State/County:</label>
                    <input type="text" name="state" placeholder="State/County" value={address.state} onChange={handleAddressChange} required />
                    <label htmlFor='postal_code'>Postal Code:</label>
                    <input type="text" name="postal_code" placeholder="Postal Code" value={address.postal_code} onChange={handleAddressChange} required />
                    <label htmlFor='country'>Country:</label>
                    <input type="text" name="country" placeholder="Country" value={address.country} onChange={handleAddressChange} required />
                </form>
            </section>

            <section className={styles.payment_form}>
                <h2>Payment Details</h2>
                <form onSubmit={handleSubmit}>
                    <PaymentElement />
                    <button type="submit" disabled={!stripe || isSubmitting}>
                        {isSubmitting ? 'Processing...' : 'Pay Now'}
                    </button>
                    {errorMessage && <p className={styles.error}>{errorMessage}</p>}
                </form>
            </section>
        </>
    );
};

export default CheckoutForm;