'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import styles from '../styles/signup.module.css';

export default function Signup() {
    // Form state management
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Validation regex patterns
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email validation
    const phoneRegex = /^[0-9]{10,11}$/; // Phone number validation (10-11 digits)

    // Validation helper functions
    const validateEmail = (email) => emailRegex.test(email);
    const validatePhone = (phone) => phoneRegex.test(phone);

    // Handle signup form submission
    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        // Client-side validation
        if (!validateEmail(email)) {
            setError('Invalid email format.');
            setLoading(false);
            return;
        }

        if (!validatePhone(phone)) {
            setError('Phone number must be 10-11 digits.');
            setLoading(false);
            return;
        }

        try {
            // Make API call to register the user
            const response = await axios.post('http://localhost:3001/api/auth/register', {
                first_name: firstName,
                last_name: lastName,
                email,
                password,
                phone,
            });

            if (response.status === 201) {
                setSuccess('User registered successfully!');
                // Clear the form fields after successful registration
                setFirstName('');
                setLastName('');
                setEmail('');
                setPassword('');
                setPhone('');
            }
        } catch (err) {
            const errorMsg = err.response?.data.message || 'Something went wrong. Please try again.';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main>
            <div className={styles.signup_container}>
                <h1>SignUp</h1>
                <form onSubmit={handleSignup} className={styles.signup_form}>
                    {/* First Name Input */}
                    <label htmlFor="first_name">First Name:</label>
                    <input
                        type="text"
                        name="first_name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />

                    {/* Last Name Input */}
                    <label htmlFor="last_name">Last Name:</label>
                    <input
                        type="text"
                        name="last_name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />

                    {/* Email Input */}
                    <label htmlFor="email">Email:</label>
                    <input
                        type="text"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    {/* Password Input */}
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {/* Phone Number Input */}
                    <label htmlFor="phone">Phone Number:</label>
                    <input
                        type="text"
                        name="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />

                    {/* Display Error or Success Messages */}
                    {error && <p className={styles.error}>{error}</p>}
                    {success && <p className={styles.success}>{success}</p>}

                    {/* Submit Button */}
                    <button type="submit" disabled={loading}>
                        {loading ? 'Signing up...' : 'SignUp'}
                    </button>
                </form>

                {/* Link to Login Page */}
                <p className={styles.login}>
                    Already have an account? <Link href='/login'>(Login)</Link>
                </p>
            </div>
        </main>
    );
}