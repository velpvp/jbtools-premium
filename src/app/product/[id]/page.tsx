import { Metadata } from "next";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import ProductContent from "../_components/Content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  const productsQuery = query(
    collection(db, "products"),
    where("__name__", "==", id)
  );
  const snapshot = await getDocs(productsQuery);

  const productsData = snapshot.empty ? null : snapshot.docs[0].data();
  const productsName = productsData?.name;
  const productsDescription = productsData?.description ?? "";
  const productsImage = productsData?.imagemCapa;

  return {
    title: `${productsName} - Jbtools`,
    description: `${productsDescription.slice(0, 160)}${
      productsDescription.length > 160 ? "..." : ""
    }`,
    openGraph: {
      title: `${productsName} - Jbtools`,
      description: `${productsDescription.slice(0, 160)}${
        productsDescription.length > 160 ? "..." : ""
      }`,
      siteName: "Jbtools",
      locale: "pt_BR",
      type: "website",
      images: [
        {
          url: productsImage,
          width: 1200,
          height: 630,
          alt: `Imagem do veículo ${productsName}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${productsName} - Jbtools`,
      description: `${productsDescription.slice(0, 160)}${
        productsDescription.length > 160 ? "..." : ""
      }`,
      images: [productsImage],
    },
  };
}

export default function ProductPage() {
  return <ProductContent />;
}
