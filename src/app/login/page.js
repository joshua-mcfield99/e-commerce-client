'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import styles from '../styles/login.module.css';
import Link from 'next/link';
import Image from 'next/image';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();

    // Handle Google OAuth login
    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:3001/api/auth/google';
    };

    // Handle login form submission
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Make POST request to backend for login
            const response = await axios.post('http://localhost:3001/api/auth/login', {
                email,
                password,
            }, { withCredentials: true });

            // Store token and redirect to profile
            localStorage.setItem('token', response.data.token);
            router.push('/profile');
        } catch (err) {
            if (err.response) {
                setError(err.response.data.message || 'Login failed');
                if (err.response.status === 404) {
                    router.push('/signup');
                }
            } else {
                setError('An error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <main>
                <div className={styles.login_container}>
                    <h1>Login</h1>
                    <form onSubmit={handleLogin}>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        {error && <p className={styles.error}>{error}</p>}
                        <button type="submit" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                    <div className={styles.google_oauth}>
                        <button onClick={handleGoogleLogin}>
                            <p>Login with Google</p>
                            <Image src='/Search_GSA.original.png' alt='google login button' width={30} height={30}/>
                        </button>
                    </div>
                    <p className={styles.signup}>
                        Don't have an account? <Link href='/signup'>(SignUp)</Link>
                    </p>
                </div>
            </main>
        </div>
    );
}