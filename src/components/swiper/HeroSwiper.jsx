import React, { useRef } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";

function HeroSwiper() {
  const progressCircle = useRef(null);
  const progressContent = useRef(null);
  const onAutoplayTimeLeft = (s, time, progress) => {
    progressCircle.current.style.setProperty("--progress", 1 - progress);
    progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
  };

  const images = [
    "/sliderImgs/1.webp",
    "/sliderImgs/2.webp",
    "/sliderImgs/3.webp",
    "/sliderImgs/4.webp",
  ];
  return (
    <>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        onAutoplayTimeLeft={onAutoplayTimeLeft}
        className="hero-swiper"
      >
        {images.map((imgSrc, index) => (
          <SwiperSlide key={index}>
            <img
              src={imgSrc}
              alt={`Slide ${index + 1}`}
              className="w-full h-auto"
            />
          </SwiperSlide>
        ))}
        <div className="autoplay-progress" slot="container-end">
          <svg viewBox="0 0 48 48" ref={progressCircle}>
            <circle cx="24" cy="24" r="20"></circle>
          </svg>
          <span ref={progressContent}></span>
        </div>
      </Swiper>

      <style>
        {`/* Swiper styles */
.hero-swiper {
  width: 100%;
  height: 250px;
  margin: 15px 0;
}

.hero-swiper .swiper-slide {
  text-align: center;
  font-size: 18px;
  background: #444;

  /* Center slide text vertically */
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-swiper .swiper-slide img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-swiper .autoplay-progress {
  position: absolute;
  right: 16px;
  bottom: 16px;
  z-index: 10;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: var(--swiper-theme-color);
}

.hero-swiper .autoplay-progress svg {
  --progress: 0;
  position: absolute;
  left: 0;
  top: 0px;
  z-index: 10;
  width: 100%;
  height: 100%;
  stroke-width: 4px;
  stroke: var(--swiper-theme-color);
  fill: none;
  stroke-dashoffset: calc(125.6px * (1 - var(--progress)));
  stroke-dasharray: 125.6;
  transform: rotate(-90deg);
}
.hero-swiper .swiper-button-next,
.hero-swiper .swiper-button-prev {
  background-color: white;
  height: 80px !important;
  width: 40px !important;
  top: 45% !important;
  border-radius: 5px !important;
}
.hero-swiper .swiper-button-next {
  right: -5px !important;
}
.hero-swiper .swiper-button-prev {
  left: -5px !important;
}

.hero-swiper .swiper-button-next .swiper-navigation-icon,
.hero-swiper .swiper-button-prev .swiper-navigation-icon {
  fill: gray !important;
  height: 20px !important;
  width: 20px !important;
  color: gray !important;
}`}
      </style>
    </>
  );
}

export default HeroSwiper;
