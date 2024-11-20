# Crooked Clothing

Crooked Clothing is a fully responsive e-commerce web application designed to provide an intuitive shopping experience. The platform features user authentication, product filtering, cart functionality, and seamless checkout with Stripe integration.

## Features

- **Homepage**: View a hero section and popular items with infinite scrolling.
- **User Authentication**: Login, Signup, Password Reset, and Google OAuth integration.
- **Product Pages**: Separate pages for Men's and Women's clothing, with category filters.
- **Product Details**: Detailed information about each product with "Add to Cart" functionality.
- **Cart**: View, update, and remove items with live total calculations.
- **Checkout**: Address management, payment processing via Stripe, and order confirmation.
- **Profile**: View user details, addresses, and past orders.

## Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/), CSS Modules, Redux Toolkit, and Stripe Elements.
- **Backend**: Express.js, PostgreSQL (not included in this repo).
- **State Management**: Redux with `redux-persist`.
- **Payment Gateway**: Stripe API.

## Getting Started

Follow these steps to set up the project locally:

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Backend server running at `http://localhost:3001`

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/crooked-clothing.git
   cd crooked-clothing
    ```
2. Install dependencies:
    ```bash
    npm install
    ```

3. Create an .env.local file in the root directory and add the following:

4. NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your_stripe_public_key

5. Start the development server:

    ```bash
    npm run dev
    ```

    Open your browser and navigate to http://localhost:3000.

### Backend Configuration

The backend for this project is hosted in a separate repository. Follow the instructions below to set it up:

1. Clone the backend repository:
   ```bash
   git clone https://github.com/joshua-mcfield99/E-commerce_api.git
   cd E-commerce_api
   ```

2. Follow the setup instructions provided in the E-commerce_api README for detailed steps to configure the backend.

3. Ensure your backend is running on http://localhost:3001 to integrate seamlessly with the frontend.

### Features

- **User Authentication**: Login, signup, and Google OAuth integration for seamless access.
- **Dynamic Product Pages**: Browse men's and women's collections with filter options.
- **Cart Management**: Add, update, or remove items from the cart with a real-time item counter.
- **Checkout Flow**: Secure payment processing using Stripe and address validation.
- **Profile Management**: View user information, saved addresses, and order history.
- **Responsive Design**: Fully responsive layout optimized for mobile, tablet, and desktop devices.

### Tech Stack

#### Frontend:
- **Framework**: Next.js
- **State Management**: Redux with redux-persist
- **Styling**: CSS Modules
- **Payments**: Stripe.js and @stripe/react-stripe-js

#### Backend:
- **Repository**: [E-commerce API](https://github.com/joshua-mcfield99/E-commerce_api)
- **Server**: Express.js
- **Database**: PostgreSQL
- **Authentication**: Passport.js (local and Google OAuth strategies)
- **API Documentation**: Swagger

### Future Improvements

- Add more payment methods for increased flexibility.
- Implement product reviews and ratings.
- Enhance the profile page with account settings and order tracking.

### License

This project can be used by anyone however the branding is under the copyright act so permission is required to use the branding.
