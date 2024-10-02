'use client'
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import styles from "../../styles/productDetails.module.css";

export default function ProductDetails() {
    const { product_id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch product details from the backend using the product id
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
                        <button>Add to Cart</button>
                    </div>
                </div>
            ) : (
                <p>Product not found</p>
            )}
        </main>
    )
};