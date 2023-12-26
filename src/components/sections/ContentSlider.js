import { EffectCoverflow, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export default function ContentSlider({ content, title, images }) {
    const sliderOptions = {
        effect: "coverflow",
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 3,
        initialSlide: 1,
        coverflowEffect: {
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
        },
        modules: [EffectCoverflow, Pagination],
        pagination: {
            clickable: true
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

            if (swiper.pagination.bullets[prevIndex] !== undefined) {
                swiper.pagination.bullets[prevIndex].classList.remove('slider__pagination-bullet-active');
            }

            if (swiper.pagination.bullets[activeIndex] !== undefined) {
                swiper.pagination.bullets[activeIndex].classList.add('slider__pagination-bullet-active');
            }
        },
        className: "slider__clip",
        wrapperClass: "slider__toogle"
    }
    return (
        <div className="section-content-slider">
            <div className="shell">
                <div className="section__inner">
                    <div className="section__content">
                        <h2>{title}</h2>

                        <p>{content}</p>
                    </div>

                    <div className="section__slider">
                        <div className="slider-gallery">
                            <Swiper {...sliderOptions} >
                                {images.map((imgSrc) => {
                                    return (
                                        <SwiperSlide className="slider__slide">
                                            <img src={imgSrc} />
                                        </SwiperSlide>
                                    )
                                })}
                            </Swiper>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}