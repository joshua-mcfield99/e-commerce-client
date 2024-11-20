'use client';

// Import Stripe.js integration components
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with the public key from environment variables
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

// Provides Stripe Elements with custom appearance and configuration options
export default function StripeProvider({ clientSecret, children }) {
    // Define custom appearance settings for Stripe Elements
    const appearance = {
        theme: 'stripe',
        variables: {
            colorText: '#000',
            fontSizeBase: '1rem',
            spacingUnit: '5px',
            borderRadius: '5px',
        },
        rules: {
            '.Label': {
                color: '#ffffff',
            },
            '.Input': {
                fontSize: '1rem',
                padding: '5px',
                borderRadius: '5px',
            },
        },
    };

    // Combine client secret and appearance settings into options
    const options = { clientSecret, appearance };

    return (
        <Elements stripe={stripePromise} options={options}>
            {children}
        </Elements>
    );
}