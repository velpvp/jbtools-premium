"use client";

import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import qrcode from "../../../public/qrcode.png";
import pixLogo from "../../../public/logo-pix.png";
import cartao from "../../../public/cartao.png";
import { FaCopy, FaPhone, FaWhatsapp } from "react-icons/fa";
import { GiConfirmed } from "react-icons/gi";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { motion } from "framer-motion";

export default function CheckoutContent() {
  const { cart, total } = useCart();
  const router = useRouter();
  const chavePix = "fc46bc2d-f69d-43e7-b059-d08637d8803";

  const [step, setStep] = useState(1);
  const [nome, setNome] = useState("");
  const [phone, setPhone] = useState("");
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [nomeError, setNomeError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [termsError, setTermsError] = useState("");
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<null | {
    code: string;
    discount: number;
  }>(null);
  const [couponError, setCouponError] = useState("");
  const discountedTotal = appliedCoupon
    ? total - (total * appliedCoupon.discount) / 100
    : total;

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

  const applyCoupon = async () => {
    setCouponError("");

    const trimmed = couponInput.trim().toUpperCase();
    if (!trimmed) return setCouponError("Digite um cupom válido.");

    try {
      const q = query(
        collection(db, "coupons"),
        where("code", "==", trimmed),
        where("active", "==", true)
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return setCouponError("Cupom inválido ou inativo.");
      }

      const data = snapshot.docs[0].data();
      setAppliedCoupon({ code: data.code, discount: data.discount });
      setCouponInput("");
    } catch (error) {
      console.error("Erro ao validar cupom:", error);
      setCouponError("Erro ao aplicar o cupom.");
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError("");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 mx-auto text-center min-h-screen bg-gray-950">
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
      <div className="bg-gray-950 backdrop-blur-[15px] px-4 py-2 text-center min-h-screen flex justify-center items-center flex-col">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="max-w-lg flex justify-center items-center flex-col"
        >
          <GiConfirmed className="w-20 h-20  text-blue-500 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">
            Pagamento Confirmado!
          </h2>
          <p className="mb-6 text-gray-200">
            Nos chame em nosso suporte do whatsapp nos mandando comprovante e
            dizendo o nome do seu produto
          </p>

          <p className="text-white font-semibold flex items-center gap-2">
            <FaPhone /> 41 9684-4896
          </p>
          <a
            href="https://api.whatsapp.com/send/?phone=554196844896"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 w-full bg-blue-600 hover:bg-blue-800 text-white font-bold py-3 rounded-md transition flex justify-center items-center gap-1"
          >
            <FaWhatsapp /> Falar no WhatsApp
          </a>
          <button
            onClick={handleCancel}
            className="text-gray-300 mt-4 cursor-pointer transition hover:text-gray-500"
          >
            Voltar para o início
          </button>
        </motion.div>
      </div>
    );
  }

  // Etapa 1: Formulário e Detalhes do pedido
  if (step === 1) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="max-w-7xl min-h-screen mx-auto px-4 py-8 grid md:grid-cols-2 justify-center items-start gap-5 text-white"
        data-aos="fade"
      >
        {/* Detalhes de cobrança */}
        <div className="bg-gray-950 min-h-screen max-md:min-h-[50vh] p-6 flex-1 rounded w-full">
          <h2 className="text-xl font-bold mb-4">DETALHES DE COBRANÇA</h2>
          {/* Campo do nome */}
          <div className="mb-4">
            <label className="block mb-1">
              Nome <span className="text-red-500">*</span>
            </label>
            <input
              type="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Seu Nome"
              className="w-full px-3 py-2 bg-gray-800 rounded outline-none"
            />
            {nomeError && (
              <p className="text-red-500 text-sm mt-1">{nomeError}</p>
            )}
          </div>

          {/* Campo de WhatsApp */}
          <div className="mb-4">
            <label className="block mb-1">
              Whatsapp <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                const onlyNumbers = e.target.value.replace(/\D/g, "");
                setPhone(onlyNumbers);
              }}
              placeholder="Seu WhatsApp"
              className="w-full px-3 py-2 bg-gray-800 rounded outline-none"
            />

            {phoneError && (
              <p className="text-red-500 text-sm mt-1">{phoneError}</p>
            )}
          </div>
        </div>

        {/* Seu pedido */}
        <div className="bg-gray-950 min-h-screen max-md:min-h-[50vh] p-6 flex-1 rounded w-full">
          <h2 className="text-xl font-bold mb-4">SEU PEDIDO</h2>
          <div className="bg-gray-800 px-4 rounded">
            <div className="flex justify-between items-center border-b border-gray-700 py-2 uppercase font-bold mb-1">
              <p>Produto</p>
              <p>Subtotal</p>
            </div>
            {cart.map((item, index) => (
              <div
                key={index}
                className="flex justify-between text-gray-200 text-[0.9rem] py-1 px-2"
              >
                <span>
                  {item.product.name} x{item.quantity}
                </span>
                <span>
                  R$ {(item.product.price ?? 0).toFixed(2).replace(".", ",")}
                </span>
              </div>
            ))}
            <div className="flex justify-between font-bold text-xl py-4 mt-1 border-t border-gray-700">
              <span>Total</span>
              <span className="text-blue-500">
                R${" "}
                {appliedCoupon
                  ? (total - (total * appliedCoupon.discount) / 100)
                      .toFixed(2)
                      .replace(".", ",")
                  : total.toFixed(2).replace(".", ",")}
              </span>
            </div>
          </div>

          <div className="mt-4">
            <label className="block font-medium text-white mb-1">
              Cupom de desconto
            </label>

            {appliedCoupon ? (
              <div className="flex items-center justify-between bg-green-800 text-white rounded px-3 py-2 mb-2">
                <span>
                  Cupom <strong>{appliedCoupon.code}</strong> aplicado:{" "}
                  <strong>{appliedCoupon.discount}% OFF</strong>
                </span>
                <button
                  onClick={removeCoupon}
                  className="text-red-400 transition hover:text-red-600 text-sm ml-2 cursor-pointer"
                >
                  Remover
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => {
                    const formatted = e.target.value
                      .toUpperCase()
                      .replace(/\s/g, "");
                    setCouponInput(formatted);
                  }}
                  placeholder="Digite seu cupom"
                  className="flex-1 px-3 py-2 bg-gray-800 rounded outline-none text-white"
                />
                <button
                  onClick={applyCoupon}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition cursor-pointer"
                >
                  Aplicar
                </button>
              </div>
            )}

            {couponError && (
              <p className="text-red-500 text-sm mt-1">{couponError}</p>
            )}
          </div>

          {/* Opções de pagamento */}
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Forma de pagamento</h3>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="radio"
                checked
                readOnly
                className="accent-blue-600"
              />

              <span className="text-blue-400 font-medium flex justify-center items-center gap-2">
                PIX
                <Image src={pixLogo} alt="Logo Pix" width={20} height={20} />
              </span>
            </div>
            <div className="flex items-center gap-2 opacity-50 cursor-not-allowed">
              <input type="radio" disabled />
              <span className="line-through flex justify-center items-center gap-2">
                Cartão (em breve)
                <Image src={cartao} alt="Cartão" width={20} height={20} />
              </span>
            </div>
            <div className="mt-4 flex items-start gap-2">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={() => setAgreedToTerms(!agreedToTerms)}
                className="mt-1 accent-blue-600 cursor-pointer"
              />
              <label className="text-sm text-gray-300 flex items-center gap-1">
                Eu li e concordo com os{" "}
                <a
                  href="https://docs.google.com/document/d/1RFmcAHwKQw77QpyaaHduWz86CuWrhb_bRqSwi85PA9c/edit?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline hover:text-blue-400 transition"
                >
                  termos
                </a>
                <span className="text-red-500">*</span>
              </label>
            </div>

            {termsError && (
              <p className="text-red-500 text-sm mt-1">{termsError}</p>
            )}
          </div>

          <button
            onClick={() => {
              let hasError = false;
              setNomeError("");
              setPhoneError("");
              setTermsError("");

              if (!nome.trim()) {
                setNomeError("O nome é obrigatório.");
                hasError = true;
              }

              if (!phone.trim()) {
                setPhoneError("O WhatsApp é obrigatório.");
                hasError = true;
              }

              if (!agreedToTerms) {
                setTermsError(
                  "Você deve concordar com os termos para continuar."
                );
                hasError = true;
              }

              if (!hasError) {
                setStep(2);
              }
            }}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-md transition cursor-pointer"
          >
            PAGAR COM PIX
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-gray-950 w-full h-full py-4 min-h-screen px-2">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="bg-gray-950 backdrop-blur-[15px] border border-[rgba(59,130,246,0.3)] rounded-md max-w-md mx-auto text-center min-h-[90vh] flex justify-start items-center flex-col"
      >
        <h1 className="w-full px-4 py-4 bg-[linear-gradient(135deg,rgba(59,130,246,0.1),rgba(37,99,235,0.05))] border-b border-b-[rgba(148,163,184,0.15)] text-3xl font-extrabold mb-6">
          Pague o valor abaixo
          <br />
          <span className="text-4xl block mt-2 text-blue-700">
            R$ {discountedTotal.toFixed(2).replace(".", ",")}
          </span>
        </h1>
        <div className="px-4">
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
            className="select-all w-full p-2 bg-gray-800 outline-none mb-4 cursor-pointer flex justify-between items-center rounded-md transition hover:scale-105"
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
            className="text-gray-300 transition hover:text-gray-400 text-sm cursor-pointer mb-4"
          >
            Cancelar e voltar ao início
          </button>
        </div>
      </motion.div>
    </div>
  );
}
