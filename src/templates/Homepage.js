import ContentSlider from "../components/sections/ContentSlider";
import HeroMain from "../components/sections/HeroMain";
import Intro from "../components/sections/Intro";
import ImageContent from "../components/sections/ImageContent";


export default function Homepage() {
    return (
        <>
            <HeroMain
                title = 'Антимовски Хан'
                subtitle= 'Моето кратко описание'
                sliders={[
                    {
                        img: "assets/images/temp/hero-main-1.jpg",
                    },
                    {
                        img: "assets/images/temp/hero-main-2.jpg",
                    },
                    {
                        img: "assets/images/temp/hero-main-3.jpg",
                    }
                ]}
            />

            <Intro />

            <ContentSlider
                title="Favorite Dishes"
                content="Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni totam, ratione qui neque at tempora, consequuntur suscipit odio, voluptatibus quos quaerat vel fugit exercitationem cum doloremque! Delectus facilis dolore amet."
                images={[
                    "assets/images/temp/dishes-1.jpg",
                    "assets/images/temp/dishes-2.jpg",
                    "assets/images/temp/dishes-3.jpg",
                    "assets/images/temp/dishes-4.jpg",
                    "assets/images/temp/dishes-5.jpg"
                ]}
            />

            <ImageContent
                title="Deliveries"
                content="Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni totam, ratione qui neque at tempora, consequuntur suscipit odio, voluptatibus quos quaerat vel fugit exercitationem cum doloremque! Delectus facilis dolore amet."
                image="assets/images/temp/image-content.png"
            />

            <ContentSlider
                reversed={true}
                title="Reservations"
                content="Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni totam, ratione qui neque at tempora, consequuntur suscipit odio, voluptatibus quos quaerat vel fugit exercitationem cum doloremque! Delectus facilis dolore amet."
                images={[
                    "assets/images/temp/reservations-1.jpg",
                    "assets/images/temp/reservations-2.jpg",
                    "assets/images/temp/reservations-3.jpg",
                    "assets/images/temp/reservations-4.jpg",
                    "assets/images/temp/reservations-5.jpg",
                ]}
            />
        </>
    );
}