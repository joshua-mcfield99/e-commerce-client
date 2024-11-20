'use client';

import Product from './Product';
import styles from '../styles/productList.module.css';

// Renders a list of products using the Product component
export default function ProductList({ products }) {
    return (
        <div className={styles.product_list}>
            {products.map(product => (
                <Product 
                    key={product.product_id} 
                    product={product} 
                />
            ))}
        </div>
    );
}