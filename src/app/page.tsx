"use client";

import { Suspense } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ImagesCarousel from "@/components/ImagesCarousel";
import Products from "@/components/Products";

export default function Home() {
  return (
    <Suspense>
      <Header />

      <main>
        <ImagesCarousel />
        <Products />
      </main>

      <Footer />
    </Suspense>
  );
}
