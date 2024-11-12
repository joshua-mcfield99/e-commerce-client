'use client';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function StripeProvider({ clientSecret, children }) {
    
    const appearance = {
        theme: 'stripe', // or 'night', 'flat', or 'none'
        variables: {
            colorText: '#ffffff', // Customize text color
            fontSizeBase: '1rem', // Set base font size for inputs
            spacingUnit: '5px', // Padding around elements
            borderRadius: '5px', // Border radius for input fields
        },
        rules: {
            '.Label': {
                color: '#ffffff', // Customize label color
                fontWeight: '500', // Optional: set label font weight
            },
            '.Input': {
                fontSize: '1rem', // Set font size of input text
                padding: '5px', // Apply padding to inputs
                borderRadius: '5px', // Apply border radius to inputs
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