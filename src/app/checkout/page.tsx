import CheckoutContent from "./Content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout - Jbtools",
  openGraph: {
    title: "Checkout - Jbtools",
    type: "website",
    siteName: "Jbtools",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary",
    title: "Checkout - Jbtools",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutPage() {
  return <CheckoutContent />;
}
