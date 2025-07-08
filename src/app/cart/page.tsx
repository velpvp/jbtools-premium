import CartContent from "./Content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Carrinho - Jbtools",
  openGraph: {
    title: "Carrinho - Jbtools",
    type: "website",
    siteName: "Jbtools",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary",
    title: "Carrinho - Jbtools",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function CartPage() {
  return <CartContent />;
}
