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
        </>
    );
}