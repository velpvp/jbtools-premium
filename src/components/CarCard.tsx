import Link from "next/link";
import { Calendar, Gauge } from "lucide-react";
import { Carro } from "@/types/Carro";
import Image from "next/image";

interface CarCardProps {
  carro: Carro;
}

export default function CarCard({ carro }: CarCardProps) {
  return (
    <div className="rounded shadow-card">
      <Image
        src={carro.imagemCapa}
        alt={carro.nome}
        width={1280}
        height={720}
        sizes="(max-width: 768px) 312px, (max-width: 1366px) 294px, 400px"
        className="w-full object-cover aspect-video rounded-tr rounded-tl"
      />

      <div className="mt-2 px-3 flex flex-col gap-2">
        <h3 className="font-bold text-2xl truncate" title={carro.nome}>
          {carro.nome}
        </h3>
        <div className="flex justify-center items-center gap-5 font-medium">
          <div className="flex items-center gap-1">
            <Calendar className="w-5 h-5 text-gray-500" />
            <p className="">{carro.ano}</p>
          </div>
          <div className="flex items-center gap-1">
            <Gauge className="w-5 h-5 text-gray-500" />
            <p className="">{carro.quilometragem.toLocaleString()}km</p>
          </div>
        </div>
        <div className="w-full border-t border-gray-300 flex flex-col gap-2 pb-2">
          <p className="text-center font-bold text-3xl text-[var(--primary)] pt-2">
            R${carro.preco.toLocaleString()}
          </p>
          <Link
            href={`/car/${carro.id}`}
            className="w-full rounded border border-[var(--primary)] text-center py-1.5 font-medium transition duration-300 ease hover:bg-[var(--primary)] hover:text-white block"
          >
            Ver mais
          </Link>
        </div>
      </div>
    </div>
  );
}
