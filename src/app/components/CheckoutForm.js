'use client';

import React, { useState, useEffect } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import styles from '../styles/checkout.module.css';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const CheckoutForm = ({ cartItems, totalPrice, cartId, clientSecret }) => {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();

    // State to handle addresses and selected address
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState('new');
    const [address, setAddress] = useState({ name: '', street: '', city: '', state: '', postal_code: '', country: '' });
    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch saved addresses on mount
    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/users/profile', { withCredentials: true });
                setSavedAddresses(response.data.addresses || []);
            } catch (error) {
                console.error('Error fetching addresses:', error);
                setSavedAddresses([]);
            }
        };
        fetchAddresses();
    }, []);

    // Handle address dropdown change
    const handleAddressSelection = (e) => {
        const addressId = e.target.value;
        setSelectedAddressId(addressId);

        if (addressId !== 'new') {
            const selectedAddress = savedAddresses.find(addr => addr.address_id === addressId);
            if (selectedAddress) {
                setAddress(selectedAddress);
                setErrors({});
            }
        } else {
            setAddress({ name: '', street: '', city: '', state: '', postal_code: '', country: '' });
        }
    };

    // Handle form input changes
    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setAddress((prevAddress) => ({ ...prevAddress, [name]: value }));
        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' })); // Clear field-specific error
    };

    // Validate the address form
    const validateAddress = () => {
        const errors = {};
    
        // Check if all required fields are filled
        if (!address.name.trim()) errors.name = 'Full Name is required';
        if (!address.street.trim()) errors.street = 'Street Address is required';
        if (!address.city.trim()) errors.city = 'City is required';
        if (!address.state.trim()) errors.state = 'State/County is required';
        if (!address.country.trim()) errors.country = 'Country is required';
    
        // Postal code validation for UK and US
        const ukPostalCodeRegex = /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i;
        const usPostalCodeRegex = /^\d{5}(-\d{4})?$/;
    
        if (!address.postal_code.trim()) {
            errors.postal_code = 'Postal Code is required';
        } else if (
            address.country.toLowerCase() === 'united kingdom' &&
            !ukPostalCodeRegex.test(address.postal_code)
        ) {
            errors.postal_code = 'Invalid UK postal code';
        } else if (
            address.country.toLowerCase() === 'united states' &&
            !usPostalCodeRegex.test(address.postal_code)
        ) {
            errors.postal_code = 'Invalid US postal code';
        }
    
        // Update errors state
        setErrors(errors);
    
        // Return true if no errors, false otherwise
        return Object.keys(errors).length === 0;
    };

    const saveAddress = async () => {
        if (selectedAddressId !== 'new') return selectedAddressId;

        if (!validateAddress()) return null;

        try {
            const response = await axios.post(
                'http://localhost:3001/api/addresses',
                address,
                { withCredentials: true }
            );
            return response.data.address_id;
        } catch (error) {
            console.error('Error saving address:', error);
            setErrorMessage('Failed to save address. Please try again.');
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements || !clientSecret) {
            console.error("Stripe.js or clientSecret has not loaded.");
            return;
        }

        setIsSubmitting(true);
        const addressId = await saveAddress();

        if (!addressId) {
            setIsSubmitting(false);
            return;
        }

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: { return_url: 'http://localhost:3000/order-confirmation' },
            redirect: 'if_required',
        });

        if (error) {
            setErrorMessage(error.message);
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:3001/api/checkout/cart/${cartId}`,
                { payment_details: 'payment_intent_id', address_id: addressId },
                { withCredentials: true }
            );

            const orderId = response.data.order_id;
            router.push(`/order-confirmation?orderId=${orderId}`);
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
                            <span>{item.name}</span>
                            <br />
                            <span>{item.quantity}x ${parseFloat(item.price).toFixed(2)}</span>
                        </li>
                    ))}
                </ul>
                <h3>Total: ${totalPrice}</h3>
            </section>

            <section className={styles.address_form}>
                <h2>Shipping Address</h2>
                
                {/* Address Dropdown */}
                <label htmlFor="address-select">Choose an address:</label>
                <select id="address-select" onChange={handleAddressSelection} value={selectedAddressId}>
                    <option value="new">New Address</option>
                    {savedAddresses.map((addr) => (
                        <option key={addr.address_id} value={addr.address_id}>
                            {addr.street}, {addr.city}, {addr.state} - {addr.postal_code}
                        </option>
                    ))}
                </select>

                {/* Address Form (visible only if "New Address" is selected) */}
                {selectedAddressId === 'new' && (
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="name">Full Name:</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={address.name}
                            onChange={handleAddressChange}
                            required
                        />
                        {errors.name && <p className={styles.error}>{errors.name}</p>}

                        <label htmlFor="street">Street and Number:</label>
                        <input
                            type="text"
                            name="street"
                            placeholder="Street Address"
                            value={address.street}
                            onChange={handleAddressChange}
                            required
                        />
                        {errors.street && <p className={styles.error}>{errors.street}</p>}

                        <label htmlFor="city">City:</label>
                        <input
                            type="text"
                            name="city"
                            placeholder="City"
                            value={address.city}
                            onChange={handleAddressChange}
                            required
                        />
                        {errors.city && <p className={styles.error}>{errors.city}</p>}

                        <label htmlFor="state">State/County:</label>
                        <input
                            type="text"
                            name="state"
                            placeholder="State/County"
                            value={address.state}
                            onChange={handleAddressChange}
                            required
                        />
                        {errors.state && <p className={styles.error}>{errors.state}</p>}

                        <label htmlFor="postal_code">Postal Code:</label>
                        <input
                            type="text"
                            name="postal_code"
                            placeholder="Postal Code"
                            value={address.postal_code}
                            onChange={handleAddressChange}
                            required
                        />
                        {errors.postal_code && <p className={styles.error}>{errors.postal_code}</p>}

                        <label htmlFor="country">Country:</label>
                        <select
                            name="country"
                            value={address.country}
                            onChange={handleAddressChange}
                            required
                        >
                            <option value="">Select a country</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="United States">United States of America</option>
                        </select>
                        {errors.country && <p className={styles.error}>{errors.country}</p>}
                    </form>
                )}
            </section>

            <section className={styles.payment_form}>
                <h2>Payment Details</h2>
                <form onSubmit={handleSubmit}>
                    {clientSecret && <PaymentElement />}
                    <button type="submit" disabled={!stripe || isSubmitting} className={`${'button'} ${styles.checkout_button}`}>
                        {isSubmitting ? 'Processing...' : 'Pay Now'}
                    </button>
                    {errorMessage && <p className={styles.error}>{errorMessage}</p>}
                </form>
            </section>
        </>
    );
};

export default CheckoutForm;