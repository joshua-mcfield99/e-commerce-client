'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../styles/confirmation.module.css';

const OrderConfirmation = () => {
    const router = useRouter();
    const [orderDetails, setOrderDetails] = useState(null);

    useEffect(() => {
        // Mock fetching order data from the server or from local storage after successful payment
        const storedOrder = JSON.parse(localStorage.getItem('orderDetails'));
        if (storedOrder) {
            setOrderDetails(storedOrder);
        } else {
            // Redirect to homepage if no order data is available
            router.push('/');
        }
    }, [router]);

    if (!orderDetails) return <p>Loading...</p>;

    return (
        <main className={styles.confirmation_page}>
            <h1>Thank you for your purchase!</h1>
            <p>Your payment was successful. Below are your order details:</p>

            {/* Order Summary */}
            <section className={styles.order_summary}>
                <h2>Order Summary</h2>
                <ul>
                    {orderDetails.cartItems.map((item) => (
                        <li key={item.cart_item_id}>
                            <span>{item.name}</span>
                            <span>{item.quantity} x ${parseFloat(item.price).toFixed(2)}</span>
                        </li>
                    ))}
                </ul>
                <h3>Total: ${parseFloat(orderDetails.totalPrice).toFixed(2)}</h3>
            </section>

            {/* Shipping Address */}
            <section className={styles.shipping_details}>
                <h2>Shipping Address</h2>
                <p><strong>Name:</strong> {orderDetails.address.name}</p>
                <p><strong>Street:</strong> {orderDetails.address.street}</p>
                <p><strong>City:</strong> {orderDetails.address.city}</p>
                <p><strong>ZIP Code:</strong> {orderDetails.address.zip}</p>
                <p><strong>Country:</strong> {orderDetails.address.country}</p>
            </section>

            <p>We hope you enjoy your purchase! A confirmation email has been sent to your registered email address.</p>
        </main>
    );
};

export default OrderConfirmation; 