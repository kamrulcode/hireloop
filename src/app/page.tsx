import { Cta } from "@/components/landing/cta";
import { Features } from "@/components/landing/features";
import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { Jobs } from "@/components/landing/jobs";
import { Navbar } from "@/components/landing/navbar";
import { Pricing } from "@/components/landing/pricing";
import { Stats } from "@/components/landing/stats";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Stats />
        <Jobs />
        <Features />
        <Pricing />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
