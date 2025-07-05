"use client";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart } = useCart();

  const handleDecrease = (id: string, quantity: number) => {
    if (quantity > 1) {
      updateQuantity(id, quantity - 1);
    }
  };

  const handleIncrease = (id: string, quantity: number) => {
    updateQuantity(id, quantity + 1);
  };

  return (
    <main className="p-6 max-w-4xl mx-auto flex items-start justify-center flex-col">
      <Link href="/" className="back-button">
        <FaArrowLeft />
        Voltar para a loja
      </Link>
      <div className="w-full flex justify-center items-center">
        <div className="w-full max-w-3xl min-h-[40vh]">
          <h1 className="text-3xl font-bold mb-6 text-[#2563eb] text-center">
            Carrinho
          </h1>

          {cart.length === 0 ? (
            <p className="text-center text-gray-400 text-lg">
              Seu carrinho está vazio.
            </p>
          ) : (
            <>
              <div className="flex items-center justify-between p-4 border-b border-[#1c388e7c]">
                <p>PRODUTO</p>
                <div className="flex items-center justify-center gap-26">
                  <p>QUANTIDADE</p>
                  <p>SUBTOTAL</p>
                </div>
              </div>
              <ul className="">
                {cart.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between p-4 rounded-lg transition border-b border-[#1c388e7c]"
                  >
                    <div className="flex items-center gap-4">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={100}
                        height={100}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div>
                        <h2 className="font-semibold text-lg">{item.name}</h2>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Controle quantidade */}
                      <button
                        onClick={() => handleDecrease(item.id, item.quantity)}
                        className="quantity-btn"
                        aria-label={`Diminuir quantidade de ${item.name}`}
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleIncrease(item.id, item.quantity)}
                        className="quantity-btn"
                        aria-label={`Aumentar quantidade de ${item.name}`}
                      >
                        +
                      </button>

                      {/* Total por produto */}
                      <div className="w-32 text-right font-semibold flex flex-col items-end">
                        {item.promoEnabled && item.promo ? (
                          <>
                            <span className="line-through text-sm text-gray-400">
                              R${" "}
                              {Number(item.price * item.quantity)
                                .toFixed(2)
                                .replace(".", ",")}
                            </span>
                            <span className="">
                              R${" "}
                              {Number(item.promo * item.quantity)
                                .toFixed(2)
                                .replace(".", ",")}
                            </span>
                          </>
                        ) : (
                          <span className="">
                            R${" "}
                            {Number(item.price * item.quantity)
                              .toFixed(2)
                              .replace(".", ",")}
                          </span>
                        )}
                      </div>

                      {/* Botão remover */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-800 font-bold text-xl select-none cursor-pointer"
                        aria-label={`Remover ${item.name} do carrinho`}
                        title="Remover item"
                      >
                        ×
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="flex justify-between items-center font-bold text-xl p-4">
                <span>Total:</span>
                <span className="text-[#568cff] text-[1.5rem]">
                  R${" "}
                  {cart
                    .reduce((acc, item) => {
                      const unitPrice =
                        item.promoEnabled && item.promo
                          ? item.promo
                          : item.price;
                      return acc + unitPrice * item.quantity;
                    }, 0)
                    .toFixed(2)
                    .replace(".", ",")}
                </span>
              </div>

              <Link
                href="/checkout"
                className="block mt-6 w-full text-center bg-[#2563eb] text-white font-semibold py-3 rounded hover:bg-[#1d4ed8] transition"
              >
                Finalizar Compra
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
