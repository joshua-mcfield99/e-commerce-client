'use client';

import { useState } from 'react';
import axios from 'axios';
import styles from '../styles/forgot-password.module.css';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Handle password reset request
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await axios.post('http://localhost:3001/api/auth/password-reset-request', { email });
            setMessage('If the email exists, a reset link will be sent shortly.');
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className={`${styles.forgot_password_container}`}>
            <h1>Forgot Password</h1>
            <form onSubmit={handleSubmit} className='form'>
                <label htmlFor="email">Enter your email address:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                {message && <p className={styles.success}>{message}</p>}
                {error && <p className={styles.error}>{error}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? 'Submitting...' : 'Send Reset Link'}
                </button>
            </form>
        </main>
    );
}