'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useSelector } from "react-redux";
import Image from "next/image";
import styles from "../../styles/productDetails.module.css";
import { useCart } from "../../components/CartContext";

export default function ProductDetails() {
    const { product_id } = useParams(); // Get product ID from route
    const [product, setProduct] = useState(null); // Product details
    const [quantity, setQuantity] = useState(1); // Quantity input state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated); // Check authentication
    const router = useRouter();
    const { cartItems, fetchCart } = useCart(); // Cart context

    // Handle quantity change for input
    const handleQuantityChange = (event) => {
        const value = Math.max(1, Number(event.target.value));
        setQuantity(value);
    };

    // Add or update item in the cart
    const addToCart = async (product_id, quantity) => {
        if (!isAuthenticated) {
            router.push('/login'); // Redirect to login if not authenticated
            return;
        }

        const existingCartItem = cartItems.find(item => item.product_id === product_id); // Check if item exists in cart

        try {
            if (existingCartItem) {
                // Update quantity if item exists
                const newQuantity = existingCartItem.quantity + quantity;
                await axios.put(
                    `http://localhost:3001/api/cart/items/${existingCartItem.cart_item_id}`,
                    { quantity: newQuantity },
                    { withCredentials: true }
                );
                alert('Cart item quantity updated!');
            } else {
                // Add new item if it doesn't exist
                await axios.post(
                    'http://localhost:3001/api/cart/items',
                    { product_id, quantity },
                    { withCredentials: true }
                );
                alert('Product added to cart!');
            }
            await fetchCart(); // Refresh cart for updated item count
        } catch (error) {
            console.error('Error modifying cart:', error);
        }
    };

    // Fetch product details from the backend
    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/products/${product_id}`);
                setProduct(response.data);
            } catch (error) {
                setError('Error fetching product details');
            } finally {
                setLoading(false);
            }
        };

        if (product_id) {
            fetchProductDetails();
        }
    }, [product_id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <main className={styles.details_page}>
            {product ? (
                <div className={styles.item_container}>
                    <h1>{product.name}</h1>
                    <Image
                        src={product.image_url}
                        alt={product.name}
                        width={500}
                        height={600}
                        className={styles.product_image}
                    />
                    <div className={styles.details}>
                        <p>{product.description}</p>
                        <p><strong>Price:</strong> £{product.price}</p>
                        <p><strong>Stock:</strong> {product.stock}</p>
                        <p><strong>Category:</strong> {product.category_name}</p>
                        <p><strong>Gender:</strong> {product.gender}</p>

                        {/* Quantity input */}
                        <label>
                            <strong>Quantity:</strong>
                            <input
                                type="number"
                                min="1"
                                max="10"
                                value={quantity}
                                onChange={handleQuantityChange}
                            />
                        </label>

                        {/* Add to Cart button */}
                        <button
                            onClick={() => addToCart(product.product_id, quantity)}
                            className="button"
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            ) : (
                <p>Product not found</p>
            )}
        </main>
    );
}