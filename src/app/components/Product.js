'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/product.module.css';

// Represents an individual product card with a link to the product details page
export default function Product({ product }) {
    return (
        <div className={styles.product}>
            <Link href={`/product/${product.product_id}`} passHref>
                <div className={styles.product_link}>
                    <Image 
                        src={product.image_url} 
                        alt={product.name} 
                        width={250} 
                        height={300}
                        className={styles.product_image}
                    />
                    <h2 className={styles.product_name}>
                        {product.name}
                    </h2>
                    <p className={styles.product_description}>
                        {product.description}
                    </p>
                </div>
            </Link>
        </div>
    );
}