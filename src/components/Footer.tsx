import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import logoImg from "../../public/logo.webp";

export default function Footer() {
  return (
    <footer className="bg-[#FFF] font-medium text-black py-10 px-4 flex justify-center items-center flex-col">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Logo e descrição */}
        <div className="flex justify-center max-md:justify-start items-start">
          <div className="flex jutify-center items-start flex-col">
            <Image src={logoImg} width={120} height={80} alt="Logo AutoShop" />
            <p className="text-gray-900 text-sm">
              Carros novos, seminovos e usados
            </p>
          </div>
        </div>

        {/* Links do site */}
        <div className="flex justify-center max-md:justify-start items-start">
          <div className="flex jutify-center items-start flex-col">
            <h3 className="text-lg font-bold mb-2 text-[var(--primary)]">
              Páginas
            </h3>
            <ul className="text-gray-900 text-sm space-y-1 flex justify-start items-start flex-col text-start">
              <li>
                <Link
                  href="/"
                  className="transition hover:text-[var(--primary-hover)]"
                >
                  Início
                </Link>
              </li>
              <li>
                <Link
                  href="/estoque"
                  className="transition hover:text-[var(--primary-hover)]"
                >
                  Estoque
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="transition hover:text-[var(--primary-hover)]"
                >
                  Painel
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex justify-center max-md:justify-start items-start">
          <div className="flex jutify-center items-start flex-col">
            <h3 className="text-lg font-bold mb-2 text-[var(--primary)]">
              Políticas do site
            </h3>
            <ul className="text-gray-900 text-sm space-y-1 flex justify-start items-start flex-col text-start">
              <li>
                <Link
                  href="/termosdeuso"
                  className="transition hover:text-[var(--primary-hover)]"
                >
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link
                  href="/politicadeprivacidade"
                  className="transition hover:text-[var(--primary-hover)]"
                >
                  Política de Privacidade
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Redes sociais */}
        <div className="flex justify-center max-md:justify-start items-start">
          <div className="flex jutify-center items-start flex-col">
            <h3 className="text-lg font-bold mb-2 text-[var(--primary)]">
              Siga-nos
            </h3>
            <div className="flex space-x-4 text-xl text-gray-900">
              <a
                href="https://facebook.com"
                target="_blank"
                aria-label="Facebook"
              >
                <FaFacebookF className="transition hover:text-[var(--primary-hover)]" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                aria-label="Instagram"
              >
                <FaInstagram className="transition hover:text-[var(--primary-hover)]" />
              </a>
              <a
                href="https://wa.me/5551999999999"
                target="_blank"
                aria-label="WhatsApp"
              >
                <FaWhatsapp className="transition hover:text-[var(--primary-hover)]" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Linha inferior */}
      <div className="w-full border-t border-gray-300 mt-8 pt-4 text-sm text-gray-900 text-center">
        <p>
          © {new Date().getFullYear()} AutoShop – Todos os direitos reservados
        </p>
        <p>
          Desenvolvido por{" "}
          <a
            href="https://velp.site"
            target="_blank"
            className="text-black font-bold hover:underline"
          >
            VELP
          </a>
        </p>
      </div>
    </footer>
  );
}
