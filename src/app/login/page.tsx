import LoginContent from "./_components/Content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - AutoShop",
  openGraph: {
    title: "Login - AutoShop",
    type: "website",
    siteName: "AutoShop",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary",
    title: "Login - AutoShop",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return <LoginContent />;
}
