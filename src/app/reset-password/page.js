'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import styles from '../styles/reset.module.css';

export default function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();

    const token = searchParams.get('token'); // Extract the token from the query parameters

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        // Client-side validation
        if (password !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        if (password.length < 6) {
            setError("Password should be at least 6 characters long");
            return;
        }

        setLoading(true);

        try {
            // API request to reset the password
            const response = await axios.post('http://localhost:3001/api/auth/reset-password', {
                token,
                password,
            });

            if (response.status === 200) {
                setSuccess('Password reset successfully!');

                // Redirect after successful reset
                const redirectTo = response.data.redirect || '/login';
                setTimeout(() => router.push(redirectTo), 3000); // Redirect after 3 seconds
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Something went wrong. Please try again.';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className={styles.reset_pass_container}>
            <h1>Reset Password</h1>
            <form onSubmit={handleSubmit} className={styles.reset_form}>
                <div className={styles.input_group}>
                    <label htmlFor="password">New Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        aria-label="New Password"
                    />
                </div>

                <div className={styles.input_group}>
                    <label htmlFor="confirmPassword">Confirm New Password:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        aria-label="Confirm New Password"
                    />
                </div>

                {error && <p className={styles.error_msg}>{error}</p>}
                {success && <p className={styles.success_msg}>{success}</p>}

                <button type="submit" disabled={loading} className={styles.reset_btn}>
                    {loading ? 'Resetting...' : 'Reset Password'}
                </button>
            </form>
        </main>
    );
}