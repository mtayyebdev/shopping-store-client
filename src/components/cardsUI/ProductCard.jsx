import { LuHeart, LuStar } from "react-icons/lu";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function ProductCard({ product, save = true, ratings = true,classes="" }) {
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
    inStock: true
  };

  const productData = product || defaultProduct;

  const handleWishlist = (e) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
    console.log("Wishlist toggled:", productData.id);
  };

  return (
    <Link to={`/product/${productData.id}`}>
      <div className={`group bg-white ${classes} overflow-hidden`}>
        {/* Image Container */}
        <div className="relative overflow-hidden bg-gray-100">
          {/* Discount Badge */}
          {productData.discount > 0 && (
            <div className="absolute top-1.5 left-1.5 md:top-2 md:left-3 z-10">
              <span className="bg-secondary2 text-text px-1.5 py-0.5 md:px-2 md:py-1 text-[10px] md:text-xs font-bold rounded-md">
                {productData.discount}%
              </span>
            </div>
          )}

          {save && (
            <button
              onClick={handleWishlist}
              className={`p-2 rounded-full absolute top-1.5 right-1.5 md:top-2 md:right-3 z-10 transition-all duration-300 transform hover:scale-110 shadow-lg ${
                isWishlisted
                  ? "bg-secondary2 text-white"
                  : "bg-white text-gray-900 hover:bg-secondary2 hover:text-white"
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
              className={`w-full rounded h-full object-cover transform group-hover:scale-110 transition-transform duration-500 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="mt-2">
          {/* Product Name */}
          <h3 className="text-text2 font-semibold text-xs md:text-base line-clamp-2">
            {productData.name}
          </h3>

          {/* Price Section */}
          <div className="flex items-center gap-1 mt-1 md:gap-2 flex-wrap">
            <span className="text-base font-semibold text-secondary2">
              Rs.{productData.price.toLocaleString()}
            </span>
            {productData.originalPrice &&
              productData.originalPrice > productData.price && (
                <>
                  <span className="text-[10px] md:text-sm text-text1 line-through">
                    Rs.{productData.originalPrice.toLocaleString()}
                  </span>
                </>
              )}
          </div>
          {/* Badge
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
          )} */}
          {/* Rating */}
          {ratings && (
            <div className="flex items-center gap-1 mt-1">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, index) => (
                  <LuStar
                    key={index}
                    className={`w-3 h-3 md:w-4 md:h-4 ${
                      index < Math.floor(productData.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-text1"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[10px] md:text-sm text-text1">
                ({productData.rating})
              </span>
            </div>
          )}

        </div>
      </div>
    </Link>
  );
}
