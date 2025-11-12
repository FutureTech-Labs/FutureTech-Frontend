"use client";

import { ReactNode } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from 'swiper/modules';

import "swiper/css";
import "swiper/css/pagination";

interface PaginationSliderProps {
    children: ReactNode[];
    slidesPerView?: number;
    className?: string;
}

const PaginationSlider = ({
    children,
    slidesPerView = 1,
    className = "",
}: PaginationSliderProps) => {
    if (!children || children.length === 0) return null;

    return (
        <div className={`md:hidden w-full ${className}`}>
            <Swiper
                modules={[Autoplay, EffectFade]}
                fadeEffect={{ crossFade: true }}
                spaceBetween={10}
                autoplay={{
                    delay: 3500,
                    disableOnInteraction: false,
                }}
                slidesPerView={slidesPerView}
                className="w-full"
            >
                {children.map((child, index) => (
                    <SwiperSlide key={index} className="flex justify-center">
                        {child}
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default PaginationSlider;
