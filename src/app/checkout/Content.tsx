"use client";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutContent() {
  const { total } = useCart();
  const chavePix = "chavepix@gmail.com";
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
    }, 6000); // 6 segundos simulando confirmação
  };

  const handleCancel = () => {
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 max-w-md mx-auto text-center">
        <svg
          className="animate-spin h-12 w-12 text-blue-600 mb-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
        <p className="text-lg font-semibold text-blue-600">
          Confirmando pagamento...
        </p>
      </div>
    );
  }

  if (isConfirmed) {
    return (
      <div className="max-w-md mx-auto p-6 text-center border border-blue-300 rounded-lg shadow-md bg-white">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">
          Pagamento Confirmado!
        </h2>
        <p className="mb-6 text-gray-700">
          Para resgatar seu produto, entre em contato conosco pelo botão abaixo
          ou pelo WhatsApp:
        </p>
        <a
          href="https://wa.me/5511999999999"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-md transition"
        >
          Falar no WhatsApp
        </a>
        <button
          onClick={handleCancel}
          className="block mt-6 text-sm text-gray-500 underline hover:text-gray-700"
        >
          Voltar para o início
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
      <h1 className="text-3xl font-extrabold mb-6 text-blue-700">
        Pague agora
        <br />
        <span className="text-4xl block mt-2">
          R$ {Number(total).toFixed(2).replace(".", ",")}
        </span>
      </h1>

      {/* QR Code - Troque o src pela sua imagem */}
      <div className="mx-auto w-48 h-48 mb-6">
        <img
          src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=pix%3Achavepix%40gmail.com"
          alt="QR Code Pix"
          className="w-full h-full object-contain rounded-lg shadow-md"
          loading="lazy"
        />
      </div>

      <p className="mb-1 font-semibold text-gray-700">Chave PIX:</p>
      <div
        className="select-all bg-gray-100 p-3 rounded-md font-mono text-blue-900 mb-3 cursor-pointer"
        onClick={handleCopy}
      >
        {chavePix}
      </div>
      <button
        onClick={handleCopy}
        className={`w-full py-2 mb-6 rounded-md font-semibold transition ${
          copied ? "bg-green-600" : "bg-blue-600 hover:bg-blue-700"
        } text-white`}
      >
        {copied ? "Chave copiada!" : "Copiar chave"}
      </button>

      <button
        onClick={handleConfirmPayment}
        className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-md mb-4 transition"
      >
        Já realizei o pagamento
      </button>

      <button
        onClick={handleCancel}
        className="text-gray-500 underline hover:text-gray-700 text-sm"
      >
        Cancelar e voltar ao início
      </button>
    </div>
  );
}
