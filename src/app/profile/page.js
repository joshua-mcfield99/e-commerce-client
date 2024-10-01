'use client';

import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const ProfilePage = () => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const router = useRouter();
    
    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');  // Redirect to login if not authenticated
        }
    }, [isAuthenticated, router]);
    
    return isAuthenticated ? (
        <main>
            <h1>Welcome to your profile</h1>
        </main>
    ) : null;
};

export default ProfilePage;