import type { Metadata } from "next";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { Montserrat } from "next/font/google";
import "./globals.css";
import ClientWrapper from "@/components/ClientWrapper"; // ✅ IMPORTANTE

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Carros novos, seminovos e usados - AutoShop",
  description:
    "Compre carros novos, seminovos e usados na AutoShop. Encontre os melhores preços e condições do mercado com qualidade e segurança garantida",
  keywords: [
    "Comprar carro",
    "Carros baratos",
    "Carros usados",
    "Carros novos",
    "Carros seminovos",
  ],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Carros novos, seminovos e usados - AutoShop",
    description:
      "Compre carros novos, seminovos e usados na AutoShop. Encontre os melhores preços e condições do mercado com qualidade e segurança garantida",
    type: "website",
    siteName: "AutoShop",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary",
    title: "Carros novos, seminovos e usados - AutoShop",
    description:
      "Compre carros novos, seminovos e usados na AutoShop. Encontre os melhores preços e condições do mercado com qualidade e segurança garantida",
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
        <ToastContainer position="bottom-right" autoClose={3000} />
      </body>
    </html>
  );
}
