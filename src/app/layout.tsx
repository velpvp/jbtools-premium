import type { Metadata } from "next";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { Montserrat } from "next/font/google";
import "./globals.css";
import ClientWrapper from "@/components/ClientWrapper";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Jbtools Premium - Contas Digitais Premium",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Jbtools Premium - Contas Digitais Premium",
    type: "website",
    siteName: "Jbtools",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary",
    title: "Jbtools Premium - Contas Digitais Premium",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={`${montserrat.variable} font-sans antialiased`}>
        <ClientWrapper>{children}</ClientWrapper>
        <ToastContainer theme="dark" position="bottom-right" autoClose={3000} />
      </body>
    </html>
  );
}
