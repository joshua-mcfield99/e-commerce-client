'use client';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function Profile() {
    const searchParams = useSearchParams();
    const passwordReset = searchParams.get('passwordReset');

    useEffect(() => {
        if (passwordReset === 'true') {
            alert('Check your email for a password reset link!');
        }
    }, [passwordReset]);

    return (
        <div>
            <h1>Profile Page</h1>
            {/* Additional profile content */}
        </div>
    );
}