import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import "swiper/css/effect-fade";

import { Autoplay, Controller, EffectFade, Pagination } from 'swiper/modules';
import { useState } from 'react';

export default function HeroMain({ sliders }) {
    const [controlledSwiper, setControlledSwiper] = useState(null);

    const coreOptions = {
        effect: 'fade',
        className: "slider__clip",
        wrapperClass: "slider__toogle"
    }

    const sliderBgOptions = {
        ...coreOptions,
        onSwiper: setControlledSwiper,
        modules: [EffectFade, Controller],
    }

    const sliderContentOptions = {
        ...coreOptions,
        controller: { control: controlledSwiper },
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
        },
        pagination: {
            clickable: true
        },
        modules: [Autoplay, Pagination, EffectFade, Controller],
        fadeEffect: {
            crossFade: true,
        },
        onInit: (swiper) => {
            swiper.pagination.el.classList.add('slider__pagination');

            swiper.pagination.bullets.forEach(bullet => {
                bullet.classList.add('slider__pagination-bullet');

                if (bullet.classList.contains('swiper-pagination-bullet-active')) {
                    bullet.classList.add('slider__pagination-bullet-active');
                }
                return bullet;
            })
        },
        onSlideChange: (swiper) => {
            const activeIndex = swiper.activeIndex;
            const prevIndex = swiper.previousIndex;

            swiper.pagination.bullets[prevIndex].classList.remove('slider__pagination-bullet-active');
            swiper.pagination.bullets[activeIndex].classList.add('slider__pagination-bullet-active');
        }
    }

    return (
        <section className="hero-main" >
            <div className="slider-main-bg">
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
            <div className="shell">
                <div className="hero__slider slider-main-content">
                    <Swiper {...sliderContentOptions}>

                        {sliders.map(slider => {
                            return (
                                <SwiperSlide className="slider__slide" key={sliders.indexOf(slider)}>
                                    <div className="slider__slide-inner">
                                        <header className="slider__slide-head">
                                            <h1>{slider.title}</h1>
                                        </header>

                                        <div className="slider__slide-entity">
                                            <p>{slider.subtitle}</p>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            )
                        })}
                    </Swiper>
                </div>
            </div>
        </section >
    );
}