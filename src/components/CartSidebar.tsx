"use client";

import { useCart, CartItem } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { FaTimes } from "react-icons/fa";
import { IoTrashBin } from "react-icons/io5";

type CartSidebarProps = {
  onClose: () => void;
};

export default function CartSidebar({ onClose }: CartSidebarProps) {
  const { cart, updateQuantity, removeFromCart } = useCart();

  const handleDecrease = (item: CartItem) => {
    if (!item.product) return;
    if (item.quantity > 1) {
      updateQuantity(
        item.product.id,
        item.variation?.name ?? null,
        item.quantity - 1
      );
    }
  };

  const handleIncrease = (item: CartItem) => {
    if (!item.product) return;
    updateQuantity(
      item.product.id,
      item.variation?.name ?? null,
      item.quantity + 1
    );
  };

  const handleRemove = (item: CartItem) => {
    if (!item.product) return;
    removeFromCart(item.product.id, item.variation?.name ?? null);
  };

  return (
    <>
      {/* Fundo semi-transparente */}
      <div
        onClick={onClose}
        className="fixed inset-0 h-full min-h-screen bg-black/30 z-40"
        aria-label="Fechar carrinho"
      />

      {/* Sidebar */}
      <aside className="fixed top-0 right-0 h-full min-h-screen z-99 w-96 bg-[rgba(10,10,10,0.95)] backdrop-blur-[15px] shadow-lg flex flex-col p-4">
        <header className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#2563eb]">Carrinho</h2>
          <button
            onClick={onClose}
            aria-label="Fechar carrinho"
            className="text-gray-300 transition duration-300 ease hover:text-white text-2xl font-bold cursor-pointer"
          >
            <FaTimes />
          </button>
        </header>

        {cart.length === 0 ? (
          <p className="text-center text-gray-400 text-lg mt-10">
            Seu carrinho está vazio.
          </p>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <ul>
              {cart.map((item) => {
                const price =
                  item.variation?.price ??
                  (item.product.promoEnabled && item.product.promo
                    ? item.product.promo
                    : item.product.price);

                return (
                  <li
                    key={`${item.product.id}-${
                      item.variation?.name ?? "default"
                    }`}
                    className="flex items-center gap-4 justify-between p-4 border-b border-[#1c388e7c]"
                  >
                    <div className="flex items-center flex-col gap-4 justify-center p-4">
                      <div className="flex items-center justify-between gap-4">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          width={100}
                          height={100}
                          className="w-full object-cover rounded"
                        />
                        <div className="flex items-start flex-col justify-between">
                          <h3 className="font-semibold">{item.product.name}</h3>
                          {item.variation && (
                            <p className="text-sm text-gray-400">
                              <span className="font-medium">
                                {item.variation.name}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDecrease(item)}
                          className="quantity-btn"
                          aria-label="Diminuir quantidade"
                        >
                          −
                        </button>
                        <span className="w-6 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleIncrease(item)}
                          className="quantity-btn"
                          aria-label="Aumentar quantidade"
                        >
                          +
                        </button>

                        <div className="w-24 text-right font-semibold flex flex-col items-end">
                          {item.product.promoEnabled &&
                          item.product.promo &&
                          !item.variation ? (
                            <>
                              <span className="line-through text-sm text-gray-400">
                                R${" "}
                                {((item.product.price ?? 0) * item.quantity)
                                  .toFixed(2)
                                  .replace(".", ",")}
                              </span>
                              <span>
                                R${" "}
                                {((item.product.promo ?? 0) * item.quantity)
                                  .toFixed(2)
                                  .replace(".", ",")}
                              </span>
                            </>
                          ) : (
                            <span>
                              R${" "}
                              {((price ?? 0) * item.quantity)
                                .toFixed(2)
                                .replace(".", ",")}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemove(item)}
                      className="text-red-600 transition duration-300 ease hover:text-red-800 font-bold text-xl cursor-pointer"
                      aria-label="Remover item"
                    >
                      <IoTrashBin />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Total e botão finalizar */}
        {cart.length > 0 && (
          <>
            <div className="flex justify-between items-center font-bold text-xl mt-4 mb-4">
              <span>Total:</span>
              <span className="text-[#568cff] text-[1.5rem]">
                R${" "}
                {cart
                  .reduce((acc, item) => {
                    const unitPrice =
                      item.variation?.price ??
                      (item.product.promoEnabled && item.product.promo != null
                        ? item.product.promo
                        : item.product.price ?? 0);
                    return acc + unitPrice * item.quantity;
                  }, 0)
                  .toFixed(2)
                  .replace(".", ",")}
              </span>
            </div>

            <Link
              href="/checkout"
              className="block w-full text-center bg-[#2563eb] text-white font-semibold py-3 rounded hover:bg-[#1d4ed8] transition"
            >
              Finalizar Compra
            </Link>
          </>
        )}
      </aside>
    </>
  );
}
