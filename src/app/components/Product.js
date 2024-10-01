'use client';
import Image from 'next/image';
import styles from '../styles/product.module.css';

export default function Product({ product }) {
    return (
        <div className={styles.product}>
            <Image 
                src={product.image_url} 
                alt={product.name} 
                width={250} 
                height={300}
                className={styles.product_image}
            />
            <h2 className={styles.product_name}>{product.name}</h2>
            <p className={styles.product_description}>{product.description}</p>
        </div>
    );
}