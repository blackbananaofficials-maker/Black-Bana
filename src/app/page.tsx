import Hero from "@/components/Hero";
import InfiniteTicker from "@/components/InfiniteTicker";
import Method from "@/components/Method";
import Expertise from "@/components/Expertise";
import Projects from "@/components/Projects";
import Reviews from "@/components/Reviews";
import ContactForm from "@/components/ContactForm";

export default function Home() {
    return (
        <>
            <Hero />
            <InfiniteTicker />
            <Method />
            <Expertise />
            <Projects />
            <Reviews />
            <ContactForm />
        </>
    );
}
