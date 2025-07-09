"use client";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import qrcode from "../../../public/qrcode.png";
import { FaCopy, FaPhone, FaWhatsapp } from "react-icons/fa";
import { GiConfirmed } from "react-icons/gi";

export default function CheckoutContent() {
  const { total } = useCart();
  const chavePix = "fc46bc2d-f69d-43e7-b059-d08637d8803";
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const router = useRouter();

  const handleCopy = () => {
    navigator.clipboard.writeText(chavePix);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmPayment = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsConfirmed(true);
    }, 6000);
  };

  const handleCancel = () => {
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 max-w-md mx-auto text-center min-h-screen">
        <svg
          className="animate-spin h-8 w-8 text-blue-600 mb-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
        <p className="text-lg font-semibold text-blue-600">
          Confirmando pagamento...
        </p>
      </div>
    );
  }

  if (isConfirmed) {
    return (
      <div className="bg-[rgba(10,10,10,0.95)] backdrop-blur-[15px] border border-[rgba(59,130,246,0.3)] px-4 py-3 max-w-md max-md:max-w-full mx-auto text-center min-h-screen flex justify-center items-center flex-col">
        <GiConfirmed className="w-20 h-20  text-blue-500 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-4">
          Pagamento Confirmado!
        </h2>
        <p className="mb-6 text-gray-200">
          Nos chame em nosso suporte do whatsapp nos mandando comprovante e
          dizendo o nome do seu produto
        </p>

        <p className="w-full text-white font-semibold rounded-md mb-4 transition flex justify-center items-center gap-1">
          <FaPhone className="w-5 h-5" />
          41 9684-4896
        </p>
        <a
          href="https://api.whatsapp.com/send/?phone=554196844896&text&type=phone_number&app_absent=0"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-blue-600 hover:bg-blue-800 text-white font-bold py-3 rounded-md mb-4 transition cursor-pointer flex justify-center items-center gap-1"
        >
          <FaWhatsapp className="w-5 h-5" />
          Falar no WhatsApp
        </a>
        <button
          onClick={handleCancel}
          className="text-gray-300 transition hover:text-gray-400 text-sm cursor-pointer"
        >
          Voltar para o início
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[rgba(10,10,10,0.95)] backdrop-blur-[15px] border border-[rgba(59,130,246,0.3)] px-4 py-3 max-w-md max-md:max-w-full mx-auto text-center min-h-screen flex justify-center items-center flex-col">
      <h1 className="text-3xl font-extrabold mb-6">
        Pague
        <br />
        <span className="text-4xl block mt-2 text-blue-700">
          R$ {Number(total).toFixed(2).replace(".", ",")}
        </span>
      </h1>

      {/* QR Code - Troque o src pela sua imagem */}
      <div className="mx-auto w-48 h-48 mb-6">
        <Image
          src={qrcode}
          alt="QR Code Pix"
          className="w-full h-full object-contain rounded-lg"
          loading="lazy"
        />
      </div>

      <p className="mb-1 font-semibold text-gray-200">Chave PIX:</p>
      <div
        className="select-all w-full p-2 bg-slate-800 border border-blue-500 outline-none mb-4 cursor-pointer flex justify-between items-center"
        onClick={handleCopy}
      >
        {chavePix}
        <FaCopy />
      </div>
      <button
        onClick={handleCopy}
        className={`w-full py-2 mb-6 rounded-md font-semibold transition cursor-pointer ${
          copied ? "bg-green-600" : "bg-transparent"
        } text-white`}
      >
        {copied ? "Chave copiada!" : "Copiar chave"}
      </button>

      <button
        onClick={handleConfirmPayment}
        className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-md mb-4 transition cursor-pointer"
      >
        Já realizei o pagamento
      </button>

      <button
        onClick={handleCancel}
        className="text-gray-300 transition hover:text-gray-400 text-sm cursor-pointer"
      >
        Cancelar e voltar ao início
      </button>
    </div>
  );
}
