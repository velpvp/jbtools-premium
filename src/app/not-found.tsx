import Image from "next/image";
import Link from "next/link";
import logoImg from "../../public/logo.webp";

export default function NotFound() {
  return (
    <main className="w-full min-h-screen flex justify-center items-center gap-10 flex-col p-6">
      <Image src={logoImg} alt="Logo AutoShop" width={120} height={80} />
      <p>Página não encontrada</p>
      <Link
        href="/"
        className="text-white px-4 py-1 bg-[var(--primary)] transition hover:bg-[var(--primary-hover)] rounded"
      >
        Ir para o site
      </Link>
    </main>
  );
}
