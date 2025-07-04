"use client";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

export default function CheckoutPage() {
  const { total } = useCart();
  const chavePix = "chavepix@gmail.com";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(chavePix);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 max-w-xl mx-auto text-center">
      <h1 className="text-xl font-bold mb-4">Pagamento via PIX</h1>
      <p className="mb-2">
        Realize o pagamento de{" "}
        <span className="font-bold">
          R$ {Number(total).toFixed(2).replace(".", ",")}
        </span>
      </p>
      <p>Para a seguinte chave PIX:</p>
      <div className="bg-gray-100 p-2 mt-2 rounded font-mono">{chavePix}</div>

      <button
        onClick={handleCopy}
        className="bg-blue-600 text-white px-4 py-2 mt-3 rounded hover:bg-blue-700"
      >
        {copied ? "Chave copiada!" : "Copiar chave"}
      </button>
    </div>
  );
}
