'use client';

// Import necessary modules and components
import { useState, useEffect } from 'react';
import ProductList from '../components/ProductList';
import axios from 'axios';
import styles from '../styles/productPage.module.css';

export default function Mens() {
    // State for storing all products, filtered products, and the selected category
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [category, setCategory] = useState('all');

    // Fetch products from the backend on component mount
    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await axios.get('http://localhost:3001/api/products');
                
                // Filter products to include only men's and unisex clothing
                const mensProducts = response.data.filter(product => 
                    product.gender === 'men' || product.gender === 'unisex'
                );

                setProducts(mensProducts);
                setFilteredProducts(mensProducts);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        }

        fetchProducts();
    }, []);

    // Handle category changes and filter products accordingly
    const handleCategoryChange = (selectedCategory) => {
        setCategory(selectedCategory);

        const filtered = selectedCategory === 'all'
            ? products
            : products.filter(product => product.category_name.toLowerCase() === selectedCategory);

        setFilteredProducts(filtered);
    };

    return (
        <main className={`${styles.product_page}`}>
            <h1>Men&#39;s Clothing</h1>

            {/* Category Filter Buttons */}
            <div className={`${styles.filter_bar}`}>
                <button onClick={() => handleCategoryChange('all')}>All</button>
                <button onClick={() => handleCategoryChange('hoodie')}>Hoodies</button>
                <button onClick={() => handleCategoryChange('t-shirt')}>T-shirts</button>
                <button onClick={() => handleCategoryChange('jumper')}>Jumpers</button>
            </div>

            {/* Display Filtered Products */}
            <div className={`${styles.product_grid}`}>
                <ProductList products={filteredProducts} />
            </div>
        </main>
    );
}