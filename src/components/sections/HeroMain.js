import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import "swiper/css/effect-fade";

import { Autoplay, Controller, EffectFade, Pagination } from 'swiper/modules';
import { useState } from 'react';

export default function HeroMain({ title, subtitle, sliders }) {
    
    const sliderBgOptions = {
        effect: 'fade',
        className: "slider__clip",
        wrapperClass: "slider__toogle",
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.hero__pagination',
            clickable: true
        },
        modules: [Autoplay, Pagination, EffectFade, Controller],
        fadeEffect: {
            crossFade: true,
        },
    }
    return (
        <section className="hero-main" >
            {sliders !== undefined ? <>
                <div className="slider-main">
                    <Swiper {...sliderBgOptions}>
                        {sliders.map(slider => {
                            return (
                                <SwiperSlide className="slider__slide" key={sliders.indexOf(slider)}>
                                    <img src={slider.img} alt="" className="slider__bg" />
                                </SwiperSlide>
                            )
                        })}
                    </Swiper>
                </div>
            </>
            :
            ''}
           

            <div className="shell">
                <div className="hero__inner">
                    {title !== undefined ? <>
                        <div className="hero__head">
                            <h1>{title}</h1>
                        </div>
                    </>
                    : 
                    ''}

                    {subtitle !== undefined ? <>
                        <div className="hero__subtitle">
                            {subtitle}
                        </div>
                    </>
                        :
                        ''}

                    <div className="hero__pagination"></div>
                </div>
            </div>
        </section >
    );
}