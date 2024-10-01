'use client'
import { useState } from 'react';
import ProductList from '../components/ProductList';

// Sample data (replace with data from your backend)
const womensProducts = [
    {
        id: 1,
        name: 'Women\'s Hoodie',
        description: 'A baggy hoodie for those sofa days.',
        imageUrl: '/Hoodie_Black.png'
    },
    {
        id: 2,
        name: 'Women\'s T-shirt',
        description: 'A stylish T-shirt for sunny days.',
        imageUrl: '/T-shirt_black.png'
    }
];

export default function WomensPage() {
    /*const [category, setCategory] = useState('all');
    
    // Filter products based on category
    const filteredProducts = products.filter(product => 
        category === 'all' ? true : product.category === category
    );*/
    
    return (
        <div>
            <h1>Women&#39;s Clothing</h1>

            {/* Category Filters */}
            <div className="filter-bar">
                <button >All</button>{/*onClick={() => setCategory('all')} */}
                <button >Hoodies</button>{/*onClick={() => setCategory('hoodie')} */}
                <button >T-shirts</button>{/*onClick={() => setCategory('tshirt')} */}
                <button >Jumpers</button>{/*onClick={() => setCategory('jumper')} */}
            </div>

            {/* Display products */}
            <div className="product-grid">
                <ProductList products={womensProducts} />
            </div>
        </div>
    );
}