import React, { useState } from "react";
import { HeroSwiper, ProductCard, CategoryCard } from "../components/index.js";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

function Home() {
  const [swiperRef, setSwiperRef] = useState(null);
  const categories = [
    {
      id: 1,
      name: "Electronics",
      image:
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&q=80",
      slug: "electronics",
    },
    {
      id: 2,
      name: "Fashion",
      image:
        "https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&q=80",
      slug: "fashion",
    },
    {
      id: 3,
      name: "Home & Living",
      image:
        "https://images.unsplash.com/photo-1556912167-f556f1f39faa?w=500&q=80",
      slug: "home-living",
    },
    {
      id: 4,
      name: "Sports",
      image:
        "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&q=80",
      slug: "sports",
    },
    {
      id: 5,
      name: "Beauty",
      image:
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&q=80",
      slug: "beauty",
    },
    {
      id: 6,
      name: "Books",
      image:
        "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500&q=80",
      slug: "books",
    },
    {
      id: 7,
      name: "Toys & Games",
      image:
        "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=500&q=80",
      slug: "toys",
    },
    {
      id: 8,
      name: "Groceries",
      image:
        "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80",
      slug: "groceries",
    },
  ];
  const featuredProducts = [
    {
      id: 1,
      name: "Premium Wireless Headphones",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
      price: 2999,
      originalPrice: 4999,
      discount: 40,
    },
    {
      id: 2,
      name: "Smart Watch Pro is very hight quality, Smart Watch Pro is very hight quality",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
      price: 5499,
      originalPrice: 7999,
      discount: 31,
    },
    {
      id: 3,
      name: "Designer Leather Bag",
      image:
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80",
      price: 3999,
      originalPrice: 6999,
      discount: 43,
    },
    {
      id: 4,
      name: "Running Shoes Elite",
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
      price: 4599,
      originalPrice: 6999,
      discount: 34,
    },
    {
      id: 5,
      name: "Digital Camera 4K",
      image:
        "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&q=80",
      price: 12999,
      originalPrice: 18999,
      discount: 32,
    },
    {
      id: 6,
      name: "Bluetooth Speaker",
      image:
        "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80",
      price: 1999,
      originalPrice: 3999,
      discount: 50,
    },
    {
      id: 7,
      name: "Laptop Backpack",
      image:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80",
      price: 1499,
      originalPrice: 2499,
      discount: 40,
    },
    {
      id: 8,
      name: "Wireless Mouse",
      image:
        "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80",
      price: 899,
      originalPrice: 1499,
      discount: 40,
    },
  ];
  const popularProducts = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    description: "High-quality sound with noise cancellation",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
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
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
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
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80",
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
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
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
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&q=80",
    price: 12999,
    originalPrice: 18999,
    discount: 32,
    rating: 4.9,
    reviews: 421,
  }
];
  return (
    <div className="">
      <HeroSwiper />

      {/* Popular products list */}
      <section className="populer-products bg-white mt-5 p-5">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">Popular Products</h2>
        <div className="flex items-center overflow-hidden flex-nowrap gap-3 md:gap-6">
          {
            popularProducts.slice(0,5).map((product)=>(
              <ProductCard save={false} product={product} key={product.id}/>
            ))
          }
        </div>
      </section>

      {/* Categories list */}
      <section className="categories bg-white mt-5 p-5">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">Categories</h2>

        <div className="grid xs-2 grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2">
          {categories.map((category) => (
            <CategoryCard category={category} />
          ))}
        </div>
      </section>

      {/* Featured products list */}
      <section className="featured bg-white mt-5 p-5">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">
          Featured Products
        </h2>

        <div className="relative">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={16}
            slidesPerView={2}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 24,
              },
              1280: {
                slidesPerView: 5,
                spaceBetween: 24,
              },
            }}
            onSwiper={setSwiperRef}
            className="featured-slider"
          >
            {featuredProducts.map((product) => (
              <SwiperSlide key={product.id}>
                <ProductCard product={product} save={false} ratings={false} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <button
            onClick={() => swiperRef?.slidePrev()}
            className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg items-center justify-center text-gray-900 hover:bg-blue-600 hover:text-white transition-all duration-300 -translate-x-5"
          >
            <LuChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => swiperRef?.slideNext()}
            className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg items-center justify-center text-gray-900 hover:bg-blue-600 hover:text-white transition-all duration-300 translate-x-5"
          >
            <LuChevronRight className="w-5 h-5" />
          </button>
        </div>
        <style>
        {`
          .swiper {
            height: 360px;
          }
          .swiper-slide{
              background-color:white;
          }
          @media (max-width:470px){
          .swiper {
            height: 240px;
          }
          }
          @media (max-width:400px){
          .swiper {
            height: 200px;
          }
          }
          `}
      </style>
      </section>
    </div>
  );
}

export default Home;
