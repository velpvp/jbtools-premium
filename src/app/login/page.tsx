import LoginContent from "./_components/Content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Jbtools",
  openGraph: {
    title: "Login - Jbtools",
    type: "website",
    siteName: "Jbtools",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary",
    title: "Login - Jbtools",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return <LoginContent />;
}
