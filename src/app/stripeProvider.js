'use client';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function StripeProvider({ clientSecret, children }) {
    
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

    const options = { clientSecret, appearance };
    
    return (
        <Elements stripe={stripePromise} options={options}>
        {children}
        </Elements>
    );
}