import React, { useState } from 'react'
import {
    LuHeart,
    LuArrowLeft
} from "react-icons/lu";
import { useOutletContext } from 'react-router-dom'
import { ProductCard } from '../../components/index.js';

function Wishlist() {
    const { setIsSidebarOpen } = useOutletContext()
    const [wishlist] = useState([
        {
            id: 1,
            name: "Premium Wireless Headphones",
            description: "High-quality sound with noise cancellation",
            image:
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
            price: 2999,
            originalPrice: 4999,
            discount: 40,
            rating: 4.5,
            reviews: 128,
        },
        {
            id: 2,
            name: "Smart Watch Pro Series",
            description: "Track your fitness and stay connected",
            image:
                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
            price: 5499,
            originalPrice: 7999,
            discount: 31,
            rating: 4.6,
            reviews: 189,
        },
        {
            id: 3,
            name: "Designer Leather Bag",
            description: "Elegant and spacious leather handbag",
            image:
                "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80",
            price: 3999,
            originalPrice: 6999,
            discount: 43,
            rating: 4.9,
            reviews: 342,
        },
        {
            id: 4,
            name: "Running Shoes Elite",
            description: "Comfortable running shoes for athletes",
            image:
                "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
            price: 4599,
            originalPrice: 6999,
            discount: 34,
            rating: 4.7,
            reviews: 198,
        },
        {
            id: 5,
            name: "Digital Camera 4K",
            description: "Professional photography camera",
            image:
                "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&q=80",
            price: 12999,
            originalPrice: 18999,
            discount: 32,
            rating: 4.9,
            reviews: 421,
        },
    ]);
    return (
        <div>
            <div className="flex items-center gap-3 mb-6">
                <LuArrowLeft size={24} onClick={() => setIsSidebarOpen(true)} className='lg:hidden' />
                <h2 className="text-2xl font-bold text-gray-900">My Wishlist ({wishlist.length} items) </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 2xl:grid-cols-5 gap-4 bg-primary p-4">
                {wishlist.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}

export default Wishlist