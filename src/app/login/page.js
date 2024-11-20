'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice'; // Redux login action
import styles from '../styles/login.module.css';
import Link from 'next/link';
import Image from 'next/image';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();
    const dispatch = useDispatch();

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
            const response = await axios.post(
                'http://localhost:3001/api/auth/login',
                { email, password },
                { withCredentials: true } // Include cookies for session
            );

            if (response.status === 200) {
                dispatch(login(response.data.user)); // Store user data in Redux
                router.push('/profile'); // Redirect to profile
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <main>
                <div className={styles.login_container}>
                    <h1>Login</h1>
                    <form onSubmit={handleLogin} className='form'>
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

                        <p className={`${styles.forgot_pass}`}>
                            Forgot password? <Link href='/forgot-password'>(Click me)</Link>
                        </p>

                        {error && <p className={styles.error}>{error}</p>}
                        
                        <button type="submit" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>

                        <div className={styles.google_oauth}>
                            <button onClick={handleGoogleLogin}>
                                <p>Login with Google</p>
                                <Image
                                    src='/Search_GSA.original.png'
                                    alt='Google login button'
                                    width={30}
                                    height={30}
                                />
                            </button>
                        </div>

                        <p className={styles.signup}>
                            Don&#39;t have an account? <Link href='/signup'>(SignUp)</Link>
                        </p>
                    </form>
                </div>
            </main>
        </div>
    );
}