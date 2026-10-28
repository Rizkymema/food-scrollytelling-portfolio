import { Preloader } from "@/components/Preloader";
import { Navbar } from "@/components/Navbar";
import { SequenceScroll } from "@/components/SequenceScroll";
import { Marquee } from "@/components/Marquee";
import { About } from "@/components/About";
import { Projects } from "@/components/Projects";
import { Process } from "@/components/Process";
import { Services } from "@/components/Services";
import { Testimonials } from "@/components/Testimonials";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Preloader />
      <Navbar />
      <main>
        <SequenceScroll />
        {/* Menutup section scroll: semua section setelahnya naik di atas canvas yang sticky. */}
        <div className="sheet relative z-10 -mt-[100vh] bg-bg">
          <Marquee />
          <About />
          <Projects />
          <Process />
          <Services />
          <Testimonials />
          <Contact />
        </div>
      </main>
      <Footer />
    </>
  );
}
