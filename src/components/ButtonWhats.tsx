"use client";

import { useState } from "react";
import Image from "next/image";
import suporteImg from "../../public/support-icon.png";
import { FaWhatsapp, FaPhoneAlt } from "react-icons/fa";

export default function ButtonWhats() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Botão flutuante */}
      <div
        onClick={() => setIsOpen(true)}
        className="fixed right-3 bottom-3 cursor-pointer z-50 transition hover:scale-105 btn-suporte"
      >
        <Image
          src={suporteImg}
          alt="Suporte Jbtools"
          width={120}
          height={120}
        />
      </div>

      {/* Modal flutuante */}
      {isOpen && (
        <div className="fixed right-3 bottom-28 z-50 w-72 bg-[rgba(10,10,10,0.95)] backdrop-blur-[15px] border border-[rgba(59,130,246,0.3)] shadow-xl rounded-lg p-4 border- animate-fade-in">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-white">Fale conosco</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-300 hover:text-white text-sm cursor-pointer"
            >
              ✕
            </button>
          </div>
          <p className="text-sm text-gray-200 mt-2">
            Entre em contato conosco pelo WhatsApp para suporte rápido e
            eficiente!
          </p>
          <span className="mt-4 w-full flex justify-center items-center gap-1">
            <FaPhoneAlt className="w-5 h-5" />
            41 9684-4896
          </span>
          <a
            href="https://api.whatsapp.com/send/?phone=554196844896&text&type=phone_number&app_absent=0"
            target="_blank"
            className="w-full mt-2 flex justify-center items-center gap-1 bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 hover:text-gray-200 transition"
          >
            <FaWhatsapp aria-label="WhatsApp" className="w-5 h-5" />
            Falar no WhatsApp
          </a>
        </div>
      )}
    </>
  );
}
