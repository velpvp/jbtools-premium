import { Metadata } from "next";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import CarContent from "../_components/Content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  const carrosQuery = query(
    collection(db, "carros"),
    where("__name__", "==", id)
  );
  const snapshot = await getDocs(carrosQuery);

  const carroData = snapshot.empty ? null : snapshot.docs[0].data();
  const carroNome = carroData?.nome;
  const carroDescricao = carroData?.descricao;

  const carroImage = carroData?.imagemCapa;

  return {
    title: `${carroNome} - AutoShop`,
    description: `${carroDescricao.slice(0, 160)}${
      carroDescricao.length > 160 ? "..." : ""
    }`,
    openGraph: {
      title: `${carroNome} - AutoShop`,
      description: `${carroDescricao.slice(0, 160)}${
        carroDescricao.length > 160 ? "..." : ""
      }`,
      siteName: "AutoShop",
      locale: "pt_BR",
      type: "website",
      images: [
        {
          url: carroImage,
          width: 1200,
          height: 630,
          alt: `Imagem do veículo ${carroNome}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${carroNome} - AutoShop`,
      description: `${carroDescricao.slice(0, 160)}${
        carroDescricao.length > 160 ? "..." : ""
      }`,
      images: [carroImage],
    },
  };
}

export default function CarroPage() {
  return <CarContent />;
}
