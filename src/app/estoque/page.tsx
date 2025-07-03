import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EstoqueContent from "./_components/Content";
import ButtonWhats from "@/components/ButtonWhats";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Estoque - AutoShop",
  description: "Confira todos os veículos disponíveis para compra na AutoShop",
  openGraph: {
    title: "Estoque - AutoShop",
    description:
      "Confira todos os veículos disponíveis para compra na AutoShop",
    type: "website",
    siteName: "AutoShop",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary",
    title: "Estoque - AutoShop",
    description:
      "Confira todos os veículos disponíveis para compra na AutoShop",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function EstoquePage() {
  return (
    <>
      <Header />
      <Suspense>
        <EstoqueContent />
      </Suspense>
      <ButtonWhats />
      <Footer />
    </>
  );
}
