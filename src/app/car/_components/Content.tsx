"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Carro } from "@/types/Carro";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { FaWhatsapp } from "react-icons/fa";
import { GiCarDoor } from "react-icons/gi";
import { BsFuelPumpFill } from "react-icons/bs";
import { TfiExchangeVertical } from "react-icons/tfi";
import { Calendar, Gauge } from "lucide-react";
import { IoIosColorFill } from "react-icons/io";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

// Lightbox
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import ButtonWhats from "@/components/ButtonWhats";
import Image from "next/image";

export default function CarContent() {
  const params = useParams();
  const idParam = params.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;

  const [carro, setCarro] = useState<Carro | null>(null);
  // const [loading, setLoading] = useState(true);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperCore | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    async function fetchCarro() {
      if (!id) return;

      // setLoading(true);

      try {
        const docRef = doc(db, "carros", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setCarro({
            id: docSnap.id,
            nome: data.nome,
            modelo: data.modelo,
            descricao: data.descricao,
            preco: data.preco,
            quilometragem: data.quilometragem,
            combustivel: data.combustivel,
            ano: data.ano,
            cor: data.cor,
            cambio: data.cambio,
            portas: data.portas,
            imagemCapa: data.imagemCapa,
            galeria: data.galeria || [],
            criadoEm: data.criadoEm,
          });
        } else {
          setCarro(null);
        }
      } catch (error) {
        console.error("Erro ao buscar carro:", error);
      } finally {
        // setLoading(false);
      }
    }

    fetchCarro();
  }, [id]);

  // if (loading) return <p className="p-4">Carregando...</p>;
  // if (!carro) return <p className="p-4">Carro não encontrado.</p>;
  if (!carro) return null;

  const imagens = [carro.imagemCapa, ...carro.galeria];
  const slides = imagens.map((url) => ({ src: url }));

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <Header />
      <main className="flex justify-start items-start max-md:flex-col gap-5 px-2 py-5">
        <div className="w-full md:w-[70%] bg-white px-4 sm:px-8 py-5 rounded shadow">
          <Swiper
            spaceBetween={10}
            navigation
            thumbs={{ swiper: thumbsSwiper }}
            modules={[Navigation, Thumbs]}
            className="mb-4 flex justify-center items-center select-none"
            onClick={(swiper) => openLightbox(swiper.activeIndex)}
          >
            {imagens.map((url, idx) => (
              <SwiperSlide
                key={idx}
                className="flex justify-center items-center cursor-zoom-in"
              >
                <Image
                  src={url}
                  alt={`Imagem ${idx + 1} de ${carro.nome}`}
                  width={1280}
                  height={720}
                  unoptimized
                  className="w-full h-[400px] 2xl:h-[550px] aspect-video object-contain rounded"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Miniaturas */}
          <Swiper
            onSwiper={setThumbsSwiper}
            spaceBetween={5}
            slidesPerView={10}
            modules={[Thumbs]}
            className="w-full rounded flex justify-center items-center lg:max-w-2xl"
          >
            {imagens.map((url, idx) => (
              <SwiperSlide
                key={idx}
                className="flex justify-center items-center"
              >
                <Image
                  src={url}
                  alt={`Miniatura ${idx + 1}`}
                  width={80}
                  height={80}
                  className="w-full max-w-15 aspect-square object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Lightbox */}
          <Lightbox
            open={lightboxOpen}
            close={() => setLightboxOpen(false)}
            index={lightboxIndex}
            slides={slides}
            plugins={[Thumbnails, Zoom, Fullscreen]}
            thumbnails={{
              border: 0,
              borderRadius: 0,
              padding: 0,
              gap: 10,
              imageFit: "cover",
              showToggle: true,
            }}
            zoom={{
              maxZoomPixelRatio: 3,
              scrollToZoom: true,
            }}
            carousel={{
              finite: false,
            }}
            controller={{
              closeOnBackdropClick: true,
            }}
            on={{
              view: ({ index }) => setLightboxIndex(index),
            }}
          />

          {/* Descrição */}
          <h1 className="text-3xl font-bold mb-4 mt-6">{carro.nome}</h1>
          <section className="mb-6">
            <h2 className="text-md font-semibold mb-2">Descrição</h2>
            <p className="font-medium whitespace-pre-line">{carro.descricao}</p>
          </section>

          {/* Info */}
          <div className="mb-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {/* <div>
              <strong>Preço:</strong> R$ {carro.preco.toLocaleString()}
            </div> */}
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-[var(--primary)]" />
              <div>
                <p className="text-[0.8rem] font-medium">Ano:</p>
                <p className="font-bold">{carro.ano}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Gauge className="w-6 h-6 text-[var(--primary)]" />
              <div>
                <p className="text-[0.8rem] font-medium">Quilometragem:</p>
                <p className="font-bold">
                  {carro.quilometragem.toLocaleString()}km
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <BsFuelPumpFill className="w-6 h-6 text-[var(--primary)]" />
              <div>
                <p className="text-[0.8rem] font-medium">Combustível:</p>
                <p className="font-bold">{carro.combustivel}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <TfiExchangeVertical className="w-6 h-6 text-[var(--primary)]" />
              <div>
                <p className="text-[0.8rem] font-medium">Câmbio:</p>
                <p className="font-bold">{carro.cambio}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <GiCarDoor className="w-6 h-6 text-[var(--primary)]" />
              <div>
                <p className="text-[0.8rem] font-medium">Portas:</p>
                <p className="font-bold">{carro.portas}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <IoIosColorFill className="w-6 h-6 text-[var(--primary)]" />
              <div>
                <p className="text-[0.8rem] font-medium">Cor:</p>
                <p className="font-bold">{carro.cor}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Card lateral fixo */}
        <div className="md:basis-1/3 w-full md:sticky md:top-4 md:self-start bg-white px-8 py-6 text-center flex justify-center items-center flex-col shadow rounded">
          <h2 className="text-3xl font-bold mb-2">{carro.nome}</h2>
          <div className="text-start mb-4">
            <p>Por apenas</p>
            <p className="text-5xl text-[var(--primary)] font-bold">
              R$ {carro.preco.toLocaleString()}
            </p>
          </div>
          <a
            href={`https://wa.me/5551980163944?text=${encodeURIComponent(
              `Olá, tenho interesse no ${carro.nome}`
            )}`}
            target="_blank"
            className="w-full flex items-center justify-center gap-1 rounded text-white bg-green-500 text-center text-lg py-1.5 font-semibold transition duration-300 ease hover:bg-green-600 hover:text-gray-200"
          >
            <FaWhatsapp className="w-6 h-6" />
            Tenho interesse
          </a>
        </div>
        <ButtonWhats />
      </main>
      <Footer />
    </>
  );
}
