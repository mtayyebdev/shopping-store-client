import React, { useState, useEffect } from "react";
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
import { useDispatch, useSelector } from 'react-redux'
import { getProducts, getFeatured, getNewArrivals, getPopular, getTopRated } from '../store/publicSlices/ProductsSlice.jsx'
import {getCategories} from '../store/publicSlices/CategorySlice.jsx'

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

function Home() {
  const [swiperRef, setSwiperRef] = useState(null);
  const dispatch = useDispatch();
  const {
    allProducts,
    featuedProducts,
    popularProducts,
    newArrivals,
    topRatedProducts
  } = useSelector((state) => state.productsSlice);
  const { categories } = useSelector((state) => state.categorySlice);

  const dispatchProducts = () => {
    dispatch(getProducts());
    dispatch(getFeatured());
    dispatch(getNewArrivals());
    dispatch(getPopular());
    dispatch(getTopRated());
    dispatch(getCategories());
  }

  useEffect(() => {
    dispatchProducts();
  }, [dispatch])

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
              key={product._id}
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
                <SwiperSlide key={product._id}>
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
            allProducts.slice(0, 20).map((product) => (
              <ProductCard product={product} key={product._id} />
            ))
          }
        </div>
        <div className="btn flex  items-center justify-center mt-16">
          <Button value="View All Products" bg="btn2" link="/shop" size="lg" style="base" />
        </div>
      </section>
    </div>
  );
}

export default Home;
