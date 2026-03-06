import React from 'react'
import {
    LuArrowLeft
} from "react-icons/lu";
import { useOutletContext } from 'react-router-dom'
import { ProductCard } from '../../components/index.js';
import { useSelector } from 'react-redux';

function Wishlist() {
    const { setIsSidebarOpen } = useOutletContext();
    const { wishlist } = useSelector((state) => state.wishlistSlice)
    return (
        <div>
            <div className="flex items-center gap-3 mb-6">
                <LuArrowLeft size={24} onClick={() => setIsSidebarOpen(true)} className='lg:hidden' />
                <h2 className="text-2xl font-bold text-gray-900">My Wishlist ({wishlist.length} items) </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 2xl:grid-cols-5 gap-4 bg-primary p-4">
                {wishlist.map((product) => (
                    <ProductCard key={product._id} product={product.productId} isWishlistProduct={true} isWishlistPage={true} />
                ))}
            </div>
        </div>
    );
}

export default Wishlist