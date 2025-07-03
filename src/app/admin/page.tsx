import AdminContent from "./_components/Content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Painel de Admin - AutoShop",
  openGraph: {
    title: "Painel de Admin - AutoShop",
    type: "website",
    siteName: "AutoShop",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary",
    title: "Painel de Admin - AutoShop",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return <AdminContent />;
}
