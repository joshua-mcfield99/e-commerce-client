'use client'
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { login } from '../store/authSlice';
import styles from '../styles/profile.module.css'

const ProfilePage = () => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [addresses, setAddresses] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch user session details after redirect from OAuth login
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/auth/user', { withCredentials: true });
                if (response.status === 200 && response.data.user) {
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

    // Fetch user profile data, including addresses and orders
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/users/profile', { withCredentials: true });
                const { user, addresses, orders } = response.data;

                // Update user in Redux store if necessary
                if (user) {
                    dispatch(login(user));
                }
                setAddresses(addresses || []);
                setOrders(orders || []);
            } catch (err) {
                console.error('Error fetching profile data:', err);
                router.push('/login'); // Redirect to login if unauthorized
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchProfileData();
        }
    }, [isAuthenticated, dispatch, router]);

    if (!isAuthenticated) return null;
    if (loading) return <p>Loading...</p>;

    return (
        <main className={`${styles.profile_page}`}>
            <h1>{user && user.first_name} {user && user.last_name}&#39;s Profile</h1>
            <div className={`${styles.info_container}`}>
                <h2>User Info</h2>
                <p>First Name: {user && user.first_name}</p>
                <p>Last Name: {user && user.last_name}</p>
                <p>Email: {user && user.email}</p>
            </div>
            <div className={`${styles.info_container}`}>
                <h2>Addresses</h2>
                {addresses.length > 0 ? (
                    <ul>
                        {addresses.map((address) => (
                            <li key={address.address_id}>
                                <p>Name: {address.name},</p> 
                                <p>Street: {address.street},</p> 
                                <p>City: {address.city},</p> 
                                <p>County: {address.state},</p> 
                                <p>Country: {address.country},</p> 
                                <p>Postcode: {address.postal_code}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No addresses found.</p>
                )}
            </div>
            <div className={`${styles.info_container}`}>
                <h2>Orders</h2>
                {orders.length > 0 ? (
                <ul>
                    {orders.map((order, index) => (
                        <li key={order.order_id}>
                            {/* Incremental Order Number */}
                            <p><strong>Order #:</strong> {index + 1}</p>

                            {/* Order Date */}
                            <p><strong>Order Date:</strong> {new Date(order.order_date).toLocaleDateString()}</p>

                            {/* Total Price */}
                            <p><strong>Total Price:</strong> ${order.total_price}</p>
                            
                            {/* Payment Status */}
                            <p><strong>Payment Status:</strong> {order.payment_status}</p>

                            {/* Products */}
                            <p><strong>Products:</strong></p>
                            <ul>
                                {order.items.map((item) => (
                                    <li key={item.order_items_id}>
                                        <p>{item.product_name} - {item.quantity} x ${item.price}</p>
                                    </li>
                                ))}
                            </ul>
                                
                        </li>
                    ))}
                </ul>
                ) : (
                    <p>No orders found.</p>
                )}
            </div>
        </main>
    );
};

export default ProfilePage;