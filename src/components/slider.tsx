"use client";
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

type SliderProps = {
  children: React.ReactNode; // Contenido dinámico que será renderizado en cada slide
  slidesPerView?: number; // Personalizar cuántos slides se muestran
  spaceBetween?: number; // Personalizar espacio entre slides
  customBreakpoints?: Record<string, any>; // Personalizar breakpoints
  loop?: boolean;
  autoplay?: boolean;
  pagination?: boolean;
  navigation?: boolean;
  delay?: number;
};
const defaultBreakpoints = {
  640: {
    slidesPerView: 1,
    spaceBetween: 10,
  },
  768: {
    slidesPerView: 2,
    spaceBetween: 20,
  },
  1024: {
    slidesPerView: 3,
    spaceBetween: 30,
  },
}

export default function Slider({
  children,
  slidesPerView = 1,
  spaceBetween = 50,
  customBreakpoints,
  loop = true,
  autoplay = true,
  pagination = true,
  navigation = true,
  delay = 2500,
}: SliderProps) {
  return (
    <Swiper
      modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
      spaceBetween={spaceBetween}
      slidesPerView={slidesPerView}
      navigation
      loop={loop}
      autoplay={{
        delay,
        disableOnInteraction: false,
      }}
      pagination={{ clickable: true }}
      scrollbar={{ draggable: true }}
      effect="fade"
      breakpoints={customBreakpoints ?? defaultBreakpoints}
    >
      {Array.isArray(children)
        ? children.map((child, index) => (
          <SwiperSlide key={index}>{child}</SwiperSlide>
        ))
        : children}
    </Swiper>
  );
}
