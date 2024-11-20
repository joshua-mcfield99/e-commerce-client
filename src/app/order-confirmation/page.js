'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import styles from '../styles/confirmation.module.css';

const OrderConfirmation = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [orderDetails, setOrderDetails] = useState(null); // State to store order details

    // Fetch order details using orderId from query parameters
    useEffect(() => {
        const fetchOrderDetails = async () => {
            const orderId = searchParams.get('orderId');
            if (!orderId) {
                console.log('No orderId provided');
                // Optionally redirect to homepage if orderId is missing
                // router.push('/');
                return;
            }

            try {
                const response = await axios.get(`http://localhost:3001/api/orders/${orderId}`, {
                    withCredentials: true,
                });
                setOrderDetails(response.data); // Set fetched order details
            } catch (error) {
                console.error('Error fetching order details:', error);
                // Optionally redirect to homepage on error
                // router.push('/');
            }
        };

        fetchOrderDetails();
    }, [searchParams]);

    // Display loading message while fetching data
    if (!orderDetails) return <p>Loading...</p>;

    return (
        <main className={styles.confirmation_page}>
            <h1>Thank you for your purchase!</h1>
            <p>Your payment was successful. Below are your order details:</p>

            {/* Order Summary Section */}
            <section className={styles.order_summary}>
                <h2>Order Summary</h2>
                <ul>
                    {orderDetails.items.map((item) => (
                        <li key={item.order_item_id}>
                            <span>{item.product_name}</span>
                            <span>{item.quantity} x ${parseFloat(item.price).toFixed(2)}</span>
                        </li>
                    ))}
                </ul>
                <h3>Total: ${parseFloat(orderDetails.total_price).toFixed(2)}</h3>
            </section>

            {/* Shipping Address Section */}
            <section className={styles.shipping_details}>
                <h2>Shipping Address</h2>
                <p><strong>Name:</strong> {orderDetails.address.name}</p>
                <p><strong>Street:</strong> {orderDetails.address.street}</p>
                <p><strong>City:</strong> {orderDetails.address.city}</p>
                <p><strong>Postal Code:</strong> {orderDetails.address.postal_code}</p>
                <p><strong>Country:</strong> {orderDetails.address.country}</p>
            </section>

            {/* Optionally include a note about email confirmation */}
            {/* <p>We hope you enjoy your purchase! A confirmation email has been sent to your registered email address.</p> */}
        </main>
    );
};

export default OrderConfirmation;