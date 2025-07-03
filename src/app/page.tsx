"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ImagesCarousel from "@/components/ImagesCarousel";
import Products from "@/components/Products";
// import Footer from "@/components/Footer";
// import ButtonWhats from "@/components/ButtonWhats";

// import SearchQuickFilter from "@/components/SearchQuickFilter";
// import FeaturedVehicles from "@/components/FeaturedVehicles";
// import Hero from "@/components/Hero";
// import Location from "@/components/Location";

export default function Home() {
  return (
    <>
      <Header />

      <main>
        <ImagesCarousel />
        <Products />
      </main>

      <Footer />

      {/* <main className="mb-20">
        <Hero />
        <SearchQuickFilter />
        <FeaturedVehicles />
        <Location />
      </main> */}

      {/* <Footer />
      <ButtonWhats /> */}
    </>
  );
}
