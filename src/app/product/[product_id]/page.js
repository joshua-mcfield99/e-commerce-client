'use client'
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useSelector } from "react-redux";
import Image from "next/image";
import styles from "../../styles/productDetails.module.css";

export default function ProductDetails() {
    const { product_id } = useParams(); // This is the product_id from the URL
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const router = useRouter();

    const addToCart = async (product_id, quantity) => {
        if (!isAuthenticated) {
            router.push('/login'); // Redirect to login if not authenticated
            return;
        }

        try {
            // Make sure you're passing the correct product_id and quantity
            const response = await axios.post(
                'http://localhost:3001/api/cart/items',
                { product_id, quantity }, // product_id is taken from product fetched
                {
                    withCredentials: true, // Ensure session info is included
                }
            );
            alert('Product added to cart!');
            return response.data;
        } catch (error) {
            console.error('Error adding item to cart:', error);
            throw error;
        }
    };

    useEffect(() => {
        // Fetch product details from the backend using the product id from the URL
        async function fetchProductDetails() {
            try {
                const response = await axios.get(`http://localhost:3001/api/products/${product_id}`);
                setProduct(response.data); // Store product details in state
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

    console.log(product);
    return (
        <main>
            {product ? (
                <div>
                    <Image
                        src={product.image_url}
                        alt={product.name}
                        width={500}
                        height={600}
                        className={`${styles.product_image}`}
                    />
                    <div>
                        <h1>{product.name}</h1>
                        <p>{product.description}</p>
                        <p><strong>Price:</strong> £{product.price}</p>
                        <p><strong>Stock:</strong> {product.stock}</p>
                        <p><strong>Category:</strong> {product.category_name}</p>
                        <p><strong>Gender:</strong> {product.gender}</p>
                        {/* Add to Cart uses product.product_id */}
                        <button onClick={() => addToCart(product.product_id, 1)}>Add to Cart</button>
                    </div>
                </div>
            ) : (
                <p>Product not found</p>
            )}
        </main>
    )
};