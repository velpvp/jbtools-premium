import AdminContent from "./_components/Content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Painel Administrativo - Jbtools",
  openGraph: {
    title: "Painel Administrativo - Jbtools",
    type: "website",
    siteName: "Jbtools",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary",
    title: "Painel Administrativo - Jbtools",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return <AdminContent />;
}
