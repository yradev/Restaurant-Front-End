import ContentSlider from "../components/sections/ContentSlider";
import HeroMain from "../components/sections/HeroMain";
import Intro from "../components/sections/Intro";

export default function Homepage() {
    return (
        <>
            <HeroMain
                sliders={[
                    {
                        img: "assets/images/temp/hero-main-1.jpg",
                        title: "ANTIMOVSKI HAN",
                        subtitle: "Be happy is our second name."
                    },
                    {
                        img: "assets/images/temp/hero-main-2.jpg",
                        title: "Thats We",
                        subtitle: "Thats Desc"
                    },
                    {
                        img: "assets/images/temp/hero-main-3.jpg",
                        title: "Thats We",
                        subtitle: "Thats Desc"
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
        </>
    );
}