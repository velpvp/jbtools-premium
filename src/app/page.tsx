"use client";

import { Suspense } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ImagesCarousel from "@/components/ImagesCarousel";
import Products from "@/components/Products";
import ButtonWhats from "@/components/ButtonWhats";

export default function Home() {
  return (
    <div>
      <Suspense>
        <Header />

        <main>
          <ImagesCarousel />
          <Products />
        </main>
        <Footer />
      </Suspense>
      <ButtonWhats />
    </div>
  );
}
