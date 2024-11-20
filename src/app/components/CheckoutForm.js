'use client';

import React, { useState, useEffect } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import styles from '../styles/checkout.module.css';

// CheckoutForm handles the checkout process including address selection, form validation, and payment
const CheckoutForm = ({ cartItems, totalPrice, cartId, clientSecret }) => {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();

    // States for handling addresses, errors, and form submission
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState('new');
    const [address, setAddress] = useState({ name: '', street: '', city: '', state: '', postal_code: '', country: '' });
    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch saved addresses on component mount
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

    // Handle address dropdown selection
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

    // Handle address form input changes
    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setAddress((prevAddress) => ({ ...prevAddress, [name]: value }));
        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    };

    // Validate address form fields
    const validateAddress = () => {
        const errors = {};

        // Check required fields
        if (!address.name.trim()) errors.name = 'Full Name is required';
        if (!address.street.trim()) errors.street = 'Street Address is required';
        if (!address.city.trim()) errors.city = 'City is required';
        if (!address.state.trim()) errors.state = 'State/County is required';
        if (!address.country.trim()) errors.country = 'Country is required';

        // Validate postal codes for UK and US
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

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Save new address if necessary
    const saveAddress = async () => {
        if (selectedAddressId !== 'new') return selectedAddressId;

        if (!validateAddress()) return null;

        try {
            const response = await axios.post('http://localhost:3001/api/addresses', address, { withCredentials: true });
            return response.data.address_id;
        } catch (error) {
            console.error('Error saving address:', error);
            setErrorMessage('Failed to save address. Please try again.');
            return null;
        }
    };

    // Handle form submission for checkout
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements || !clientSecret) return;

        setIsSubmitting(true);
        const addressId = await saveAddress();
        if (!addressId) {
            setIsSubmitting(false);
            return;
        }

        try {
            const { error } = await stripe.confirmPayment({
                elements,
                confirmParams: { return_url: 'http://localhost:3000/order-confirmation' },
                redirect: 'if_required',
            });

            if (error) throw new Error(error.message);

            const response = await axios.post(
                `http://localhost:3001/api/checkout/cart/${cartId}`,
                { payment_details: 'payment_intent_id', address_id: addressId },
                { withCredentials: true }
            );

            router.push(`/order-confirmation?orderId=${response.data.order_id}`);
        } catch (err) {
            setErrorMessage('Failed to process the payment. Please try again.');
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
                            <span>{item.quantity} x ${parseFloat(item.price).toFixed(2)}</span>
                        </li>
                    ))}
                </ul>
                <h3>Total: ${totalPrice}</h3>
            </section>

            <section className={styles.address_form}>
                <h2>Shipping Address</h2>
                <label htmlFor="address-select">Choose an address:</label>
                <select id="address-select" onChange={handleAddressSelection} value={selectedAddressId}>
                    <option value="new">New Address</option>
                    {savedAddresses.map((addr) => (
                        <option key={addr.address_id} value={addr.address_id}>
                            {addr.street}, {addr.city}, {addr.state} - {addr.postal_code}
                        </option>
                    ))}
                </select>

                {selectedAddressId === 'new' && (
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="name">Full Name:</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={address.name}
                            onChange={handleAddressChange}
                        />
                        {errors.name && <p className={styles.error}>{errors.name}</p>}

                        <label htmlFor="street">Street and Number:</label>
                        <input
                            type="text"
                            name="street"
                            placeholder="Street Address"
                            value={address.street}
                            onChange={handleAddressChange}
                        />
                        {errors.street && <p className={styles.error}>{errors.street}</p>}

                        {/* Similar structure for other fields */}
                    </form>
                )}
            </section>

            <section className={styles.payment_form}>
                <h2>Payment Details</h2>
                <form onSubmit={handleSubmit}>
                    {clientSecret && <PaymentElement />}
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