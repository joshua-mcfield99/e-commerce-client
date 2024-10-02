'use client';
import { useState, useEffect } from 'react';
import ProductList from '../components/ProductList';
import axios from 'axios';
import styles from '../styles/productPage.module.css';

export default function Womens() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [category, setCategory] = useState('all');

    useEffect(() => {
        // Fetch products from the backend
        async function fetchProducts() {
            try {
                const response = await axios.get('http://localhost:3001/api/products');
                // Filter products for men's and unisex clothing
                const mensProducts = response.data.filter(product => 
                    product.gender === 'women' || product.gender === 'unisex'
                );
                setProducts(mensProducts);
                setFilteredProducts(mensProducts);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        }

        fetchProducts();
    }, []);

    // Filter products based on category
    const handleCategoryChange = (selectedCategory) => {
        setCategory(selectedCategory);
        const filtered = selectedCategory === 'all'
            ? products
            : products.filter(product => product.category_name.toLowerCase() === selectedCategory);
        setFilteredProducts(filtered);
    };

    return (
        <main>
            <h1>Women&#39;s Clothing</h1>

            {/* Category Filters */}
            <div className="filter-bar">
                <button onClick={() => handleCategoryChange('all')}>All</button>
                <button onClick={() => handleCategoryChange('hoodie')}>Hoodies</button>
                <button onClick={() => handleCategoryChange('t-shirt')}>T-shirts</button>
                <button onClick={() => handleCategoryChange('jumper')}>Jumpers</button>
            </div>

            {/* Display products */}
            <div className="product-grid">
                <ProductList products={filteredProducts} />
            </div>
        </main>
    );
}