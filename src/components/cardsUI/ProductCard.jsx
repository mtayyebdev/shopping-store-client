import { LuHeart, LuStar } from "react-icons/lu";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function ProductCard({ product, save = true, ratings = true }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Default product data for demo
  const defaultProduct = {
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
    inStock: true,
    badge: "Best Seller", // Can be "New", "Hot", "Sale", "Best Seller", etc.
  };

  const productData = product || defaultProduct;

  const handleWishlist = (e) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
    console.log("Wishlist toggled:", productData.id);
  };

  return (
    <Link to={`/product/${productData.id}`}>
      <div className="group bg-white rounded-lg shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2">
        {/* Image Container */}
        <div className="relative overflow-hidden bg-gray-100">
          {/* Discount Badge */}
          {productData.discount > 0 && (
            <div className="absolute top-1.5 right-1.5 md:top-3 md:right-3 z-10">
              <span className="bg-green-600 text-white px-1.5 py-0.5 md:px-2 md:py-1 text-[10px] md:text-xs font-bold rounded-md">
                {productData.discount}% OFF
              </span>
            </div>
          )}

          {save && (
            <button
              onClick={handleWishlist}
              className={`p-2 md:p-3 rounded-full absolute top-8 right-1.5 md:top-11 md:right-3 z-10 transition-all duration-300 transform hover:scale-110 shadow-lg ${
                isWishlisted
                  ? "bg-red-600 text-white"
                  : "bg-white text-gray-900 hover:bg-red-600 hover:text-white"
              }`}
              title="Add to Wishlist"
            >
              <LuHeart
                className={`w-4 h-4 md:w-5 md:h-5 ${
                  isWishlisted ? "fill-current" : ""
                }`}
              />
            </button>
          )}

          {/* Product Image */}
          <div className="aspect-square relative">
            {!imageLoaded && (
              <div className="absolute inset-0 animate-pulse bg-gray-200"></div>
            )}
            <img
              src={productData.image}
              alt={productData.name}
              onLoad={() => setImageLoaded(true)}
              className={`w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="p-2 md:p-4">
          {/* Rating */}
          {ratings && (
            <div className="flex items-center gap-1 mb-1 md:mb-2">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, index) => (
                  <LuStar
                    key={index}
                    className={`w-3 h-3 md:w-4 md:h-4 ${
                      index < Math.floor(productData.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[10px] md:text-sm text-gray-600">
                {productData.rating}
              </span>
            </div>
          )}

          {/* Product Name */}
          <h3 className="text-gray-900 font-semibold text-xs md:text-base mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
            {productData.name}
          </h3>

          {/* Price Section */}
          <div className="flex items-center gap-1 md:gap-2 flex-wrap">
            <span className="text-base md:text-2xl font-bold text-gray-900">
              ₹{productData.price.toLocaleString()}
            </span>
            {productData.originalPrice &&
              productData.originalPrice > productData.price && (
                <>
                  <span className="text-[10px] md:text-sm text-gray-400 line-through">
                    ₹{productData.originalPrice.toLocaleString()}
                  </span>
                </>
              )}
          </div>
          {/* Badge */}
          {productData?.badge && (
            <div className="mt-1">
              <span
                className={`px-2 py-0.5 md:px-3 md:py-1 text-[10px] md:text-xs font-bold rounded-full ${
                  productData.badge === "New"
                    ? "bg-blue-600 text-white"
                    : productData.badge === "Hot"
                    ? "bg-red-600 text-white"
                    : productData.badge === "Sale"
                    ? "bg-orange-600 text-white"
                    : "bg-purple-600 text-white"
                }`}
              >
                {productData.badge}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
