import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import FeaturedProducts from "@/components/FeaturedProducts";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-100">
      <Navbar />
      <Hero />
      <Categories />
      <FeaturedProducts />
    </main>
  );
}