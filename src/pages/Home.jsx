import React, { useState } from "react";
import {
  HeroSwiper,
  ProductCard,
  CategoryCard,
  Heading,
  ProductBaner,
  Button,
} from "../components/index.js";
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

  const popularProducts = [
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
  ];

  const topRatedProducts = [
    {
      id: 1,
      name: "Sony WH-1000XM5 Wireless Headphones",
      description: "Industry-leading noise cancellation headphones",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
      price: 29990,
      originalPrice: 34990,
      discount: 14,
      rating: 4.9,
      reviews: 2847,
    },
    {
      id: 2,
      name: "Apple iPhone 15 Pro Max",
      image:
        "https://images.unsplash.com/photo-1678652197831-2d180705cd2c?w=500&q=80",
      description: "Latest flagship with A17 Pro chip",
      price: 134900,
      originalPrice: 149900,
      discount: 10,
      rating: 4.8,
      reviews: 3521,
    },
    {
      id: 3,
      name: 'Samsung 55" 4K Smart TV',
      description: "Crystal UHD with HDR support",
      image:
        "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=500&q=80",
      price: 47999,
      originalPrice: 64999,
      discount: 26,
      rating: 4.7,
      reviews: 1896,
    },
    {
      id: 4,
      name: "MacBook Air M3",
      description: "13-inch with Apple M3 chip",
      image:
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
      price: 114900,
      originalPrice: 134900,
      discount: 15,
      rating: 4.9,
      reviews: 2134,
    },
    {
      id: 5,
      name: "Bose SoundLink Revolve+",
      description: "Portable Bluetooth speaker with 360° sound",
      image:
        "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80",
      price: 24990,
      originalPrice: 32990,
      discount: 24,
      rating: 4.8,
      reviews: 1567,
    },
    {
      id: 6,
      name: "Canon EOS R6 Mark II",
      description: "Professional mirrorless camera",
      image:
        "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&q=80",
      price: 219999,
      originalPrice: 249999,
      discount: 12,
      rating: 4.9,
      reviews: 892,
    },
    {
      id: 7,
      name: "Dyson V15 Detect Vacuum",
      description: "Cordless vacuum with laser detection",
      image:
        "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500&q=80",
      price: 59990,
      originalPrice: 69990,
      discount: 14,
      rating: 4.8,
      reviews: 1234,
    },
    {
      id: 8,
      name: "Nike Air Zoom Pegasus 40",
      description: "Premium running shoes for athletes",
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
      price: 10995,
      originalPrice: 12995,
      discount: 15,
      rating: 4.7,
      reviews: 3421,
    },
    {
      id: 9,
      name: "PlayStation 5 Slim",
      description: "Next-gen gaming console",
      image:
        "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&q=80",
      price: 54990,
      originalPrice: 59990,
      discount: 8,
      rating: 4.9,
      reviews: 4567,
    },
    {
      id: 10,
      name: "Kindle Paperwhite Signature",
      description: "Waterproof e-reader with auto-adjusting light",
      image:
        "https://images.unsplash.com/photo-1592656094267-764a45160876?w=500&q=80",
      price: 17999,
      originalPrice: 19999,
      discount: 10,
      rating: 4.8,
      reviews: 2890,
    },
    {
      id: 11,
      name: "Logitech MX Master 3S",
      description: "Ergonomic wireless mouse for professionals",
      image:
        "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80",
      price: 8995,
      originalPrice: 10995,
      discount: 18,
      rating: 4.7,
      reviews: 1678,
    },
    {
      id: 12,
      name: "Apple Watch Series 9",
      description: "Advanced health and fitness tracking",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
      price: 41900,
      originalPrice: 45900,
      discount: 9,
      rating: 4.8,
      reviews: 3102,
    },
  ];

  return (
    <div className="">
      <HeroSwiper />

      {/* Popular products list */}
      <section className="populer-products bg-white my-5 p-5">
        <Heading title={"Today's"} />
        <h2 className="text-xl sm:text-3xl mt-4 font-bold mb-4">
          Popular Products
        </h2>
        <div className="flex items-center overflow-x-auto flex-nowrap gap-3 md:gap-6">
          {popularProducts.slice(0, 6).map((product) => (
            <ProductCard
              save={true}
              product={product}
              key={product.id}
              classes="shrink-0 w-[110px] h-[200px] sm:w-[150px] sm:h-[240px] md:w-[200px] md:h-[340px] lg:w-[230px] lg:h-[370px]"
            />
          ))}
        </div>
      </section>

      {/* Categories list */}
      <section className="categories bg-white relative my-5 p-5">
        <Heading title={"Categories"} />
        <h2 className="text-xl sm:text-3xl mt-4 font-bold">
          Browse By Category
        </h2>
        <div className="mt-5 relative">
          <Swiper
            modules={[Navigation]}
            spaceBetween={9}
            slidesPerView={2}
            navigation={true}
            breakpoints={{
              380: {
                slidesPerView: 3,
                spaceBetween: 10,
              },
              640: {
                slidesPerView: 4,
                spaceBetween: 14,
              },
              1024: {
                slidesPerView: 5,
                spaceBetween: 15,
              },
              1280: {
                slidesPerView: 6,
                spaceBetween: 15,
              },
            }}
            onSwiper={setSwiperRef}
            className="category-slider"
          >
            {categories.map((category) => (
              <SwiperSlide key={category.id}>
                <CategoryCard category={category} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <style>
          {`
        .category-slider .swiper-button-next,
        .category-slider .swiper-button-prev {
          background-color: #f5f5f5;
          height: 60px !important;
          width: 40px !important;
          top: 40% !important;
          border-radius: 5px !important;
        }
        .category-slider .swiper-button-next {
          right: -5px !important;
        }
        .category-slider .swiper-button-prev {
          left: -5px !important;
        }
        .category-slider .swiper-button-next .swiper-navigation-icon,
        .category-slider .swiper-button-prev .swiper-navigation-icon {
          fill: gray !important;
          height: 20px !important;
          width: 20px !important;
          color: black !important;
        }
        @media (max-width:521px){
          .category-slider .swiper-button-next,
          .category-slider .swiper-button-prev{
            height: 50px !important;
            width: 30px !important;
            top: 40% !important;
          }
        }
        @media (max-width:440px){
        .category-slider .swiper-button-next,
        .category-slider .swiper-button-prev{
            top: 30% !important;
          }
        }
        @media (max-width:380px){
        .category-slider .swiper-button-next,
        .category-slider .swiper-button-prev{
            top: 40% !important;
          }
        }
        `}
        </style>
      </section>

      <ProductBaner
        image="/laptop.png"
        link="/shop"
        title="Enhance Your Music Experience"
        expiresIn="2025-12-22T02:10:40"
      />

      {/* Top Rated / best selling product */}
      <section className="top-rated bg-white my-5 p-5">
        <Heading title={"This Month"} />
        <div className="relative">
          <h2 className="text-xl sm:text-3xl font-bold mt-4">
            Best Selling Products
          </h2>
          <div className="mt-4">
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={15}
              slidesPerView={2}
              loop={true}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              breakpoints={{
                640: {
                  slidesPerView: 3,
                },
                800: {
                  slidesPerView: 4,
                },
                1180: {
                  slidesPerView: 5,
                },
              }}
              onSwiper={setSwiperRef}
              className="toprated-slider"
            >
              {topRatedProducts.map((product) => (
                <SwiperSlide key={product.id}>
                  <ProductCard product={product} />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Navigation Buttons */}
            <button
              onClick={() => swiperRef?.slidePrev()}
              className="hidden sm:flex absolute right-10 top-[4%] -translate-y-1/2 z-10 w-10 h-10 bg-secondary rounded-full items-center justify-center text-gray-900 hover:bg-secondary2 hover:text-white transition-all duration-300 -translate-x-5"
            >
              <LuChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => swiperRef?.slideNext()}
              className="hidden sm:flex absolute right-5 top-[4%] -translate-y-1/2 z-10 w-10 h-10 bg-secondary rounded-full items-center justify-center text-gray-900 hover:bg-secondary2 hover:text-white transition-all duration-300 translate-x-5"
            >
              <LuChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        <style>
          {`
          .toprated-slider {
            height: 400px;
          }
          .toprated-slider .swiper-slide{
              background-color:white;
          }
          @media (max-width:1300px){
          .toprated-slider {
            height: 350px;
          }
          }
          @media (max-width:1000px){
          .toprated-slider {
            height: 330px;
          }
          }
          
          @media (max-width:470px){
          .toprated-slider {
            height: 260px;
          }
          }
          @media (max-width:400px){
          .toprated-slider {
            height: 240px;
          }
          }
          `}
        </style>
      </section>

      {/* Featured products list */}
      <section className="featured bg-white my-5 p-5">
        <Heading title={"Featured"} />
        <h2 className="text-2xl sm:text-3xl font-bold mt-4">New Arrival</h2>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 sm:gap-5 mt-4">
          {/* LEFT - 1 column */}
          <div className="relative w-full lg:col-span-2 bg-btn h-[250px] lg:h-[600px] flex items-center justify-center p-2 md:p-5">
            <img src="/laptop.png" className="w-[300px] lg:w-[90%]" alt="laptop" />

            <div className="absolute bottom-0 left-0 p-5 text-primary">
              <h3 className="text-2xl font-semibold">
                Latest Laptops For Gaming
              </h3>
              <p className="text-sm mt-2 mb-2">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </p>
              <Link to="/shop" className="underline hover:text-btn1">
                Shop Now
              </Link>
            </div>
          </div>

          {/* RIGHT - 2 columns */}
          <div className="grid grid-cols-1 gap-3 sm:gap-5 lg:col-span-3">
            <div className="relative bg-btn h-[250px] md:h-[290px] flex items-center p-2 md:p-5 justify-end">
              <img src="/laptop.png" className="w-[300px] md:h-[200px]" alt="laptop" />

              <div className="absolute bottom-0 left-0 p-5 text-primary">
                <h3 className="text-2xl font-semibold">
                  Latest Laptops For Gaming
                </h3>
                <p className="text-sm mt-2 mb-2">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </p>
                <Link to="/shop" className="underline hover:text-btn1">
                  Shop Now
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5 h-[500px] sm:h-[290px]">
              <div className="relative bg-btn flex items-center justify-center">
               <div className="w-[300px] sm:w-[80%] relative p-2">
                  <img src="/laptop.png" className="w-full" alt="laptop" />
                  <div className="bg-white/15 w-full h-full blur-2xl rounded-full absolute top-0 left-0"></div>
                </div>

                <div className="absolute bottom-0 left-0 p-5 text-primary">
                  <h3 className="text-xl font-semibold">
                    Latest Laptops For Gaming
                  </h3>
                  <p className="text-sm mt-2 mb-2">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  </p>
                  <Link to="/shop" className="underline hover:text-btn1">
                    Shop Now
                  </Link>
                </div>
              </div>
              <div className="relative bg-btn flex items-center justify-center">
                <div className="w-[300px] sm:w-[80%] relative p-2">
                  <img src="/laptop.png" className="w-full" alt="laptop" />
                  <div className="bg-white/15 w-full h-full blur-2xl rounded-full absolute top-0 left-0"></div>
                </div>

                <div className="absolute bottom-0 left-0 p-5 text-primary">
                  <h3 className="text-xl font-semibold">
                    Latest Laptops For Gaming
                  </h3>
                  <p className="text-sm mt-2 mb-2">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  </p>
                  <Link to="/shop" className="underline hover:text-btn1">
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* our products */}
      <section className="our-products bg-white my-5 p-5">
         <Heading title={"Our Products"} />
          <h2 className="text-xl sm:text-3xl font-bold mt-4">
            Explore Our Products
          </h2>
          <div className="grid grid-cols-2 mt-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {
              topRatedProducts.slice(0,20).map((product)=>(
                <ProductCard product={product} key={product.id}/>
              ))
            }
          </div>
          <div className="btn flex  items-center justify-center mt-16">
            <Button value="View All Products" bg="btn2" link="/shop" size="lg" style="base"/>
          </div>
      </section>
    </div>
  );
}

export default Home;
