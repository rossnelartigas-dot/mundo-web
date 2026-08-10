import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HomeSections from "@/components/HomeSections";
import Categories from "@/components/Categories";
import FeaturedProducts from "@/components/FeaturedProducts";
import Brands from "@/components/Brands";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-100">
      <Navbar />
      <Hero />
      <HomeSections />
      <Categories />
      <FeaturedProducts />
      <Brands />
      <Footer />
      <WhatsAppButton />
    </main>
  );
}