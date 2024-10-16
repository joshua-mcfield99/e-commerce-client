'use client';

import { useSelector, useDispatch } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import axios from 'axios';
import { login } from '../store/authSlice';

const ProfilePage = () => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const dispatch = useDispatch();  // Dispatch Redux actions
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Fetch user session details after redirect from OAuth login
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/auth/user', { withCredentials: true });
                if (response.status === 200 && response.data.user) {
                    // Dispatch login action to store user in Redux
                    dispatch(login(response.data.user));
                }
            } catch (err) {
                console.error('Error fetching user data:', err);
                router.push('/login');  // Redirect to login if there's an error
            }
        };

        if (!isAuthenticated) {
            fetchUserData();
        }
    }, [isAuthenticated, router, dispatch]);

    useEffect(() => {
        const passwordReset = searchParams.get('passwordReset');
        if (passwordReset) {
            alert('Please check your email for a password reset link.');
        }
    }, [searchParams]);

    return isAuthenticated ? (
        <main>
            <h1>Welcome to your profile</h1>
        </main>
    ) : null;
};

export default ProfilePage;