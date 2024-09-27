'use client'
import { useState } from 'react';

export default function Mens() {
    /*const [category, setCategory] = useState('all');
    
    // Filter products based on category
    const filteredProducts = products.filter(product => 
        category === 'all' ? true : product.category === category
    );
    */
    return (
        <div>
            <h1>Men&#39;s Clothing</h1>

            {/* Category Filters */}
            <div className="filter-bar">
                <button >All</button>{/*onClick={() => setCategory('all')} */}
                <button >Hoodies</button>{/*onClick={() => setCategory('hoodie')} */}
                <button >T-shirts</button>{/*onClick={() => setCategory('tshirt')} */}
                <button >Jumpers</button>{/*onClick={() => setCategory('jumper')} */}
            </div>

            {/* Display products */}
            <div className="product-grid">
                {/*filteredProducts.map(product => (
                    <ProductItem key={product.id} product={product} />
                ))*/}
            </div>
        </div>
        );
    }