'use client'
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useSelector } from "react-redux";
import Image from "next/image";
import styles from "../../styles/productDetails.module.css";
import { useCart } from "../../components/CartContext"; 

export default function ProductDetails() {
    const { product_id } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1); // Quantity input state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const router = useRouter();
    const { cartItems, fetchCart } = useCart();

    const handleQuantityChange = (event) => {
        const value = Math.max(1, Number(event.target.value));
        setQuantity(value);
    };

    const addToCart = async (product_id, quantity) => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        // Check if item is already in the cart
        const existingCartItem = cartItems.find(item => item.product_id === product_id);

        if (existingCartItem) {
            // If item exists, update the quantity
            const newQuantity = existingCartItem.quantity + quantity;
            try {
                await axios.put(
                    `http://localhost:3001/api/cart/items/${existingCartItem.cart_item_id}`,
                    { quantity: newQuantity },
                    { withCredentials: true }
                );
                alert('Cart item quantity updated!');
                await fetchCart(); // Refresh the cart to update the count in the NavBar
            } catch (error) {
                console.error('Error updating item quantity:', error);
            }
        } else {
            // If item does not exist, add a new item
            try {
                await axios.post(
                    'http://localhost:3001/api/cart/items',
                    { product_id, quantity },
                    { withCredentials: true }
                );
                alert('Product added to cart!');
                await fetchCart(); // Refresh the cart to update the count in the NavBar
            } catch (error) {
                console.error('Error adding item to cart:', error);
            }
        }
    };

    useEffect(() => {
        async function fetchProductDetails() {
            try {
                const response = await axios.get(`http://localhost:3001/api/products/${product_id}`);
                setProduct(response.data);
            } catch (error) {
                setError('Error fetching product details');
            } finally {
                setLoading(false);
            }
        }
        if (product_id) {
            fetchProductDetails();
        }
    }, [product_id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <main className={`${styles.details_page}`}>
            {product ? (
                <div className={`${styles.item_container}`}>
                    <h1>{product.name}</h1>
                    <Image
                        src={product.image_url}
                        alt={product.name}
                        width={500}
                        height={600}
                        className={`${styles.product_image}`}
                    />
                    <div className={`${styles.details}`}>
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
                        <button onClick={() => addToCart(product.product_id, quantity)} className={`${'button'}`}>Add to Cart</button>
                    </div>
                </div>
            ) : (
                <p>Product not found</p>
            )}
        </main>
    )
};